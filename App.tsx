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

// --- Auth Components ---

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
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-black mb-2">Welcome back</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">Please enter your details to sign in.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none transition-all font-medium text-sm" 
              placeholder="you@company.com" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none transition-all font-medium text-sm" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 mt-6"
          >
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Don't have an account? <Link to={AppRoute.REGISTER} className="text-indigo-600 font-bold hover:underline">Sign up</Link>
        </p>
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
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-black mb-2">Join Kakani Build</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">The most powerful way to launch your business online.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none transition-all font-medium text-sm" 
              placeholder="Jane Doe" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none transition-all font-medium text-sm" 
              placeholder="jane@example.com" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none transition-all font-medium text-sm" 
              placeholder="Create a secure password" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 mt-6"
          >
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already have an account? <Link to={AppRoute.LOGIN} className="text-indigo-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
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
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8">Core Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <i className="fas fa-magic text-indigo-500 mb-4 text-xl"></i>
                <h3 className="font-bold text-lg mb-2">AI Copywriting</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Leverages Google Gemini 3 Flash to refine and polish your business descriptions into high-converting sales copy.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <i className="fas fa-image text-indigo-500 mb-4 text-xl"></i>
                <h3 className="font-bold text-lg mb-2">AI Image Generation</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Generates bespoke 16:9 hero visuals using Gemini 2.5 Flash Image, perfectly tailored to your business niche.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <i className="fas fa-rocket text-indigo-500 mb-4 text-xl"></i>
                <h3 className="font-bold text-lg mb-2">Direct Deployment</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Integrated GitHub REST API allows one-click repository creation and GitHub Pages activation for instant live hosting.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <i className="fas fa-layer-group text-indigo-500 mb-4 text-xl"></i>
                <h3 className="font-bold text-lg mb-2">Premium Theme Engine</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Choose from 10 distinct, mobile-first design systems ranging from NeoBrutalist to Luxury Minimalist.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8">Technical Stack</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-700">Frontend Framework</span>
                <span className="text-slate-500 text-sm">React 19 (ESM)</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-700">Styling System</span>
                <span className="text-slate-500 text-sm">Tailwind CSS 3.x</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-700">Artificial Intelligence</span>
                <span className="text-slate-500 text-sm">Google Gemini API (@google/genai)</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-700">State Management</span>
                <span className="text-slate-500 text-sm">React Hooks & LocalStorage Persistence</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-700">Deployment Engine</span>
                <span className="text-slate-500 text-sm">GitHub REST API v3</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-700">File Utilities</span>
                <span className="text-slate-500 text-sm">JSZip & FileSaver.js</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8">The Collection</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                'Modern', 'Midnight', 'Executive', 'Organic', 'NeoBrutalist', 
                'Luxury', 'Editorial', 'Futuristic', 'Vibrant', 'Vintage'
              ].map(t => (
                <div key={t} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">{t}</div>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
            <Link to={AppRoute.LANDING} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition shadow-xl shadow-indigo-100 inline-block">
              Back to Studio
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold mb-8">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
          New: Ultra-Premium Theme Collection
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">Instant Sites for <span className="text-indigo-600">Growth Businesses.</span></h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">Choose from our expanded gallery of 10 high-conversion themes. AI-powered and ready to deploy in seconds.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate(AppRoute.BUILDER)} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-2xl shadow-indigo-200">Open Studio</button>
        </div>
      </div>
    </div>
  );
};

