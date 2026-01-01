import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { BusinessData, AppRoute, ServiceItem, ThemeId } from './types';
import { DEFAULT_BUSINESS_DATA, APP_NAME } from './constants';
import { generateHtml, generateCss, generateJs } from './services/templateGenerator';
import { refineDescription, generateHeroImage } from './services/geminiService';
import { deployToGitHub } from './services/githubService';
import JSZip from 'jszip';
import saveAs from 'file-saver';

// --- Auth Mock ---
const useAuth = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kakanibuild_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  const login = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('kakanibuild_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kakanibuild_user');
  };

  return { user, login, logout, isLoading };
};

// --- Global Navbar ---
const Navbar = ({ user, logout }: { user: any; logout: () => void }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed w-full top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(AppRoute.LANDING)}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <i className="fas fa-bolt text-white text-sm"></i>
          </div>
          <span className="font-black text-lg tracking-tighter text-slate-900">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to={AppRoute.README} className="hidden md:block text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition tracking-[0.2em]">Features</Link>
          {user ? (
            <button onClick={() => { logout(); navigate(AppRoute.LANDING); }} className="text-xs font-bold text-red-500">Logout</button>
          ) : (
            <Link to={AppRoute.LOGIN} className="text-xs font-bold text-indigo-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
      <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">v3.3 - Dual-View Preview</div>
      <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] text-slate-900">Infinite Grid. <br/><span className="text-indigo-600">Dual View.</span></h1>
      <p className="text-lg text-slate-500 mb-12 font-medium">Create professional, flexible business layouts with AI. Toggle between desktop and mobile previews to ensure perfect responsiveness.</p>
      <button onClick={() => navigate(AppRoute.BUILDER)} className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-200 hover:scale-105 transition">Start Building</button>
    </div>
  );
};

const AuthPage = ({ type, login }: { type: 'login' | 'register', login: any }) => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 px-6 min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md border border-slate-200 shadow-2xl">
        <h2 className="text-3xl font-black mb-8">{type === 'login' ? 'Welcome back' : 'Create Account'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); login('Entrepreneur', 'user@example.com'); navigate(AppRoute.BUILDER); }} className="space-y-4">
          <input placeholder="Email" className="w-full px-4 py-4 bg-slate-50 rounded-xl" required />
          <input type="password" placeholder="Password" className="w-full px-4 py-4 bg-slate-50 rounded-xl" required />
          <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">Continue</button>
        </form>
      </div>
    </div>
  );
};

