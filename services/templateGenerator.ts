import { BusinessData, ThemeId } from '../types';

interface ThemeConfig {
  bg: string;
  text: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  navBg: string;
  footerBg: string;
  borderWidth: string;
  radius: string;
  buttonClass: string;
}

const THEME_MAP: Record<ThemeId, ThemeConfig> = {
  modern: {
    bg: 'bg-white', text: 'text-slate-900', cardBg: 'bg-white', cardBorder: 'border-slate-100',
    cardShadow: 'shadow-sm hover:shadow-xl', navBg: 'bg-white/90', footerBg: 'bg-slate-900',
    borderWidth: 'border', radius: 'rounded-3xl', buttonClass: 'rounded-full'
  },
  midnight: {
    bg: 'bg-slate-950', text: 'text-white', cardBg: 'bg-slate-900', cardBorder: 'border-slate-800',
    cardShadow: 'shadow-2xl shadow-black/50', navBg: 'bg-slate-950/90', footerBg: 'bg-black',
    borderWidth: 'border', radius: 'rounded-2xl', buttonClass: 'rounded-xl'
  },
  executive: {
    bg: 'bg-zinc-50', text: 'text-zinc-900', cardBg: 'bg-white', cardBorder: 'border-zinc-200',
    cardShadow: 'shadow-md', navBg: 'bg-white', footerBg: 'bg-zinc-900',
    borderWidth: 'border-b-2', radius: 'rounded-none', buttonClass: 'rounded-none'
  },
  organic: {
    bg: 'bg-stone-50', text: 'text-stone-900', cardBg: 'bg-white', cardBorder: 'border-stone-100',
    cardShadow: 'shadow-lg shadow-stone-200/50', navBg: 'bg-stone-50/80', footerBg: 'bg-stone-900',
    borderWidth: 'border', radius: 'rounded-[3rem]', buttonClass: 'rounded-full'
  },
  neobrutalist: {
    bg: 'bg-yellow-50', text: 'text-black', cardBg: 'bg-white', cardBorder: 'border-black',
    cardShadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]', navBg: 'bg-white', footerBg: 'bg-black',
    borderWidth: 'border-4', radius: 'rounded-none', buttonClass: 'rounded-none'
  },
  luxury: {
    bg: 'bg-neutral-900', text: 'text-[#d4af37]', cardBg: 'bg-neutral-800', cardBorder: 'border-[#d4af37]/20',
    cardShadow: 'shadow-2xl', navBg: 'bg-neutral-900', footerBg: 'bg-black',
    borderWidth: 'border', radius: 'rounded-none', buttonClass: 'rounded-full'
  },
  editorial: {
    bg: 'bg-white', text: 'text-black', cardBg: 'bg-gray-50', cardBorder: 'border-black',
    cardShadow: 'shadow-none hover:bg-black hover:text-white', navBg: 'bg-white', footerBg: 'bg-white',
    borderWidth: 'border-t border-b', radius: 'rounded-none', buttonClass: 'rounded-none'
  },
  futuristic: {
    bg: 'bg-[#050505]', text: 'text-cyan-400', cardBg: 'bg-neutral-900', cardBorder: 'border-cyan-500/30',
    cardShadow: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]', navBg: 'bg-black/80', footerBg: 'bg-black',
    borderWidth: 'border', radius: 'rounded-xl', buttonClass: 'rounded-md shadow-[0_0_15px_rgba(6,182,212,0.5)]'
  },
  vibrant: {
    bg: 'bg-indigo-50', text: 'text-indigo-900', cardBg: 'bg-white', cardBorder: 'border-indigo-100',
    cardShadow: 'shadow-xl shadow-indigo-200/50', navBg: 'bg-white/90', footerBg: 'bg-indigo-900',
    borderWidth: 'border', radius: 'rounded-[2rem]', buttonClass: 'rounded-2xl'
  },
  vintage: {
    bg: 'bg-[#f4ead5]', text: 'text-[#5d4037]', cardBg: 'bg-[#faf3e0]', cardBorder: 'border-[#d7ccc8]',
    cardShadow: 'shadow-inner', navBg: 'bg-[#f4ead5]', footerBg: 'bg-[#3e2723]',
    borderWidth: 'border-2', radius: 'rounded-lg', buttonClass: 'rounded-lg'
  }
};

const getCommonStyles = (data: BusinessData) => {
  const isSerif = data.themeId === 'executive' || data.themeId === 'luxury' || data.themeId === 'vintage' || data.fontStyle === 'serif';
  const fontLink = isSerif
    ? '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Serif&display=swap" rel="stylesheet">'
    : '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">';
  
  const fontStack = isSerif ? "'Playfair Display', serif" : "'Plus Jakarta Sans', sans-serif";
  return { fontLink, fontStack };
};

