
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { BusinessData, AppRoute } from './types';
import { DEFAULT_BUSINESS_DATA, APP_NAME } from './constants';
import { generateHtml, generateCss, generateJs } from './services/templateGenerator';
import { refineDescription } from './services/geminiService';
import { deployToGitHub } from './services/githubService';
import JSZip from 'jszip';
import saveAs from 'file-saver';

// --- Subcomponents ---

const Navbar = () => (
  <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '/'}>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-bolt text-white text-sm"></i>
        </div>
        <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="#/builder" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition">
          Get Started
        </a>
      </div>
    </div>
  </nav>
);

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Free Professional Website Generator
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
          Create a Professional Website in <span className="text-indigo-600">5 Minutes.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The easiest way to get your business online. Mobile-ready, SEO-optimized, and WhatsApp-integrated. Totally free to download and deploy.
        </p>
        <button 
          onClick={() => navigate(AppRoute.BUILDER)}
          className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-2xl shadow-indigo-200 active:scale-95"
        >
          Create My Website Now
        </button>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          {[
            { icon: "fa-magic", title: "AI Copywriting", desc: "Instantly generate catchy business descriptions using Google Gemini AI." },
            { icon: "fa-whatsapp", title: "Lead Generation", desc: "Built-in WhatsApp buttons to convert visitors into customers immediately." },
            { icon: "fa-github", title: "Free Deployment", desc: "Deploy directly to your own GitHub Pages for free hosting forever." }
          ].map((feat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 text-xl">
                <i className={`fas ${feat.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-32 max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -mr-32 -mt-32"></div>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">What's Included?</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-left max-w-xl mx-auto text-slate-300">
            <li className="flex items-center gap-3"><i className="fas fa-check text-indigo-400"></i> Full ZIP Code Download</li>
            <li className="flex items-center gap-3"><i className="fas fa-check text-indigo-400"></i> Deploy to GitHub Pages</li>
            <li className="flex items-center gap-3"><i className="fas fa-check text-indigo-400"></i> No Hidden Brand Watermarks</li>
            <li className="flex items-center gap-3"><i className="fas fa-check text-indigo-400"></i> Mobile Responsive Design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const BuilderPage = () => {
  const [data, setData] = useState<BusinessData>(DEFAULT_BUSINESS_DATA);
  const [servicesInput, setServicesInput] = useState(DEFAULT_BUSINESS_DATA.services.join(', '));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRefining, setIsRefining] = useState(false);
  const [ghToken, setGhToken] = useState('');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deployUrl, setDeployUrl] = useState('');
  const [showDeployModal, setShowDeployModal] = useState(false);

  const validateField = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 3) error = 'Business name must be at least 3 characters.';
        break;
      case 'description':
        if (!value || value.trim().length < 10) error = 'Description must be at least 10 characters.';
        break;
      case 'phone':
        if (!value || !/^\+?[0-9\s-]{10,}$/.test(value)) error = 'Invalid phone number format.';
        break;
      case 'whatsapp':
        if (!value || !/^[0-9]{10,15}$/.test(value)) error = 'Enter number only (e.g. 919876543210).';
        break;
      case 'address':
        if (!value || value.trim().length < 5) error = 'Address is too short.';
        break;
      case 'services':
        if (!value || value.length === 0) error = 'At least one service required.';
        break;
      default:
        break;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) newErrors[name] = error;
      else delete newErrors[name];
      return newErrors;
    });
    return !error;
  };

  const validateAll = () => {
    const fieldValidations = [
      validateField('name', data.name),
      validateField('description', data.description),
      validateField('phone', data.phone),
      validateField('whatsapp', data.whatsapp),
      validateField('address', data.address),
      validateField('services', data.services),
    ];
    return fieldValidations.every(v => v === true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setServicesInput(value);
    const services = value.split(',').map(s => s.trim()).filter(s => s !== "");
    setData(prev => ({ ...prev, services }));
    validateField('services', services);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'heroImageUrl' | 'aboutImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefine = async () => {
    if (!data.description) return;
    setIsRefining(true);
    const refined = await refineDescription(data.name, data.description);
    setData(prev => ({ ...prev, description: refined }));
    validateField('description', refined);
    setIsRefining(false);
  };

  const handleDownload = async () => {
    if (!validateAll()) {
      alert("Please fix the errors in the form before downloading.");
      return;
    }
    const zip = new JSZip();
    zip.file("index.html", generateHtml(data, true));
    zip.file("style.css", generateCss(data.themeColor));
    zip.file("script.js", generateJs());
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${data.name.toLowerCase().replace(/\s+/g, '-')}-website.zip`);
  };

  const handleDeployTrigger = () => {
    if (!validateAll()) {
      alert("Please fix the errors in the form before deploying.");
      return;
    }
    setShowDeployModal(true);
  };

  const handleDeploy = async () => {
    if (!ghToken) return;
    setDeployStatus('loading');
    try {
      const url = await deployToGitHub(ghToken, data.name.toLowerCase().replace(/\s+/g, '-'), [
        { path: 'index.html', content: generateHtml(data, true) },
        { path: 'style.css', content: generateCss(data.themeColor) },
        { path: 'script.js', content: generateJs() }
      ]);
      setDeployUrl(url);
      setDeployStatus('success');
    } catch (err: any) {
      setDeployStatus('error');
      alert(err.message || 'Deployment failed');
    }
  };

  const iframeSrcDoc = generateHtml(data, true);

  // --- High-End Editor Styling ---
  const inputBaseClass = "w-full px-4 py-3.5 bg-[#33353F] text-white rounded-xl border-2 transition-all outline-none shadow-inner font-medium placeholder-slate-500";
  const inputFocusClass = "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20";
  const inputErrorClass = "border-red-500 bg-red-950/20 ring-4 ring-red-500/10";
  const inputDefaultClass = "border-transparent hover:border-slate-600";

  const getInputClass = (fieldName: string) => {
    return `${inputBaseClass} ${inputFocusClass} ${errors[fieldName] ? inputErrorClass : inputDefaultClass}`;
  };

  return (
    <div className="pt-20 pb-10 px-4 min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-8">
        {/* Sidebar: Premium Editor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-y-auto max-h-[calc(100vh-120px)] sticky top-24">
            <header className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-slate-900">Builder</h2>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Pro Editor</span>
              </div>
              <p className="text-slate-400 text-xs font-medium">Configure your business details below.</p>
            </header>
            
            <div className="space-y-10">
              {/* Basic Info Section */}
              <section className="space-y-6">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">
                   Business Information
                 </h3>
                
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" name="name" value={data.name} onChange={handleChange}
                    className={getInputClass('name')}
                    placeholder="Green Valley Cafe"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-1 relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <textarea 
                      name="description" value={data.description} onChange={handleChange}
                      className={`${getInputClass('description')} h-40 resize-none leading-relaxed pb-12`}
                      placeholder="Share your story..."
                    />
                    <button 
                      onClick={handleRefine}
                      disabled={isRefining}
                      className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-300/50 disabled:opacity-50"
                    >
                      {isRefining ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-sparkles text-[10px]"></i>}
                      {isRefining ? 'Polishing...' : 'Refine with AI'}
                    </button>
                  </div>
                  {errors.description && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" name="phone" value={data.phone} onChange={handleChange}
                      className={getInputClass('phone')}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.phone}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" name="whatsapp" value={data.whatsapp} onChange={handleChange}
                      className={getInputClass('whatsapp')}
                      placeholder="919876543210"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.whatsapp}</p>}
                  </div>
                </div>
              </section>

              {/* Design Section */}
              <section className="space-y-6 pt-8 border-t border-slate-100">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">
                   Design & Media
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Theme Color</label>
                    <div className="relative h-[58px] overflow-hidden rounded-xl border-2 border-slate-100 shadow-sm">
                      <input 
                        type="color" name="themeColor" value={data.themeColor} onChange={handleChange}
                        className="absolute inset-0 w-full h-full p-0 cursor-pointer border-none scale-150"
                      />
                    </div>
                  </div>
                   <div className="flex flex-col space-y-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Logo</label>
                    <label className="h-[58px] w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition flex items-center justify-center gap-3 group">
                       <i className="fas fa-upload text-slate-300 group-hover:text-indigo-500 transition-colors"></i>
                       <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider truncate">
                         {data.logoUrl ? "Change" : "Upload"}
                       </span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} />
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                   <div className="flex flex-col space-y-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Hero Image</label>
                    <label className="h-[58px] w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition flex items-center justify-center gap-3 group">
                       <i className="fas fa-image text-slate-300 group-hover:text-indigo-500 transition-colors text-lg"></i>
                       <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider truncate">
                         {data.heroImageUrl ? "Change Hero" : "Hero Image"}
                       </span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'heroImageUrl')} />
                    </label>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">About Image</label>
                    <label className="h-[58px] w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition flex items-center justify-center gap-3 group">
                       <i className="fas fa-panorama text-slate-300 group-hover:text-indigo-500 transition-colors text-lg"></i>
                       <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider truncate">
                         {data.aboutImageUrl ? "Change About" : "About Image"}
                       </span>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'aboutImageUrl')} />
                    </label>
                  </div>
                </div>
              </section>

              {/* Extra Info Section */}
              <section className="space-y-6 pt-8 border-t border-slate-100">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">
                   Additional Details
                </h3>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Services <span className="text-slate-400 text-[10px] font-medium">(comma separated)</span>
                  </label>
                  <input 
                    type="text" 
                    value={servicesInput} 
                    onChange={handleServicesChange}
                    className={getInputClass('services')}
                    placeholder="Coffee, Bakery, Catering"
                  />
                  {errors.services && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.services}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" name="address" value={data.address} onChange={handleChange}
                    className={getInputClass('address')}
                    placeholder="123 Street, City"
                  />
                  {errors.address && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.address}</p>}
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 space-y-4">
              <button 
                onClick={handleDownload}
                className="w-full py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-200 active:scale-95"
              >
                <i className="fas fa-file-export text-sm"></i>
                Download Project
              </button>

              <button 
                onClick={handleDeployTrigger}
                className="w-full py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all bg-slate-900 text-white hover:bg-black hover:shadow-2xl hover:shadow-slate-300 active:scale-95"
              >
                <i className="fab fa-github text-sm"></i>
                Publish Online
              </button>
            </div>
          </div>
        </div>

        {/* Main: Preview */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl flex-grow h-[calc(100vh-150px)] relative group">
            <div className="absolute top-5 left-5 right-5 h-12 bg-slate-900/10 border border-white/20 rounded-full flex items-center px-6 gap-4 backdrop-blur-xl z-10">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-400/80 shadow-inner"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80 shadow-inner"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80 shadow-inner"></div>
              </div>
              <div className="bg-white/40 px-6 py-1.5 rounded-full text-[11px] font-black tracking-wider flex-grow text-center text-slate-600 truncate border border-white/40 uppercase">
                {data.name.toLowerCase().replace(/\s+/g, '-')}.kakanibuild.app
              </div>
            </div>
            <iframe 
              srcDoc={iframeSrcDoc} 
              className="w-full h-full border-none pt-20"
              title="Preview"
            />
          </div>
        </div>
      </div>

      {/* GitHub Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Go Live</h3>
              <button onClick={() => setShowDeployModal(false)} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <p className="text-slate-500 mb-10 text-sm leading-relaxed font-medium">
              We'll deploy your site to GitHub Pages for free. This requires a GitHub token.
            </p>
            
            <div className="space-y-8 mb-10">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 ml-1">GITHUB TOKEN</label>
                <input 
                  type="password" 
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className={inputBaseClass + " " + inputDefaultClass + " " + inputFocusClass}
                />
                <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" className="text-indigo-600 text-[11px] mt-4 font-black inline-flex items-center gap-2 hover:underline decoration-2">
                  <i className="fas fa-key text-[10px]"></i>
                  Generate Token (repo scope)
                </a>
              </div>
            </div>

            {deployStatus === 'success' ? (
              <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2rem] mb-10">
                <p className="text-emerald-700 font-black text-sm mb-3 flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  WEBSITE PUBLISHED
                </p>
                <a href={deployUrl} target="_blank" className="text-emerald-600 text-xs truncate block font-bold underline decoration-2">{deployUrl}</a>
                <p className="text-[10px] text-emerald-500 mt-4 font-bold uppercase tracking-widest italic opacity-70">
                  * Live in ~2 minutes
                </p>
              </div>
            ) : (
              <button 
                onClick={handleDeploy}
                disabled={deployStatus === 'loading' || !ghToken}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
              >
                {deployStatus === 'loading' ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fab fa-github"></i>}
                {deployStatus === 'loading' ? 'PUBLISHING...' : 'START DEPLOYMENT'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MainApp = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path={AppRoute.LANDING} element={<LandingPage />} />
        <Route path={AppRoute.BUILDER} element={<BuilderPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <MainApp />
    </HashRouter>
  );
}

export default App;