const ThemePreviewIcon = ({ themeId, color }: { themeId: ThemeId, color: string }) => {
  const variants: Record<ThemeId, React.ReactNode> = {
    modern: <div className="w-full h-full bg-white flex flex-col p-1 gap-1"><div className="w-full h-2 bg-slate-100 rounded"></div><div className="w-3/4 h-1 bg-slate-200 rounded"></div><div className="grid grid-cols-2 gap-1 mt-1"><div className="h-4 bg-slate-50 rounded"></div><div className="h-4 bg-slate-50 rounded"></div></div><div className="mt-auto h-2 w-full rounded" style={{ backgroundColor: color }}></div></div>,
    midnight: <div className="w-full h-full bg-slate-950 flex flex-col p-1 gap-1"><div className="w-1/2 h-2 bg-slate-800 rounded"></div><div className="w-full h-1 bg-slate-800 rounded"></div><div className="mt-auto h-3 w-3 rounded-full" style={{ backgroundColor: color }}></div></div>,
    executive: <div className="w-full h-full bg-slate-50 flex gap-1 p-1"><div className="w-1/3 h-full bg-white border border-slate-200"></div><div className="w-2/3 flex flex-col gap-1"><div className="w-full h-4 bg-slate-200"></div><div className="w-full h-1 bg-slate-200"></div><div className="w-1/2 h-1 bg-slate-200"></div></div></div>,
    organic: <div className="w-full h-full bg-stone-50 flex flex-col items-center p-1 gap-1"><div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div><div className="w-full h-1 bg-stone-200 rounded"></div><div className="w-2/3 h-1 bg-stone-200 rounded"></div></div>,
    neobrutalist: <div className="w-full h-full bg-white border-2 border-black flex flex-col p-1 gap-1 shadow-[2px_2px_0_0_black]"><div className="w-full h-2 bg-yellow-400 border-b border-black"></div><div className="w-full h-4 bg-white border border-black" style={{ borderColor: color }}></div></div>,
    luxury: <div className="w-full h-full bg-stone-900 border border-amber-600/30 flex flex-col items-center p-1 gap-1"><div className="w-1/2 h-0.5 bg-amber-600"></div><div className="w-4 h-4 rounded-sm border border-amber-600 rotate-45 mt-1"></div><div className="w-2/3 h-0.5 bg-amber-600 mt-2"></div></div>,
    editorial: <div className="w-full h-full bg-white border-t-4 border-black flex flex-col p-1 gap-1"><div className="w-full h-4 bg-slate-100"></div><div className="w-full h-1 bg-black"></div><div className="grid grid-cols-3 gap-0.5"><div className="h-4 bg-slate-50"></div><div className="h-4 bg-slate-50"></div><div className="h-4 bg-slate-50"></div></div></div>,
    futuristic: <div className="w-full h-full bg-blue-950 border border-cyan-400 flex flex-col p-1 gap-1"><div className="w-full h-1 bg-cyan-400/30"></div><div className="w-full h-4 bg-cyan-400/10"></div><div className="mt-auto flex justify-between"><div className="w-2 h-2 bg-cyan-400"></div><div className="w-2 h-2 bg-cyan-400"></div></div></div>,
    vibrant: <div className="w-full h-full bg-white flex flex-col p-1 gap-1"><div className="w-full h-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"></div><div className="w-1/2 h-2 bg-slate-100 rounded mt-1"></div><div className="mt-auto h-2 w-10 bg-indigo-500 rounded-full"></div></div>,
    vintage: <div className="w-full h-full bg-orange-50 border border-orange-200 flex flex-col p-1 gap-1"><div className="w-full h-2 bg-orange-100 rounded italic"></div><div className="w-3/4 h-3 bg-white shadow-sm rounded-sm"></div><div className="w-full h-1 bg-orange-200"></div></div>,
  };
  return <div className="w-full h-16 rounded-xl overflow-hidden mb-2 border border-slate-100 shadow-inner">{variants[themeId]}</div>;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, socials: { ...prev.socials, [name]: value } }));
  };

  const handleServiceChange = (id: string, field: keyof ServiceItem, value: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addService = () => {
    const newService: ServiceItem = { id: Date.now().toString(), title: "New Service", description: "Service details...", icon: "fa-check" };
    setData(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const removeService = (id: string) => {
    setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  const handleGenerateHero = async () => {
    setIsGeneratingImg(true);
    const url = await generateHeroImage(data.name, data.description);
    if (url) setData(prev => ({ ...prev, heroImageUrl: url }));
    setIsGeneratingImg(false);
  };

  const handleRefine = async () => {
    setIsRefining(true);
    const refined = await refineDescription(data.name, data.description);
    setData(prev => ({ ...prev, description: refined }));
    setIsRefining(false);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const html = generateHtml(data, true);
    const css = generateCss(data.themeColor);
    const js = generateJs();

    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("script.js", js);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${data.name.toLowerCase().replace(/\s+/g, '-')}-website.zip`);
  };

  const iframeSrcDoc = useMemo(() => generateHtml(data, true), [data]);

  const inputBase = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none transition-all font-medium text-sm";
  const labelBase = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1";

  return (
    <div className="pt-20 pb-10 px-4 min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-8">
        {/* Editor Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl sticky top-24 overflow-y-auto max-h-[calc(100vh-120px)] no-scrollbar">
            <nav className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar" aria-label="Editor sections">
              {(['identity', 'content', 'services', 'style'] as const).map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  aria-selected={activeTab === tab}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition shrink-0 ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="space-y-6" role="tabpanel">
              {activeTab === 'identity' && (
                <div className="space-y-4 animate-in slide-in-from-left-4">
                  <div>
                    <label htmlFor="biz-name" className={labelBase}>Business Name <span className="text-red-500">*</span></label>
                    <input id="biz-name" type="text" name="name" value={data.name} onChange={handleChange} required aria-required="true" className={inputBase} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="biz-phone" className={labelBase}>Phone</label>
                      <input id="biz-phone" type="text" name="phone" value={data.phone} onChange={handleChange} className={inputBase} />
                    </div>
                    <div>
                      <label htmlFor="biz-whatsapp" className={labelBase}>WhatsApp <span className="text-red-500">*</span></label>
                      <input id="biz-whatsapp" type="text" name="whatsapp" value={data.whatsapp} onChange={handleChange} required aria-required="true" className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="biz-address" className={labelBase}>Physical Address <span className="text-red-500">*</span></label>
                    <input id="biz-address" type="text" name="address" value={data.address} onChange={handleChange} required aria-required="true" className={inputBase} />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <label className={labelBase}>Social Profiles</label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center gap-3">
                        <i className="fab fa-instagram w-5 text-slate-400"></i>
                        <input type="text" name="instagram" value={data.socials.instagram} onChange={handleSocialChange} placeholder="Instagram URL" className={inputBase} />
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="fab fa-facebook w-5 text-slate-400"></i>
                        <input type="text" name="facebook" value={data.socials.facebook} onChange={handleSocialChange} placeholder="Facebook URL" className={inputBase} />
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="fab fa-linkedin w-5 text-slate-400"></i>
                        <input type="text" name="linkedin" value={data.socials.linkedin} onChange={handleSocialChange} placeholder="LinkedIn URL" className={inputBase} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-4 animate-in slide-in-from-left-4">
                  <div>
                    <label htmlFor="biz-desc" className={labelBase}>Pitch / Description <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <textarea id="biz-desc" name="description" value={data.description} onChange={handleChange} required aria-required="true" className={inputBase + " h-32 resize-none"} />
                      <button onClick={handleRefine} disabled={isRefining} aria-label="Refine description with AI" className="absolute bottom-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold disabled:opacity-50 transition hover:bg-indigo-700">
                        {isRefining ? '...' : 'AI Refine'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>Hero Image</label>
                    <div className="flex gap-2">
                      <button onClick={handleGenerateHero} disabled={isGeneratingImg} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition disabled:opacity-50">
                        {isGeneratingImg ? 'Generating...' : 'Generate with AI'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-4 animate-in slide-in-from-left-4">
                  {data.services.map((s, idx) => (
                    <div key={s.id} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100 group">
                      <button onClick={() => removeService(s.id)} aria-label={`Remove service ${idx + 1}`} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition shadow-lg"><i className="fas fa-times"></i></button>
                      <input value={s.title} onChange={(e) => handleServiceChange(s.id, 'title', e.target.value)} className="w-full bg-transparent font-bold text-sm mb-1 outline-none" placeholder="Service Name" />
                      <textarea value={s.description} onChange={(e) => handleServiceChange(s.id, 'description', e.target.value)} className="w-full bg-transparent text-xs text-slate-500 resize-none outline-none" rows={2} placeholder="Description..." />
                    </div>
                  ))}
                  <button onClick={addService} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-xs font-bold hover:border-indigo-400 hover:text-indigo-600 transition">+ Add Service</button>
                </div>
              )}

              {activeTab === 'style' && (
                <div className="space-y-6 animate-in slide-in-from-left-4">
                   <div>
                    <label htmlFor="biz-color" className={labelBase}>Brand Accent Color</label>
                    <input id="biz-color" type="color" name="themeColor" value={data.themeColor} onChange={handleChange} className="w-full h-12 rounded-xl cursor-pointer bg-white border border-slate-100" />
                  </div>
                  <div>
                    <label className={labelBase}>Typography System</label>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Font selection">
                      <button onClick={() => setData(prev => ({...prev, fontStyle: 'sans'}))} aria-pressed={data.fontStyle === 'sans'} className={`py-3 rounded-xl text-xs font-bold border-2 transition ${data.fontStyle === 'sans' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>Modern Sans</button>
                      <button onClick={() => setData(prev => ({...prev, fontStyle: 'serif'}))} aria-pressed={data.fontStyle === 'serif'} className={`py-3 rounded-xl text-xs font-bold border-2 transition ${data.fontStyle === 'serif' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>Elegant Serif</button>
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>Gallery Themes</label>
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setData(prev => ({...prev, themeId: t.id}))}
                          className={`group p-2 rounded-2xl border-2 text-left transition ${data.themeId === t.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                          <ThemePreviewIcon themeId={t.id} color={data.themeColor} />
                          <div className={`text-[10px] font-black uppercase tracking-wider transition ${data.themeId === t.id ? 'text-indigo-600' : 'text-slate-900'}`}>{t.name}</div>
                          <div className="text-[8px] text-slate-400 font-medium leading-tight">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 space-y-3">
              <button onClick={() => setShowDeployModal(true)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition flex items-center justify-center gap-2 shadow-xl">
                <i className="fab fa-github"></i> Deploy to Web
              </button>
              <button onClick={handleDownloadZip} className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <i className="fas fa-file-archive"></i> Download Source (ZIP)
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-First Preview Area */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</span>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => setViewport('mobile')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${viewport === 'mobile' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <i className="fas fa-mobile-alt"></i> Mobile
              </button>
              <button 
                onClick={() => setViewport('desktop')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${viewport === 'desktop' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <i className="fas fa-desktop"></i> Desktop
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-200/50 rounded-[3rem] border border-slate-200 overflow-hidden relative flex items-center justify-center p-8 min-h-[600px]">
            {/* Device Frame */}
            <div className={`transition-all duration-500 ease-in-out relative ${viewport === 'mobile' ? 'w-[375px] h-[750px] max-h-full rounded-[3.5rem] border-[12px] border-slate-900 shadow-2xl overflow-hidden' : 'w-full h-full rounded-2xl border border-slate-200 shadow-2xl'}`}>
              {viewport === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                </div>
              )}
              <iframe 
                srcDoc={iframeSrcDoc} 
                className="w-full h-full border-none bg-white" 
                title="Instant Website Preview" 
              />
            </div>
          </div>
        </div>
      </div>

      {showDeployModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="deploy-modal-title">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 id="deploy-modal-title" className="text-xl font-bold mb-4">Go Live on GitHub</h3>
            <div className="space-y-4">
              <label htmlFor="gh-token" className={labelBase}>GitHub Personal Access Token</label>
              <input id="gh-token" type="password" value={ghToken} onChange={(e) => setGhToken(e.target.value)} placeholder="ghp_..." className={inputBase + " bg-slate-50 border-slate-200"} />
              <p className="mt-2 text-xs text-slate-500">
                <a 
                  href="https://github.com/settings/tokens/new?scopes=repo&description=KakaniBuild" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Generate a new token <i className="fas fa-external-link-alt text-[10px]"></i>
                </a>
                <span className="ml-1">Make sure to select the 'repo' scope.</span>
              </p>
            </div>
            {deployStatus === 'success' ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl mb-4 text-xs font-bold" role="status">Live at: <a href={deployUrl} target="_blank" className="underline">{deployUrl}</a></div>
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
              }} disabled={deployStatus === 'loading' || !ghToken} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold transition hover:bg-indigo-700 mt-6">Deploy Now</button>
            )}
            <button onClick={() => setShowDeployModal(false)} className="w-full mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <i className="fas fa-circle-notch animate-spin text-indigo-600 text-2xl"></i>
      </div>
    );
  }

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