const BuilderPage = () => {
  const [data, setData] = useState<BusinessData>(DEFAULT_BUSINESS_DATA);
  const [activeTab, setActiveTab] = useState<'identity' | 'content' | 'services' | 'style'>('identity');
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [ghToken, setGhToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const GITHUB_TOKEN_URL = "https://github.com/settings/tokens/new?scopes=repo&description=Kakani%20Build%20Deployment";

  const themes: {id: ThemeId, name: string}[] = [
    {id: 'modern', name: 'Modern'},
    {id: 'midnight', name: 'Midnight'},
    {id: 'executive', name: 'Executive'},
    {id: 'organic', name: 'Organic'},
    {id: 'neobrutalist', name: 'Pop Art'},
    {id: 'luxury', name: 'Luxury'},
    {id: 'editorial', name: 'Editorial'},
    {id: 'futuristic', name: 'Cyberpunk'},
    {id: 'vibrant', name: 'Vibrant'},
    {id: 'vintage', name: 'Heritage'}
  ];

  const handleAddService = () => {
    const id = Date.now().toString();
    setData(prev => ({
      ...prev,
      services: [...prev.services, { id, title: 'New Service', description: 'Describe what you do...', icon: 'fa-star' }]
    }));
  };

  const updateService = (id: string, field: keyof ServiceItem, val: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: val } : s)
    }));
  };

  const removeService = (id: string) => {
    setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  const handleRefine = async () => {
    setIsRefining(true);
    const refined = await refineDescription(data.name, data.description);
    setData(prev => ({ ...prev, description: refined }));
    setIsRefining(false);
  };

  const handleGenerateImg = async () => {
    setIsGeneratingImg(true);
    const url = await generateHeroImage(data.name, data.description);
    if (url) setData(prev => ({ ...prev, heroImageUrl: url }));
    setIsGeneratingImg(false);
  };

  const iframeDoc = useMemo(() => generateHtml(data, true), [data]);

  return (
    <div className="pt-16 pb-24 md:pb-0 min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-0 lg:gap-8 lg:p-6 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Sidebar Editor */}
        <aside className={`${mobileMode === 'edit' ? 'flex' : 'hidden'} lg:flex flex-col lg:col-span-5 bg-white lg:rounded-[2.5rem] border-r lg:border border-slate-200 shadow-xl overflow-hidden`}>
          <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
            <nav className="flex gap-1 overflow-x-auto no-scrollbar">
              {(['identity', 'content', 'services', 'style'] as const).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition shrink-0 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            {activeTab === 'identity' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">General Identity</label>
                  <input placeholder="Business Name" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 transition outline-none font-bold" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                  <input placeholder="WhatsApp Number" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 transition outline-none text-sm" value={data.whatsapp} onChange={e => setData({...data, whatsapp: e.target.value})} />
                  <input placeholder="Physical Address" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 transition outline-none text-sm" value={data.address} onChange={e => setData({...data, address: e.target.value})} />
                </div>
                <div className="space-y-2 pt-4 border-t border-slate-50">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Connective Socials</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['instagram', 'facebook', 'linkedin'].map(soc => (
                      <div key={soc} className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400">
                          <i className={`fab fa-${soc}`}></i>
                        </div>
                        <input 
                          placeholder={`${soc.charAt(0).toUpperCase() + soc.slice(1)} Link`} 
                          className="flex-1 bg-transparent text-xs outline-none" 
                          value={(data.socials as any)[soc] || ''} 
                          onChange={e => setData({...data, socials: {...data.socials, [soc]: e.target.value}})} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">The Narrative</label>
                  <div className="relative group">
                    <textarea 
                      placeholder="Your brand's story..." 
                      className="w-full px-5 py-5 bg-slate-50 rounded-[2rem] h-48 resize-none text-sm border-2 border-transparent focus:border-indigo-600 transition"
                      value={data.description} 
                      onChange={e => setData({...data, description: e.target.value})} 
                    />
                    <button 
                      onClick={handleRefine} disabled={isRefining}
                      className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
                    >
                      {isRefining ? <i className="fas fa-spinner animate-spin"></i> : 'AI Optimize'}
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white text-center">
                   <h3 className="text-xl font-black mb-2">AI Visual Studio</h3>
                   <p className="text-xs text-slate-400 mb-6">Create brand-specific cinematic visuals instantly.</p>
                   <button 
                     onClick={handleGenerateImg} disabled={isGeneratingImg}
                     className="w-full py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {isGeneratingImg ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
                     {isGeneratingImg ? 'Synthesizing...' : 'Generate Hero Vision'}
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <button 
                  onClick={handleAddService}
                  className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 font-black uppercase tracking-widest text-xs hover:border-indigo-100 hover:text-indigo-400 hover:bg-indigo-50 transition group"
                >
                  <i className="fas fa-plus-circle text-2xl mb-2 group-hover:scale-110 transition"></i><br/>Add New Service
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.services.map((s) => (
                    <div key={s.id} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                      <button onClick={() => removeService(s.id)} className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition">
                        <i className="fas fa-times text-[10px]"></i>
                      </button>
                      <input 
                        className="w-full bg-transparent font-black text-xs mb-2 outline-none border-b border-transparent focus:border-indigo-200" 
                        value={s.title} 
                        onChange={e => updateService(s.id, 'title', e.target.value)}
                        placeholder="Service"
                      />
                      <textarea 
                        className="w-full bg-transparent text-[10px] text-slate-500 resize-none outline-none leading-tight h-12" 
                        value={s.description} 
                        onChange={e => updateService(s.id, 'description', e.target.value)}
                        placeholder="Description..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Layout Density</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl">
                    {[1, 2, 3].map(cols => (
                      <button 
                        key={cols}
                        onClick={() => setData({...data, serviceColumns: cols as 1|2|3})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase transition ${data.serviceColumns === cols ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
                      >
                        {cols === 1 ? 'Wide' : cols === 2 ? 'Balanced' : 'Dense'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thematic Direction</label>
                  <div className="grid grid-cols-2 gap-4">
                    {themes.map(t => (
                      <button 
                        key={t.id} onClick={() => setData({...data, themeId: t.id})}
                        className={`p-4 rounded-[2rem] border-2 text-left transition ${data.themeId === t.id ? 'border-indigo-600 bg-indigo-50/50 scale-105 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="h-10 bg-white rounded-xl mb-2 border border-slate-50 shadow-inner flex items-center justify-center">
                          <span className="text-[8px] font-black uppercase text-slate-200">{t.id}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase ${data.themeId === t.id ? 'text-indigo-600' : 'text-slate-900'}`}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">Branding Accent</label>
                  <div className="flex items-center gap-4">
                    <input type="color" className="w-16 h-16 rounded-full cursor-pointer bg-white p-1 border border-slate-200 shadow-sm" value={data.themeColor} onChange={e => setData({...data, themeColor: e.target.value})} />
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{data.themeColor}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
             <button onClick={() => setShowDeploy(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">Ship to Cloud</button>
             <button onClick={() => {
                const zip = new JSZip();
                zip.file("index.html", generateHtml(data, true));
                zip.file("style.css", generateCss(data.themeColor));
                zip.file("script.js", generateJs());
                zip.generateAsync({type:"blob"}).then(c => saveAs(c, `${data.name.toLowerCase().replace(/\s/g, '-')}.zip`));
             }} className="w-full py-4 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50">Local Export</button>
             <a href={GITHUB_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="block text-center text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition">Need a GitHub Token?</a>
          </div>
        </aside>

        {/* Live Preview Workspace */}
        <main className={`${mobileMode === 'preview' ? 'flex' : 'hidden'} lg:flex flex-col lg:col-span-7 h-full overflow-hidden`}>
          {/* Preview Controls */}
          <div className="hidden lg:flex items-center justify-center gap-4 py-3 bg-white border-b border-slate-100 rounded-t-[3.5rem] mt-4 mx-4">
             <button 
              onClick={() => setPreviewDevice('mobile')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
             >
               <i className="fas fa-mobile-alt"></i> Mobile
             </button>
             <button 
              onClick={() => setPreviewDevice('desktop')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
             >
               <i className="fas fa-desktop"></i> Desktop
             </button>
          </div>

          <div className="bg-slate-200/40 flex-1 lg:rounded-b-[3.5rem] border-x-8 border-b-8 border-white shadow-inner flex items-center justify-center relative overflow-hidden group p-4 lg:p-8">
             {/* Device Frame */}
             <div className={`transition-all duration-700 overflow-hidden relative shadow-2xl bg-white
                ${mobileMode === 'preview' || window.innerWidth < 1024 
                  ? 'w-full h-full' 
                  : previewDevice === 'mobile'
                    ? 'w-full h-[850px] lg:max-w-[420px] rounded-[3.5rem] border-[14px] border-slate-900'
                    : 'w-full h-full rounded-2xl border-[4px] border-slate-800'
                }`}
             >
                {/* Notch for mobile frame */}
                {previewDevice === 'mobile' && (
                  <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-30"></div>
                )}
                
                {/* Browser bar for desktop frame */}
                {previewDevice === 'desktop' && (
                  <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700 z-30">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-slate-700 h-4 rounded-md mx-4 opacity-50"></div>
                  </div>
                )}

                <iframe 
                  srcDoc={iframeDoc} 
                  className={`w-full h-full bg-white border-none ${previewDevice === 'desktop' ? 'h-[calc(100%-32px)]' : 'h-full'}`} 
                  title="Studio Output" 
                />
                
                {/* Status Overlay */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 opacity-0 group-hover:opacity-100 transition duration-500">
                  <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap shadow-2xl">
                    {previewDevice === 'mobile' ? 'Mobile Optimizing' : 'Desktop Rendering'}
                  </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Responsive Mode Toggle (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 h-20 flex items-center justify-around px-12 z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button onClick={() => setMobileMode('edit')} className={`flex flex-col items-center gap-1.5 transition ${mobileMode === 'edit' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <div className={`w-14 h-8 rounded-2xl flex items-center justify-center transition ${mobileMode === 'edit' ? 'bg-indigo-50' : ''}`}><i className="fas fa-layer-group"></i></div>
          <span className="text-[9px] font-black uppercase tracking-widest">Studio</span>
        </button>
        <button onClick={() => setMobileMode('preview')} className={`flex flex-col items-center gap-1.5 transition ${mobileMode === 'preview' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <div className={`w-14 h-8 rounded-2xl flex items-center justify-center transition ${mobileMode === 'preview' ? 'bg-indigo-50' : ''}`}><i className="fas fa-expand"></i></div>
          <span className="text-[9px] font-black uppercase tracking-widest">Display</span>
        </button>
      </div>

      {/* Deployment Layer */}
      {showDeploy && (
        <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
            <h3 className="text-3xl font-black mb-2 tracking-tighter text-slate-900">Connect to Cloud</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Prepare for takeoff. Deploy your production-ready site directly to GitHub Pages.</p>
            <div className="space-y-4">
              <input type="password" placeholder="GitHub Access Token" className="w-full px-6 py-5 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-600 transition shadow-inner font-mono text-xs" value={ghToken} onChange={e => setGhToken(e.target.value)} />
              <div className="px-2">
                <p className="text-[10px] text-slate-500 font-medium">
                  Don't have a token? <a href={GITHUB_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black uppercase tracking-widest hover:underline">Click here to generate</a>. 
                  Make sure to select the <span className="text-slate-900 font-bold">'repo'</span> scope.
                </p>
              </div>
            </div>
            <div className="mt-10 space-y-4">
              {status === 'success' ? (
                <div className="p-6 bg-emerald-50 text-emerald-700 rounded-[2rem] text-sm font-bold flex flex-col items-center gap-4 text-center">
                  <i className="fas fa-rocket text-4xl animate-bounce"></i>
                  <div>Launch successful. Your business is now global.</div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={async () => {
                      setStatus('loading');
                      try {
                        const url = await deployToGitHub(ghToken, data.name.toLowerCase().replace(/\s/g, '-'), [
                          { path: 'index.html', content: generateHtml(data, true) },
                          { path: 'style.css', content: generateCss(data.themeColor) },
                          { path: 'script.js', content: generateJs() }
                        ]);
                        setStatus('success');
                        setTimeout(() => window.open(url, '_blank'), 2000);
                      } catch (e: any) {
                        alert(e.message);
                        setStatus('error');
                      }
                    }}
                    disabled={!ghToken || status === 'loading'}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 disabled:opacity-50 hover:bg-indigo-700 transition"
                  >
                    {status === 'loading' ? <i className="fas fa-circle-notch animate-spin mr-2"></i> : null}
                    {status === 'loading' ? 'Transmitting Data...' : 'Confirm Global Launch'}
                  </button>
                  <button onClick={() => setShowDeploy(false)} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-600 transition">Cancel Operation</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const { user, login, logout, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 bg-indigo-600 rounded-2xl animate-spin shadow-2xl shadow-indigo-200"></div></div>;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 select-none antialiased">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path={AppRoute.LANDING} element={<LandingPage />} />
          <Route path={AppRoute.LOGIN} element={<AuthPage type="login" login={login} />} />
          <Route path={AppRoute.REGISTER} element={<AuthPage type="register" login={login} />} />
          <Route path={AppRoute.BUILDER} element={<BuilderPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;