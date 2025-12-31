import { BusinessData } from '../types';

const getCommonStyles = (data: BusinessData) => {
  const fontLink = data.fontStyle === 'serif' 
    ? '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;700&display=swap" rel="stylesheet">'
    : '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">';
  
  const fontStack = data.fontStyle === 'serif' ? "'Instrument Serif', serif" : "'Plus Jakarta Sans', sans-serif";
  
  return { fontLink, fontStack };
};

const getSocialIconsHtml = (data: BusinessData, themeType: 'light' | 'dark' | 'glass' | 'brutal' | 'luxury' | 'cyan' | 'vibrant' | 'vintage' = 'light') => {
  const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110";
  const styles = {
    light: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    dark: "bg-white/10 text-white hover:bg-white/20",
    glass: "bg-white/5 backdrop-blur-sm text-white border border-white/10 hover:bg-white/10",
    brutal: "border-4 border-black bg-white text-black hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    luxury: "border border-[#d4af37]/30 text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black",
    cyan: "border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-black",
    vibrant: "bg-white shadow-xl text-indigo-600 hover:bg-indigo-600 hover:text-white",
    vintage: "border border-orange-200 text-orange-800 hover:bg-orange-800 hover:text-orange-50"
  };

  return Object.entries(data.socials)
    .filter(([_, url]) => !!url)
    .map(([platform, url]) => `
      <a href="${url}" target="_blank" class="${baseClasses} ${styles[themeType]}" aria-label="${platform}">
        <i class="fab fa-${platform}"></i>
      </a>
    `).join('');
};

const internalScrollScript = `
<script>
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
</script>
`;

const generateModern = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
    </style>
</head>
<body class="bg-white text-slate-900">
    <nav class="fixed w-full z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="#" class="text-xl font-extrabold tracking-tight">${data.name}</a>
            <div class="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
                <a href="#about" class="hover:text-primary transition">About</a>
                <a href="#services" class="hover:text-primary transition">Services</a>
                <a href="#contact" class="hover:text-primary transition">Contact</a>
            </div>
            <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm">Chat Now</a>
        </div>
    </nav>
    <header class="relative min-h-screen flex items-center pt-20 px-6">
        <div class="absolute inset-0 z-0 opacity-10"><img src="${heroImg}" class="w-full h-full object-cover"></div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
            <h1 class="text-6xl md:text-8xl font-black mb-8 leading-tight">${data.name}</h1>
            <p class="text-xl text-slate-600 mb-12">${data.description}</p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="#services" class="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">Our Services</a>
                <a href="#contact" class="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg">Contact Us</a>
            </div>
        </div>
    </header>
    <section id="about" class="py-32 px-6">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <img src="${heroImg}" class="rounded-[3rem] shadow-2xl aspect-square object-cover">
            <div>
                <h2 class="text-4xl font-black mb-6">Experience Excellence</h2>
                <p class="text-lg text-slate-600 leading-relaxed mb-8">${data.description}</p>
                <div class="flex gap-4">${getSocialIconsHtml(data, 'light')}</div>
            </div>
        </div>
    </section>
    <section id="services" class="py-32 bg-slate-50 px-6 text-center">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-black mb-16">What We Do</h2>
            <div class="grid md:grid-cols-3 gap-8 text-left">${servicesHtml}</div>
        </div>
    </section>
    <footer id="contact" class="py-20 bg-slate-900 text-white px-6">
        <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            <div>
                <h3 class="text-2xl font-black mb-6">${data.name}</h3>
                <p class="text-slate-400 mb-6">${data.address}</p>
                <div class="flex gap-4">${getSocialIconsHtml(data, 'dark')}</div>
            </div>
            <div>
                <h4 class="font-bold mb-6">Quick Links</h4>
                <ul class="space-y-3 text-slate-400">
                    <li><a href="#about" class="hover:text-white">About Us</a></li>
                    <li><a href="#services" class="hover:text-white">Our Services</a></li>
                    <li><a href="#contact" class="hover:text-white">Get in Touch</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6">Connect</h4>
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-primary text-white block w-full text-center py-4 rounded-xl font-bold">WhatsApp Direct</a>
            </div>
        </div>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateMidnight = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; background-color: #050505; color: #ffffff; }
        .text-primary { color: ${data.themeColor}; }
        .bg-primary { background-color: ${data.themeColor}; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
    </style>
</head>
<body>
    <nav class="fixed w-full z-[100] glass h-20 flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="#" class="text-xl font-bold tracking-tighter uppercase text-primary">${data.name}</a>
            <div class="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-white/50">
                <a href="#about" class="hover:text-white transition">About</a>
                <a href="#services" class="hover:text-white transition">Offerings</a>
                <a href="#contact" class="hover:text-white transition">Contact</a>
            </div>
            <div class="flex gap-4">${getSocialIconsHtml(data, 'glass')}</div>
        </div>
    </nav>
    <header class="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img src="${heroImg}" class="absolute inset-0 w-full h-full object-cover opacity-40">
        <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <div class="relative z-10 px-6 max-w-4xl">
            <h1 class="text-7xl md:text-9xl font-black mb-6 tracking-tighter uppercase">${data.name}</h1>
            <p class="text-xl text-gray-400 mb-10">${data.description}</p>
            <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="inline-block bg-primary text-black px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest">Connect</a>
        </div>
    </header>
    <section id="about" class="py-32 px-6">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div class="glass p-2 rounded-3xl"><img src="${heroImg}" class="rounded-2xl opacity-60 grayscale hover:grayscale-0 transition duration-1000"></div>
            <div>
                <h2 class="text-5xl font-black mb-8">Our Vision</h2>
                <p class="text-xl text-gray-400 leading-relaxed mb-8">${data.description}</p>
                <div class="flex gap-4">${getSocialIconsHtml(data, 'glass')}</div>
            </div>
        </div>
    </section>
    <section id="services" class="py-32 px-6 bg-white/[0.02]">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-black mb-16 uppercase tracking-tighter">Core Services</h2>
            <div class="grid md:grid-cols-3 gap-8">${servicesHtml.replace(/bg-white/g, 'glass').replace(/text-gray-600/g, 'text-gray-400')}</div>
        </div>
    </section>
    <footer id="contact" class="py-32 px-6 glass mt-20">
        <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
            <div>
                <div class="text-primary font-black text-2xl mb-6">${data.name}</div>
                <p class="text-gray-500">${data.address}</p>
            </div>
            <div>
                <h4 class="text-xs uppercase tracking-widest font-black text-primary mb-6">Coordinate</h4>
                <p class="text-gray-400">${data.phone}</p>
                <div class="flex gap-4 mt-6">${getSocialIconsHtml(data, 'glass')}</div>
            </div>
            <div>
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="block glass p-6 text-center rounded-xl font-bold uppercase hover:bg-white/5 transition">Open Channel</a>
            </div>
        </div>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateExecutive = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; color: #1a1a1a; }
        .text-primary { color: ${data.themeColor}; }
        .bg-primary { background-color: ${data.themeColor}; }
        .border-primary { border-color: ${data.themeColor}; }
    </style>
</head>
<body class="bg-[#fcfcfc]">
    <div class="flex flex-col lg:flex-row min-h-screen">
        <aside class="lg:w-1/3 p-12 lg:sticky lg:top-0 h-fit bg-white border-r border-slate-100 lg:min-h-screen flex flex-col justify-between">
            <div>
                <h1 class="text-5xl font-serif mb-8 border-b-4 border-primary pb-4">${data.name}</h1>
                <nav class="space-y-4 mb-12 font-bold uppercase tracking-widest text-xs text-slate-400">
                    <a href="#" class="block hover:text-primary transition">Top</a>
                    <a href="#about" class="block hover:text-primary transition">Profile</a>
                    <a href="#services" class="block hover:text-primary transition">Expertise</a>
                    <a href="#contact" class="block hover:text-primary transition">Contact</a>
                </nav>
                <p class="text-lg leading-relaxed mb-12 text-gray-700 italic border-l-2 border-primary pl-6">${data.description}</p>
            </div>
            <div class="space-y-6">
                <div class="flex gap-4 items-center text-sm font-bold uppercase"><i class="fas fa-map-marker-alt text-primary"></i> <span>${data.address}</span></div>
                <div class="flex gap-4 items-center text-sm font-bold uppercase"><i class="fas fa-phone text-primary"></i> <span>${data.phone}</span></div>
                <div class="flex gap-4 pt-6">${getSocialIconsHtml(data, 'light')}</div>
            </div>
        </aside>
        <main class="lg:w-2/3">
            <section id="hero" class="relative h-[60vh]">
                <img src="${heroImg}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000">
                <div class="absolute inset-0 bg-black/10"></div>
            </section>
            <section id="about" class="p-20 bg-white">
                <h2 class="text-3xl font-serif mb-12 uppercase tracking-widest border-b border-slate-100 pb-4">Our Heritage</h2>
                <div class="prose prose-lg text-slate-700 leading-relaxed mb-8">${data.description}</div>
                <div class="flex gap-4">${getSocialIconsHtml(data, 'light')}</div>
            </section>
            <section id="services" class="p-20 bg-slate-50">
                <h2 class="text-3xl font-serif mb-12 uppercase tracking-widest border-b border-slate-200 pb-4">Expertise</h2>
                <div class="grid md:grid-cols-2 gap-12">${servicesHtml.replace(/rounded-3xl/g, 'rounded-none').replace(/shadow-sm/g, 'shadow-none').replace(/border-gray-100/g, 'border-gray-200')}</div>
            </section>
            <section id="contact" class="p-20 bg-white">
                <h2 class="text-3xl font-serif mb-12 uppercase tracking-widest">Connect</h2>
                <div class="bg-slate-50 p-12 border border-slate-100">
                    <p class="mb-8 font-medium italic">For professional inquiries, please reach out via WhatsApp for a priority response.</p>
                    <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="inline-block bg-slate-900 text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-primary transition">Consultation</a>
                </div>
                <div class="mt-20 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">Kakani Build &copy; 2024</div>
            </section>
        </main>
    </div>
    ${internalScrollScript}
</body>
</html>`;

const generateOrganic = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; background-color: #faf9f6; }
        .text-primary { color: ${data.themeColor}; }
        .bg-primary { background-color: ${data.themeColor}; }
        .blob { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
    </style>
</head>
<body class="p-4 md:p-8">
    <div class="max-w-6xl mx-auto bg-white rounded-[4rem] shadow-2xl overflow-hidden">
        <nav class="p-10 flex flex-wrap justify-between items-center gap-6">
            <div class="text-3xl font-black text-primary">${data.name}</div>
            <div class="flex gap-8 font-bold text-sm uppercase text-gray-400">
                <a href="#about" class="hover:text-primary transition">About</a>
                <a href="#services" class="hover:text-primary transition">Services</a>
                <a href="#contact" class="hover:text-primary transition">Contact</a>
            </div>
            <div class="flex gap-4">${getSocialIconsHtml(data, 'light')}</div>
        </nav>
        <header class="px-10 py-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <h1 class="text-6xl font-black mb-8 leading-tight">${data.name}</h1>
                <p class="text-xl text-gray-500 mb-10 leading-relaxed">${data.description}</p>
                <div class="flex gap-4">
                    <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-primary text-white px-10 py-5 rounded-full font-bold shadow-lg shadow-primary/30">Say Hello</a>
                    <a href="#services" class="bg-gray-100 text-gray-600 px-10 py-5 rounded-full font-bold">Explore</a>
                </div>
            </div>
            <div class="w-full h-[500px] bg-primary/10 blob overflow-hidden">
                <img src="${heroImg}" class="w-full h-full object-cover mix-blend-multiply">
            </div>
        </header>
        <section id="about" class="py-32 px-10 bg-orange-50/30">
            <div class="max-w-3xl mx-auto text-center">
                <h2 class="text-4xl font-black mb-12">Our Story</h2>
                <p class="text-2xl font-medium leading-relaxed italic text-gray-600 mb-8">"${data.description}"</p>
                <div class="flex justify-center gap-4">${getSocialIconsHtml(data, 'light')}</div>
            </div>
        </section>
        <section id="services" class="py-32 px-10">
            <h2 class="text-4xl font-black mb-16 text-center">Services</h2>
            <div class="grid md:grid-cols-3 gap-10">${servicesHtml.replace(/rounded-3xl/g, 'rounded-[3rem] border-none bg-orange-50/20')}</div>
        </section>
        <footer id="contact" class="bg-gray-900 text-white p-20">
            <div class="grid md:grid-cols-2 gap-20">
                <div>
                    <h2 class="text-5xl font-black mb-8">Reach Out</h2>
                    <p class="text-xl text-gray-400 mb-8">${data.address}</p>
                    <div class="text-3xl font-black text-primary">${data.phone}</div>
                </div>
                <div class="flex flex-col justify-end items-end gap-10">
                    <div class="flex gap-6">${getSocialIconsHtml(data, 'dark')}</div>
                    <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-primary text-white px-12 py-6 rounded-full font-bold text-xl hover:scale-105 transition">Chat Now</a>
                </div>
            </div>
        </footer>
    </div>
    ${internalScrollScript}
</body>
</html>`;

const generateNeoBrutalist = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; background-color: #fff; }
        .brutal-border { border: 4px solid #000; box-shadow: 8px 8px 0px 0px #000; }
        .brutal-btn { border: 4px solid #000; box-shadow: 4px 4px 0px 0px #000; transition: 0.1s; display: inline-block; }
        .brutal-btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px 0px #000; }
        .text-primary { color: ${data.themeColor}; }
        .bg-primary { background-color: ${data.themeColor}; }
    </style>
</head>
<body class="p-6 md:p-12">
    <nav class="brutal-border bg-white p-6 mb-12 flex flex-wrap justify-between items-center gap-6">
        <a href="#" class="text-4xl font-black uppercase italic">${data.name}</a>
        <div class="flex gap-8 font-black uppercase tracking-widest text-sm">
            <a href="#about" class="hover:underline">About</a>
            <a href="#services" class="hover:underline">Services</a>
            <a href="#contact" class="hover:underline">Contact</a>
        </div>
        <div class="flex gap-4">${getSocialIconsHtml(data, 'brutal')}</div>
    </nav>
    <div class="grid lg:grid-cols-2 gap-12 mb-20">
        <div class="brutal-border p-12 flex flex-col justify-center" style="background-color: ${data.themeColor}15">
            <h1 class="text-7xl font-black uppercase mb-8 leading-none">${data.name}</h1>
            <p class="text-3xl font-bold mb-10">${data.description}</p>
            <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="brutal-btn bg-primary text-black px-12 py-5 font-black uppercase text-xl">Let's Talk</a>
        </div>
        <div class="brutal-border overflow-hidden"><img src="${heroImg}" class="w-full h-full object-cover grayscale contrast-150"></div>
    </div>
    <section id="about" class="brutal-border bg-yellow-400 p-12 mb-20">
        <h2 class="text-5xl font-black uppercase mb-8 border-b-4 border-black pb-4">Our DNA</h2>
        <p class="text-2xl font-bold leading-relaxed mb-8">${data.description}</p>
        <div class="flex gap-4">${getSocialIconsHtml(data, 'brutal')}</div>
    </section>
    <section id="services" class="mb-20">
        <h2 class="text-6xl font-black uppercase mb-16 italic">What We Offer</h2>
        <div class="grid md:grid-cols-3 gap-12">${servicesHtml.replace(/rounded-3xl/g, 'brutal-border h-full p-10 bg-white')}</div>
    </section>
    <footer id="contact" class="brutal-border bg-black text-white p-16">
        <div class="grid md:grid-cols-2 gap-12">
            <div>
                <h2 class="text-6xl font-black uppercase mb-8 text-primary">Connect</h2>
                <div class="space-y-4 font-bold text-2xl">
                    <p>${data.address}</p>
                    <p>${data.phone}</p>
                </div>
            </div>
            <div class="flex flex-col justify-end items-end">
                <div class="flex gap-8 mb-12">${getSocialIconsHtml(data, 'brutal').replace(/text-black/g, 'text-primary')}</div>
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="brutal-btn bg-white text-black px-12 py-6 text-3xl font-black uppercase w-full text-center">WhatsApp Direct</a>
            </div>
        </div>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateLuxury = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; background-color: #0c0c0c; color: #d4af37; }
        .luxury-border { border: 1px solid #d4af37; }
        .text-gold { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
    </style>
</head>
<body>
    <nav class="fixed w-full z-50 p-8 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-gold/20">
        <span class="text-2xl font-serif tracking-widest uppercase text-gold">${data.name}</span>
        <div class="hidden md:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em]">
            <a href="#about" class="hover:text-white transition">About</a>
            <a href="#services" class="hover:text-white transition">Portfolio</a>
            <a href="#contact" class="hover:text-white transition">Inquiry</a>
        </div>
        <div class="flex gap-4">${getSocialIconsHtml(data, 'luxury')}</div>
    </nav>
    <header class="h-screen relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div class="absolute inset-0 z-0">
            <img src="${heroImg}" class="w-full h-full object-cover opacity-20 scale-110">
        </div>
        <div class="relative z-10">
            <h1 class="text-7xl md:text-[8rem] font-serif mb-8 tracking-widest">${data.name}</h1>
            <p class="max-w-2xl text-xl text-stone-400 italic mb-12">${data.description}</p>
            <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="luxury-border text-gold px-12 py-5 uppercase tracking-[0.4em] hover:bg-gold hover:text-black transition">Arrange a Consultation</a>
        </div>
    </header>
    <section id="about" class="py-40 px-10 bg-[#080808]">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-32 items-center">
            <div class="relative"><div class="luxury-border absolute -inset-4"></div><img src="${heroImg}" class="w-full aspect-square object-cover grayscale opacity-60"></div>
            <div>
                <h2 class="text-sm font-bold uppercase tracking-[0.8em] mb-12 text-stone-500">Heritage</h2>
                <h3 class="text-4xl md:text-6xl font-serif mb-12 italic leading-tight">Timeless excellence in every detail.</h3>
                <p class="text-lg text-stone-400 leading-[2.2] font-light italic mb-12">"${data.description}"</p>
                <div class="flex gap-4">${getSocialIconsHtml(data, 'luxury')}</div>
            </div>
        </div>
    </section>
    <section id="services" class="py-40 px-10">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-serif mb-24 text-center uppercase tracking-widest">The Collection</h2>
            <div class="grid md:grid-cols-3 gap-16">${servicesHtml.replace(/bg-white/g, 'bg-transparent border border-gold/10 p-12 rounded-none')}</div>
        </div>
    </section>
    <footer id="contact" class="py-40 px-10 bg-[#050505] text-center border-t border-gold/10">
        <h2 class="text-6xl font-serif mb-12 italic">Elegance awaits.</h2>
        <div class="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto mb-20 text-sm tracking-[0.2em] uppercase">
            <div><div class="text-gold mb-4">Location</div><div>${data.address}</div></div>
            <div><div class="text-gold mb-4">Inquiry</div><div>${data.phone}</div></div>
            <div><div class="text-gold mb-4">Connect</div><div class="flex justify-center gap-6 mt-4">${getSocialIconsHtml(data, 'luxury')}</div></div>
        </div>
        <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="luxury-border px-16 py-8 text-lg font-serif italic tracking-widest hover:bg-gold hover:text-black transition">Request Call-back</a>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateEditorial = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; background-color: #fff; color: #000; }
        .editorial-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2rem; }
        .text-primary { color: ${data.themeColor}; }
        .bg-primary { background-color: ${data.themeColor}; }
    </style>
</head>
<body class="p-4">
    <header class="border-t-[20px] border-black pt-8 mb-16">
        <nav class="flex justify-between items-center mb-8 font-black uppercase text-sm">
            <div class="flex gap-12">
                <a href="#about" class="hover:underline">Story</a>
                <a href="#services" class="hover:underline">Columns</a>
                <a href="#contact" class="hover:underline">Join</a>
            </div>
            <div class="flex gap-4">${getSocialIconsHtml(data, 'light')}</div>
        </nav>
        <h1 class="text-[12vw] font-black uppercase leading-[0.8] tracking-tighter mb-4">${data.name}</h1>
        <div class="flex justify-between items-end border-b-2 border-black pb-4 font-black uppercase tracking-widest">
            <span class="text-2xl">Premiere 2024</span>
            <span class="text-sm">Kakani Build Editorial</span>
        </div>
    </header>
    <section id="about" class="editorial-grid mb-32">
        <div class="col-span-full lg:col-span-4 flex flex-col justify-between">
            <div>
                <h2 class="text-6xl font-black uppercase leading-none mb-12">The Narrative</h2>
                <p class="text-4xl font-black leading-tight underline decoration-primary decoration-8 underline-offset-8 mb-8">${data.description}</p>
                <div class="flex gap-4">${getSocialIconsHtml(data, 'light')}</div>
            </div>
            <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-black text-white p-8 text-center font-black uppercase text-2xl mt-12">Contact Desk</a>
        </div>
        <div class="col-span-full lg:col-span-8 overflow-hidden">
            <img src="${heroImg}" class="w-full h-[600px] object-cover hover:scale-105 transition duration-1000">
        </div>
    </section>
    <section id="services" class="mb-32">
        <h2 class="text-[8vw] font-black uppercase tracking-tighter border-b-8 border-black mb-16 italic">Special Features</h2>
        <div class="grid md:grid-cols-3 gap-16">${servicesHtml.replace(/shadow-sm/g, 'shadow-none').replace(/border-gray-100/g, 'border-none').replace(/p-8/g, 'p-0 border-r border-black pr-12 last:border-none')}</div>
    </section>
    <footer id="contact" class="border-t-2 border-black pt-16 pb-32">
        <div class="grid md:grid-cols-2 gap-32">
            <div>
                <h2 class="text-6xl font-black uppercase mb-8 italic">Get Featured</h2>
                <div class="text-4xl font-black mb-8">${data.phone}</div>
                <p class="text-2xl font-bold italic">${data.address}</p>
            </div>
            <div class="flex flex-col justify-end items-end">
                <div class="text-[10vw] font-black uppercase leading-none opacity-10">${data.name}</div>
                <div class="flex gap-8 mt-12 text-3xl">${getSocialIconsHtml(data, 'light')}</div>
            </div>
        </div>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateFuturistic = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} // OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${styles.fontLink}
    <style>
        body { font-family: ${styles.fontStack}; background-color: #00040a; color: #00f2ff; }
        .cyber-panel { background: rgba(0, 242, 255, 0.05); border: 1px solid #00f2ff; position: relative; }
        .cyber-panel::before { content: ''; position: absolute; top: -2px; left: -2px; width: 10px; height: 10px; border-top: 2px solid #00f2ff; border-left: 2px solid #00f2ff; }
        .cyber-panel::after { content: ''; position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border-bottom: 2px solid #00f2ff; border-right: 2px solid #00f2ff; }
        .glow-text { text-shadow: 0 0 10px #00f2ff80; }
    </style>
</head>
<body class="uppercase selection:bg-cyan-400 selection:text-black">
    <nav class="p-8 border-b border-cyan-900/50 fixed w-full top-0 bg-black/80 backdrop-blur-xl z-50 flex justify-between items-center">
        <div class="text-2xl font-black tracking-[0.4em] glow-text">${data.name}</div>
        <div class="hidden md:flex gap-12 text-[10px] font-bold tracking-[0.4em]">
            <a href="#about" class="hover:text-white transition">About</a>
            <a href="#services" class="hover:text-white transition">Services</a>
            <a href="#contact" class="hover:text-white transition">Sync</a>
        </div>
        <div class="flex gap-4">${getSocialIconsHtml(data, 'cyan')}</div>
    </nav>
    <header class="min-h-screen flex items-center justify-center pt-32 px-8 overflow-hidden">
        <div class="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
            <div>
                <h1 class="text-6xl md:text-[8rem] font-black leading-none mb-10 glow-text">${data.name}</h1>
                <p class="text-xl opacity-70 mb-12 border-l-2 border-cyan-400 pl-8">${data.description}</p>
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="cyber-panel px-12 py-5 font-black tracking-widest hover:bg-cyan-400 hover:text-black transition inline-block">Execute Transmit</a>
            </div>
            <div class="relative"><img src="${heroImg}" class="relative w-full aspect-square object-cover cyber-panel grayscale brightness-75 hover:grayscale-0 transition duration-700"></div>
        </div>
    </header>
    <section id="about" class="py-40 px-8 border-y border-cyan-900/30">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl font-black mb-12 tracking-[0.4em] glow-text">Core.Heritage</h2>
            <p class="text-3xl font-light leading-relaxed italic opacity-60 mb-12">"${data.description}"</p>
            <div class="flex justify-center gap-6">${getSocialIconsHtml(data, 'cyan')}</div>
        </div>
    </section>
    <section id="services" class="py-40 px-8">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-black mb-20 tracking-[0.4em] glow-text">Functions.System</h2>
            <div class="grid md:grid-cols-3 gap-12">${servicesHtml.replace(/bg-white/g, 'bg-transparent cyber-panel').replace(/text-gray-600/g, 'text-cyan-200/50 font-light')}</div>
        </div>
    </section>
    <footer id="contact" class="py-40 px-8 bg-black border-t-2 border-cyan-400">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-32">
            <div class="space-y-12">
                <h2 class="text-6xl font-black glow-text tracking-[0.2em]">Contact.Link</h2>
                <div class="text-3xl font-light space-y-4">
                    <p class="cyber-panel p-6">${data.address}</p>
                    <p class="cyber-panel p-6">${data.phone}</p>
                </div>
            </div>
            <div class="flex flex-col justify-end items-end gap-16">
                <div class="flex gap-10 text-4xl">${getSocialIconsHtml(data, 'cyan')}</div>
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="cyber-panel px-16 py-8 text-3xl font-black hover:bg-cyan-400 hover:text-black transition">Sync_WhatsApp</a>
            </div>
        </div>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateVibrant = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        .gradient-bg { background: linear-gradient(135deg, ${data.themeColor} 0%, #4f46e5 100%); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">
    <nav class="fixed w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-indigo-100 h-20 flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="#" class="text-2xl font-black text-indigo-600">${data.name}</a>
            <div class="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
                <a href="#about" class="hover:text-indigo-600 transition">About</a>
                <a href="#services" class="hover:text-indigo-600 transition">Services</a>
                <a href="#contact" class="hover:text-indigo-600 transition">Contact</a>
            </div>
            <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="gradient-bg text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-indigo-200">Connect</a>
        </div>
    </nav>
    <header class="relative min-h-screen flex items-center pt-20 px-6">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div class="z-10">
                <span class="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black uppercase mb-6">World-Class Service</span>
                <h1 class="text-6xl md:text-8xl font-black mb-8 leading-tight text-slate-900">${data.name}</h1>
                <p class="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed">${data.description}</p>
                <div class="flex flex-wrap gap-4">
                    <a href="#services" class="gradient-bg text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-300 hover:scale-105 transition">Our Services</a>
                    <a href="#contact" class="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50">Say Hello</a>
                </div>
            </div>
            <div class="relative">
                <div class="absolute -inset-4 gradient-bg opacity-20 blur-3xl rounded-full"></div>
                <img src="${heroImg}" class="relative rounded-[3rem] shadow-2xl w-full aspect-[4/5] object-cover">
            </div>
        </div>
    </header>
    <section id="about" class="py-32 px-6 bg-white">
        <div class="max-w-5xl mx-auto text-center">
            <h2 class="text-4xl md:text-6xl font-black mb-12 leading-tight">We bring energy to your goals.</h2>
            <p class="text-2xl text-slate-500 font-medium mb-12 italic leading-relaxed">"${data.description}"</p>
            <div class="flex justify-center gap-6">${getSocialIconsHtml(data, 'vibrant')}</div>
        </div>
    </section>
    <section id="services" class="py-32 px-6">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-5xl font-black mb-16 text-center text-slate-900">What We Offer</h2>
            <div class="grid md:grid-cols-3 gap-8">${servicesHtml.replace(/rounded-3xl/g, 'rounded-[2.5rem] border-none shadow-xl bg-white p-10')}</div>
        </div>
    </section>
    <footer id="contact" class="py-32 px-6 gradient-bg text-white">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
            <div class="space-y-12">
                <h2 class="text-7xl font-black leading-none">Let's Ignite Your Potential.</h2>
                <div class="space-y-4">
                    <p class="text-2xl font-bold opacity-80">${data.address}</p>
                    <p class="text-4xl font-black">${data.phone}</p>
                </div>
                <div class="flex gap-6">${getSocialIconsHtml(data, 'light')}</div>
            </div>
            <div class="flex flex-col justify-end items-end gap-12">
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-white text-indigo-600 px-16 py-8 rounded-[2rem] text-4xl font-black hover:scale-110 transition shadow-2xl">WhatsApp Us</a>
                <div class="text-[10vw] font-black opacity-10 select-none">${data.name}</div>
            </div>
        </div>
    </footer>
    ${internalScrollScript}
</body>
</html>`;

const generateVintage = (data: BusinessData, cleanWhatsapp: string, servicesHtml: string, heroImg: string, styles: any) => `
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
        body { font-family: ${styles.fontStack}; background-color: #f7f2ea; color: #433d36; }
        .border-vintage { border: 2px solid #433d36; }
        .bg-vintage { background-color: #433d36; color: #f7f2ea; }
        .sepia { filter: sepia(0.3) contrast(1.1); }
    </style>
</head>
<body class="p-4 md:p-8">
    <div class="max-w-7xl mx-auto border-vintage min-h-screen flex flex-col">
        <nav class="border-b-2 border-vintage p-8 flex flex-wrap justify-between items-center gap-6">
            <div class="text-4xl font-serif italic font-bold uppercase tracking-tighter">${data.name}</div>
            <div class="flex gap-12 text-sm font-bold uppercase tracking-widest italic">
                <a href="#about" class="hover:underline">Heritage</a>
                <a href="#services" class="hover:underline">Specialties</a>
                <a href="#contact" class="hover:underline">Enquiries</a>
            </div>
            <div class="flex gap-4">${getSocialIconsHtml(data, 'vintage')}</div>
        </nav>
        <header class="flex-1 grid lg:grid-cols-2">
            <div class="p-12 flex flex-col justify-center border-b-2 lg:border-b-0 lg:border-r-2 border-vintage">
                <h1 class="text-6xl md:text-8xl font-serif italic mb-8 leading-[0.9]">${data.name}</h1>
                <div class="w-full h-[1px] bg-vintage opacity-20 mb-8"></div>
                <p class="text-xl leading-relaxed mb-12 italic font-medium opacity-80">${data.description}</p>
                <div class="flex gap-6">
                    <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-vintage px-10 py-5 font-bold uppercase tracking-widest shadow-lg">Correspond Now</a>
                    <a href="#services" class="border-vintage px-10 py-5 font-bold uppercase tracking-widest hover:bg-vintage transition duration-500">The Catalog</a>
                </div>
            </div>
            <div class="relative overflow-hidden group">
                <img src="${heroImg}" class="w-full h-full object-cover sepia grayscale transition duration-1000 group-hover:scale-105">
            </div>
        </header>
        <section id="about" class="p-20 border-b-2 border-vintage text-center">
            <h2 class="text-sm font-bold uppercase tracking-[0.5em] mb-12 opacity-50">Established MMXXIV</h2>
            <div class="max-w-4xl mx-auto">
                <p class="text-3xl md:text-5xl font-serif italic leading-snug">"Dedicated to the preservation of quality and the pursuit of excellence in everything we craft."</p>
                <div class="mt-16 flex justify-center gap-12">${getSocialIconsHtml(data, 'vintage')}</div>
            </div>
        </section>
        <section id="services" class="p-20 border-b-2 border-vintage bg-[#efeadf]">
            <h2 class="text-4xl font-serif italic mb-20 text-center">The Selection</h2>
            <div class="grid md:grid-cols-3 gap-12">${servicesHtml.replace(/rounded-3xl/g, 'rounded-none border-vintage p-10 bg-white shadow-none')}</div>
        </section>
        <footer id="contact" class="p-20 grid md:grid-cols-3 gap-12">
            <div class="space-y-8">
                <h3 class="text-3xl font-serif italic">${data.name}</h3>
                <p class="font-bold uppercase tracking-widest text-xs opacity-50">Global Headquarters</p>
                <p class="text-xl italic">${data.address}</p>
            </div>
            <div class="space-y-8">
                <h4 class="font-bold uppercase tracking-widest text-xs opacity-50">Telegrams</h4>
                <p class="text-4xl font-serif italic">${data.phone}</p>
                <div class="flex gap-6">${getSocialIconsHtml(data, 'vintage')}</div>
            </div>
            <div class="flex flex-col justify-end">
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" class="bg-vintage p-8 text-center text-xl font-bold uppercase tracking-widest italic shadow-xl">Secure Connection</a>
            </div>
        </footer>
    </div>
    ${internalScrollScript}
</body>
</html>`;

export const generateHtml = (data: BusinessData, isPremium: boolean): string => {
  const cleanWhatsapp = data.whatsapp.replace(/\D/g, '');
  const styles = getCommonStyles(data);
  
  const servicesHtml = data.services
    .map(s => `
      <div class="service-card p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style="background-color: ${data.themeColor}15">
          <i class="fas ${s.icon} text-2xl" style="color: ${data.themeColor}"></i>
        </div>
        <h3 class="text-xl font-bold mb-3">${s.title}</h3>
        <p class="text-gray-600 leading-relaxed text-sm">${s.description}</p>
      </div>
    `).join('');

  const heroImg = data.heroImageUrl || `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200`;

  switch (data.themeId) {
    case 'midnight': return generateMidnight(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'executive': return generateExecutive(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'organic': return generateOrganic(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'neobrutalist': return generateNeoBrutalist(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'luxury': return generateLuxury(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'editorial': return generateEditorial(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'futuristic': return generateFuturistic(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'vibrant': return generateVibrant(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'vintage': return generateVintage(data, cleanWhatsapp, servicesHtml, heroImg, styles);
    case 'modern':
    default: return generateModern(data, cleanWhatsapp, servicesHtml, heroImg, styles);
  }
};

export const generateCss = (color: string): string => `:root { --primary: ${color}; }`;
export const generateJs = (): string => `console.log('Site Live');`;