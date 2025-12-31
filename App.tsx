import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { BusinessData, AppRoute, ServiceItem, ThemeId } from './types';
import { DEFAULT_BUSINESS_DATA, APP_NAME } from './constants';
import { generateHtml, generateCss, generateJs } from './services/templateGenerator';
import { refineDescription, generateHeroImage } from './services/geminiService';
import { deployToGitHub } from './services/githubService';
import JSZip from 'jszip';
import saveAs from 'file-saver';

// --- Fake Auth Context / State ---
const useAuth = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kakanibuild_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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

// --- Navbar Component ---
const Navbar = ({ user, logout }: { user: any; logout: () => void }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(AppRoute.LANDING)}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-bolt text-white text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to={AppRoute.README} className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition">
            Features
          </Link>
          <div className="h-4 w-px bg-slate-200"></div>
          {user ? (
            <>
              <span className="hidden sm:inline text-xs font-bold text-slate-500 uppercase tracking-widest">
                Hi, {user.name}
              </span>
              <button 
                onClick={() => { logout(); navigate(AppRoute.LANDING); }}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
              <button 
                onClick={() => navigate(AppRoute.BUILDER)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
              >
                My Studio
              </button>
            </>
          ) : (
            <>
              <Link to={AppRoute.LOGIN} className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-2">Login</Link>
              <button 
                onClick={() => navigate(AppRoute.REGISTER)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Page Components ---
const ReadmePage = () => {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl">
          <header className="mb-16">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200">
              <i className="fas fa-bolt text-white text-2xl"></i>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Kakani Build</h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl font-medium italic">
              "The premier AI-driven studio for creating, managing, and deploying professional business websites in seconds."
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8">Core AI Infrastructure</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <i className="fas fa-brain text-indigo-500 mb-6 text-3xl"></i>
                <h3 className="font-bold text-xl mb-3">Copywriting Engine</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Leverages **Gemini 3 Flash** for intelligent text refinement. It processes raw business identity and produces production-ready, SEO-optimized sales copy.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <i className="fas fa-wand-magic-sparkles text-indigo-500 mb-6 text-3xl"></i>
                <h3 className="font-bold text-xl mb-3">Vision Generation</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Integrated with **Gemini 2.5 Flash Image**. Generates high-fidelity, 16:9 cinematic hero images tailored precisely to the business niche.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8">Deployment & Cloud</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-200">
                <i className="fab fa-github mb-6 text-3xl"></i>
                <h3 className="font-bold text-xl mb-3">GitHub Autopilot</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">One-click creation of remote repositories. Automatically enables GitHub Pages and serves your site on the worldwide web instantly.</p>
              </div>
              <div className="p-8 bg-slate-900 text-white rounded-[2rem]">
                <i className="fas fa-file-zipper mb-6 text-3xl"></i>
                <h3 className="font-bold text-xl mb-3">Export Freedom</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Download the entire source code as a portable ZIP. No vendor lock-in; you own every line of HTML, CSS, and JS generated.</p>
              </div>
            </div>
          </section>

          <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
            <Link to={AppRoute.LANDING} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition shadow-xl shadow-indigo-100 inline-block">
              Return to Studio
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ login }: { login: (n: string, e: string) => void }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login("Entrepreneur", formData.email);
      setLoading(false);
      navigate(AppRoute.BUILDER);
    }, 1200);
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-black mb-8">Welcome back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 rounded-xl" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-50 rounded-xl" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold mt-4">
            {loading ? 'Entering...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = ({ login }: { login: (n: string, e: string) => void }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(formData.name, formData.email);
      setLoading(false);
      navigate(AppRoute.BUILDER);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-black mb-8">Create Studio Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 rounded-xl" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-50 rounded-xl" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold mt-4">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 pb-20 px-4 text-center">
      <h1 className="text-6xl font-black mb-6">Your Business, <span className="text-indigo-600">Live in Seconds.</span></h1>
      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">AI-powered website builder for entrepreneurs who want to grow fast.</p>
      <button onClick={() => navigate(AppRoute.BUILDER)} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl">Open Studio</button>
    </div>
  );
};

const ThemePreviewIcon = ({ themeId, color }: { themeId: ThemeId, color: string }) => {
  return (
    <div className="w-full h-16 rounded-xl overflow-hidden mb-2 border border-slate-100 bg-slate-50 flex items-center justify-center text-[10px] font-black uppercase text-slate-400">
      {themeId}
    </div>
  );
};

const BuilderPage = () => {
  const [data, setData] = useState<BusinessData>(DEFAULT_BUSINESS_DATA);
  const [activeTab, setActiveTab] = useState<'identity' | 'content' | 'services' | 'style'>('identity');
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile');
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [ghToken, setGhToken] = useState('');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deployUrl, setDeployUrl] = useState('');

  const themes: { id: ThemeId; name: string; desc: string }[] = [
    { id: 'modern', name: 'Modern', desc: 'Clean & Tech-Ready' },
    { id: 'midnight', name: 'Midnight', desc: 'Sleek Dark Mode' },
    { id: 'executive', name: 'Executive', desc: 'Professional Portfolio' },
    { id: 'organic', name: 'Organic', desc: 'Soft & Natural' },
    { id: 'vibrant', name: 'Vibrant', desc: 'Bold & Energetic' },
    { id: 'neobrutalist', name: 'Pop Art', desc: 'High Contrast' },
    { id: 'luxury', name: 'Luxury', desc: 'Elite & Sophisticated' },
    { id: 'editorial', name: 'Editorial', desc: 'High-Fashion Grid' },
    { id: 'futuristic', name: 'Sci-Fi', desc: 'Neon Cyberpunk' },
    { id: 'vintage', name: 'Heritage', desc: 'Classic & Warm' },
  ];

  const handleRefine = async () => {
    setIsRefining(true);
    const refined = await refineDescription(data.name, data.description);
    setData(prev => ({ ...prev, description: refined }));
    setIsRefining(false);
  };

  const handleGenerateHero = async () => {
    setIsGeneratingImg(true);
    const url = await generateHeroImage(data.name, data.description);
    if (url) setData(prev => ({ ...prev, heroImageUrl: url }));
    setIsGeneratingImg(false);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    zip.file("index.html", generateHtml(data, true));
    zip.file("style.css", generateCss(data.themeColor));
    zip.file("script.js", generateJs());
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${data.name.replace(/\s+/g, '-').toLowerCase()}-website.zip`);
  };

  const iframeSrcDoc = useMemo(() => generateHtml(data, true), [data]);

  return (
    <div className="pt-20 px-4 min-h-screen bg-slate-50 pb-10">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl h-fit sticky top-20">
          <nav className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            {(['identity', 'content', 'services', 'style'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab}
              </button>
            ))}
          </nav>
          
          <div className="space-y-6">
            {activeTab === 'identity' && (
              <div className="space-y-4">
                <input placeholder="Business Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                <input placeholder="WhatsApp Number" className="w-full px-4 py-3 bg-slate-50 rounded-xl" value={data.whatsapp} onChange={e => setData({...data, whatsapp: e.target.value})} />
                <input placeholder="Address" className="w-full px-4 py-3 bg-slate-50 rounded-xl" value={data.address} onChange={e => setData({...data, address: e.target.value})} />
              </div>
            )}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="relative">
                  <textarea placeholder="Description" className="w-full px-4 py-3 bg-slate-50 rounded-xl h-32 resize-none" value={data.description} onChange={e => setData({...data, description: e.target.value})} />
                  <button onClick={handleRefine} disabled={isRefining} className="absolute bottom-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                    {isRefining ? '...' : 'AI Refine'}
                  </button>
                </div>
                <button onClick={handleGenerateHero} disabled={isGeneratingImg} className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold">
                  {isGeneratingImg ? 'Generating Hero Image...' : 'AI Generate Hero Image'}
                </button>
              </div>
            )}
            {activeTab === 'style' && (
              <div className="grid grid-cols-2 gap-4">
                {themes.map(t => (
                  <button key={t.id} onClick={() => setData({...data, themeId: t.id})} className={`p-4 rounded-2xl border-2 text-left ${data.themeId === t.id ? 'border-indigo-600' : 'border-slate-100'}`}>
                    <ThemePreviewIcon themeId={t.id} color={data.themeColor} />
                    <span className="text-[10px] font-black uppercase">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button onClick={() => setShowDeployModal(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Deploy to GitHub</button>
            <button onClick={handleDownloadZip} className="w-full py-4 border-2 border-slate-200 rounded-2xl font-bold">Download ZIP</button>
          </div>
        </div>

        <div className="lg:col-span-8">
           <div className="flex justify-between items-center mb-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</div>
             <div className="flex gap-2">
                <button onClick={() => setViewport('mobile')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${viewport === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Mobile</button>
                <button onClick={() => setViewport('desktop')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${viewport === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Desktop</button>
             </div>
           </div>
           <div className="bg-slate-200 rounded-[3rem] p-8 min-h-[700px] flex items-center justify-center border-4 border-white shadow-inner">
             <div className={`transition-all duration-500 overflow-hidden ${viewport === 'mobile' ? 'w-[375px] h-[750px] rounded-[3.5rem] border-[12px] border-slate-900 shadow-2xl' : 'w-full h-[750px] rounded-2xl shadow-2xl'}`}>
                <iframe srcDoc={iframeSrcDoc} className="w-full h-full bg-white border-none" />
             </div>
           </div>
        </div>
      </div>

      {showDeployModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">GitHub Deployment</h3>
            <input type="password" placeholder="GitHub Personal Access Token" className="w-full px-4 py-3 bg-slate-50 rounded-xl mb-6" value={ghToken} onChange={e => setGhToken(e.target.value)} />
            {deployStatus === 'success' ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold mb-4">Site Live! <a href={deployUrl} target="_blank" className="underline">{deployUrl}</a></div>
            ) : (
              <button onClick={async () => {
                setDeployStatus('loading');
                try {
                  const url = await deployToGitHub(ghToken, data.name.toLowerCase().replace(/\s/g, '-'), [
                    { path: 'index.html', content: generateHtml(data, true) },
                    { path: 'style.css', content: generateCss(data.themeColor) },
                    { path: 'script.js', content: generateJs() }
                  ]);
                  setDeployUrl(url);
                  setDeployStatus('success');
                } catch (e: any) {
                  alert(e.message);
                  setDeployStatus('error');
                }
              }} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">
                {deployStatus === 'loading' ? 'Deploying...' : 'Deploy Now'}
              </button>
            )}
            <button onClick={() => setShowDeployModal(false)} className="w-full mt-2 text-slate-400 text-xs font-black uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const { user, login, logout, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center"><i className="fas fa-circle-notch animate-spin text-indigo-600"></i></div>;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path={AppRoute.LANDING} element={<LandingPage />} />
          <Route path={AppRoute.LOGIN} element={<LoginPage login={login} />} />
          <Route path={AppRoute.REGISTER} element={<RegisterPage login={login} />} />
          <Route path={AppRoute.BUILDER} element={<BuilderPage />} />
          <Route path={AppRoute.README} element={<ReadmePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;