export const generateHtml = (data: BusinessData, isPremium: boolean): string => {
  const config = THEME_MAP[data.themeId] || THEME_MAP.modern;
  const styles = getCommonStyles(data);
  const cleanWhatsapp = data.whatsapp.replace(/\D/g, '');
  const heroImg = data.heroImageUrl || `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200`;

  const gridCols = data.serviceColumns === 1 ? 'grid-cols-1' : data.serviceColumns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const servicesHtml = data.services.map(s => `
    <div class="service-card p-8 transition-all duration-500 ${config.cardBg} ${config.cardBorder} ${config.borderWidth} ${config.radius} ${config.cardShadow}">
      <div class="w-14 h-14 ${config.radius} flex items-center justify-center mb-6" style="background-color: ${data.themeColor}20">
        <i class="fas ${s.icon} text-xl" style="color: ${data.themeColor}"></i>
      </div>
      <h3 class="text-xl font-bold mb-3">${s.title}</h3>
      <p class="opacity-70 leading-relaxed text-sm">${s.description}</p>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${styles.fontLink}
    <style>
        body { font-family: ${styles.fontStack}; }
        .text-primary { color: ${data.themeColor}; }
        .bg-primary { background-color: ${data.themeColor}; }
        .border-primary { border-color: ${data.themeColor}; }
        .service-card:hover { transform: translateY(-5px); }
    </style>
</head>
<body class="${config.bg} ${config.text} transition-colors duration-500">
    <nav class="fixed w-full z-[100] ${config.navBg} backdrop-blur-md border-b ${config.cardBorder} h-20 flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="#" class="text-xl font-black tracking-tighter uppercase">${data.name}</a>
            <div class="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                <a href="#about" class="hover:text-primary transition">About</a>
                <a href="#services" class="hover:text-primary transition">Services</a>
                <a href="#contact" class="hover:text-primary transition">Contact</a>
            </div>
            <a href="https://wa.me/${cleanWhatsapp}" class="bg-primary text-white px-6 py-3 ${config.buttonClass} font-black text-[10px] uppercase tracking-widest shadow-lg">Connect</a>
        </div>
    </nav>

    <header class="relative min-h-[90vh] flex items-center pt-20 px-6">
        <div class="absolute inset-0 z-0 overflow-hidden">
            <img src="${heroImg}" class="w-full h-full object-cover opacity-20 filter grayscale">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-${config.bg.replace('bg-', '')}"></div>
        </div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
            <h1 class="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">${data.name}</h1>
            <p class="text-lg md:text-xl opacity-70 mb-12 max-w-2xl mx-auto leading-relaxed">${data.description}</p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="#services" class="bg-primary text-white px-10 py-5 ${config.buttonClass} font-black uppercase tracking-widest text-xs shadow-2xl">Our Expertise</a>
                <a href="#contact" class="border-2 border-current px-10 py-5 ${config.buttonClass} font-black uppercase tracking-widest text-xs">Get in Touch</a>
            </div>
        </div>
    </header>

    <section id="services" class="py-32 px-6">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                <div class="max-w-xl text-center md:text-left">
                    <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">The Offerings</h2>
                    <p class="opacity-60 text-sm font-medium uppercase tracking-widest">Selected services provided by ${data.name}</p>
                </div>
            </div>
            <div class="grid ${gridCols} gap-8">
                ${servicesHtml}
            </div>
        </div>
    </section>

    <footer id="contact" class="py-20 ${config.footerBg} text-white px-6">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
            <div>
                <h3 class="text-3xl font-black mb-8 uppercase tracking-tighter">${data.name}</h3>
                <p class="text-white/50 text-sm mb-12 leading-relaxed max-w-sm">${data.address}</p>
                <div class="flex gap-4">
                    ${Object.entries(data.socials).filter(([_, v]) => v).map(([k, v]) => `
                        <a href="${v}" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                            <i class="fab fa-${k}"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
            <div class="bg-white/5 p-10 ${config.radius} backdrop-blur-xl border border-white/10">
                <h4 class="font-black uppercase tracking-widest text-xs mb-6">Immediate Inquiry</h4>
                <a href="https://wa.me/${cleanWhatsapp}" class="block w-full text-center py-5 bg-primary rounded-xl font-black uppercase tracking-widest text-xs">Message via WhatsApp</a>
            </div>
        </div>
    </footer>

    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>`;
};

export const generateCss = (color: string): string => `:root { --primary: ${color}; }`;
export const generateJs = (): string => `console.log('Studio Live');`;
