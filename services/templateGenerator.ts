
import { BusinessData } from '../types';

export const generateHtml = (data: BusinessData, isPremium: boolean): string => {
  const servicesHtml = data.services
    .map(s => `
      <div class="service-card p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style="background-color: ${data.themeColor}15">
          <i class="fas fa-certificate text-2xl" style="color: ${data.themeColor}"></i>
        </div>
        <h3 class="text-xl font-bold mb-3">${s}</h3>
        <p class="text-gray-600 leading-relaxed">Dedicated professional ${s.toLowerCase()} services designed to provide maximum value and results for our clients.</p>
      </div>
    `).join('');

  const heroImg = data.heroImageUrl || `https://picsum.photos/seed/${data.name}-hero/1200/800`;
  const aboutImg = data.aboutImageUrl || `https://picsum.photos/seed/${data.name}-about/800/600`;

  return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} | Professional Services</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .bg-primary { background-color: ${data.themeColor}; }
        .text-primary { color: ${data.themeColor}; }
        .border-primary { border-color: ${data.themeColor}; }
        .ring-primary { --tw-ring-color: ${data.themeColor}; }
        
        /* Fix for fixed header overlap */
        section { scroll-margin-top: 80px; }
        
        .glass-nav {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="bg-white text-gray-900 selection:bg-primary selection:text-white">
    <!-- Navbar -->
    <nav class="fixed w-full z-[100] glass-nav border-b border-gray-100 h-20 flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="#" class="flex items-center gap-3 group">
                ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-10 w-auto object-contain max-w-[160px]">` : `<div class="w-10 h-10 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform"></div>`}
                <span class="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">${data.name}</span>
            </a>
            
            <div class="hidden md:flex gap-10 font-bold text-sm uppercase tracking-widest text-gray-500">
                <a href="#about" class="hover:text-primary transition-colors">About</a>
                <a href="#services" class="hover:text-primary transition-colors">Services</a>
                <a href="#contact" class="hover:text-primary transition-colors">Contact</a>
            </div>

            <div class="flex items-center gap-4">
                <a href="tel:${data.phone}" class="hidden sm:block text-sm font-bold text-gray-700 hover:text-primary transition-colors">${data.phone}</a>
                <a href="https://wa.me/${data.whatsapp}" class="bg-primary text-white px-7 py-3 rounded-full font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-primary/25">
                    Book Now
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="relative pt-48 pb-32 px-6 overflow-hidden min-h-[80vh] flex items-center">
        <div class="absolute inset-0 z-0">
             <img src="${heroImg}" class="w-full h-full object-cover opacity-[0.07] scale-105 animate-pulse">
             <div class="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>
        <div class="max-w-5xl mx-auto text-center relative z-10">
            <span class="inline-block py-2 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">Welcome to ${data.name}</span>
            <h1 class="text-6xl md:text-8xl font-extrabold mb-8 leading-[1.1] tracking-tight text-gray-900">
                Experience <span class="text-primary italic">Excellence</span> in Every Detail.
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">${data.description}</p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="#services" class="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-2xl shadow-primary/30">Our Services</a>
                <a href="#contact" class="bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition">Get a Quote</a>
            </div>
        </div>
    </section>

    <!-- About -->
    <section id="about" class="py-32 px-6 bg-white">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div class="relative group">
                <div class="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all opacity-50"></div>
                <img src="${aboutImg}" class="relative rounded-[2rem] shadow-2xl w-full aspect-[4/3] object-cover">
                <div class="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 hidden xl:block animate-bounce-slow">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                            <i class="fas fa-star"></i>
                        </div>
                        <div>
                            <p class="text-2xl font-black text-gray-900 leading-none">100%</p>
                            <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Quality Focus</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <span class="text-primary font-bold uppercase tracking-[0.3em] text-sm">About Our Company</span>
                <h2 class="text-5xl font-extrabold mt-4 mb-8 leading-tight">Crafting Solutions with Passion and Integrity</h2>
                <p class="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                    At ${data.name}, we believe that quality is not an act, it's a habit. Since our inception, we've focused on one thing: delivering exceptional results that help our clients thrive. Our team of experts brings years of industry experience to every project.
                </p>
                <div class="grid sm:grid-cols-2 gap-8">
                    <div class="flex gap-4">
                        <i class="fas fa-check-circle text-2xl text-primary"></i>
                        <div>
                            <h4 class="font-bold mb-1">Expert Team</h4>
                            <p class="text-sm text-gray-500">Highly skilled professionals at your service.</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <i class="fas fa-check-circle text-2xl text-primary"></i>
                        <div>
                            <h4 class="font-bold mb-1">Global Standards</h4>
                            <p class="text-sm text-gray-500">Adhering to the highest quality benchmarks.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services -->
    <section id="services" class="py-32 bg-gray-50 px-6">
        <div class="max-w-7xl mx-auto">
            <div class="text-center max-w-3xl mx-auto mb-20">
                <span class="text-primary font-bold uppercase tracking-[0.3em] text-sm">Our Expertise</span>
                <h2 class="text-5xl font-extrabold mt-4 mb-6">Premium Services for Your Success</h2>
                <p class="text-gray-600 text-lg font-medium leading-relaxed">We offer a wide range of specialized services tailored to meet the unique challenges of your business in today's dynamic market.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                ${servicesHtml}
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-32 px-6 bg-white">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
            <div>
                <span class="text-primary font-bold uppercase tracking-[0.3em] text-sm">Contact Us</span>
                <h2 class="text-5xl font-extrabold mt-4 mb-8 leading-tight">Ready to Start a Project?</h2>
                <p class="text-xl text-gray-600 mb-12 leading-relaxed">Have a question or a proposal? We'd love to hear from you. Reach out via the form or through our direct contact information.</p>
                
                <div class="space-y-8">
                    <div class="flex items-start gap-6 group">
                        <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <i class="fas fa-phone text-xl text-primary"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg mb-1">Phone</h4>
                            <p class="text-gray-500 font-medium">${data.phone}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-6 group">
                        <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <i class="fab fa-whatsapp text-xl text-primary"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg mb-1">WhatsApp</h4>
                            <a href="https://wa.me/${data.whatsapp}" class="text-primary font-bold hover:underline">Chat with us directly</a>
                        </div>
                    </div>
                    <div class="flex items-start gap-6 group">
                        <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <i class="fas fa-location-dot text-xl text-primary"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg mb-1">Office</h4>
                            <p class="text-gray-500 font-medium">${data.address}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                <form id="contactForm" class="space-y-6" onsubmit="event.preventDefault(); alert('Message sent! This is a preview.');">
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                            <input type="text" required placeholder="John Doe" class="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
                            <input type="email" required placeholder="john@example.com" class="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm">
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Subject</label>
                        <select class="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm appearance-none">
                            <option>General Inquiry</option>
                            <option>Service Request</option>
                            <option>Quote Inquiry</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Message</label>
                        <textarea rows="4" required placeholder="How can we help you?" class="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm resize-none"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] transition shadow-xl shadow-primary/30">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-24 pb-12 px-6">
        <div class="max-w-7xl mx-auto">
            <div class="grid md:grid-cols-4 gap-16 mb-20">
                <div class="col-span-2">
                    <div class="flex items-center gap-3 mb-8">
                        ${data.logoUrl ? `<img src="${data.logoUrl}" class="h-10 w-auto object-contain brightness-0 invert">` : `<div class="w-10 h-10 bg-primary rounded-xl"></div>`}
                        <span class="text-2xl font-extrabold tracking-tight">${data.name}</span>
                    </div>
                    <p class="text-gray-400 text-lg leading-relaxed max-w-sm">${data.description}</p>
                </div>
                <div>
                    <h5 class="font-bold text-lg mb-8 uppercase tracking-widest text-primary">Company</h5>
                    <ul class="space-y-4 text-gray-400 font-medium">
                        <li><a href="#about" class="hover:text-white transition">About Us</a></li>
                        <li><a href="#services" class="hover:text-white transition">Our Services</a></li>
                        <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="font-bold text-lg mb-8 uppercase tracking-widest text-primary">Support</h5>
                    <ul class="space-y-4 text-gray-400 font-medium">
                        <li><a href="tel:${data.phone}" class="hover:text-white transition">Call Us</a></li>
                        <li><a href="https://wa.me/${data.whatsapp}" class="hover:text-white transition">WhatsApp</a></li>
                        <li><a href="#" class="hover:text-white transition">FAQs</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-12 flex flex-col md:row justify-between items-center gap-6">
                <p class="text-gray-500 font-medium">&copy; ${new Date().getFullYear()} ${data.name}. Built with Excellence.</p>
                <div class="flex gap-6 text-gray-500">
                    <a href="#" class="hover:text-white transition"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="hover:text-white transition"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="hover:text-white transition"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="hover:text-white transition"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Float Actions -->
    <a href="https://wa.me/${data.whatsapp}" class="fixed bottom-10 right-10 bg-[#25D366] text-white w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center z-[100] group">
        <i class="fab fa-whatsapp text-3xl"></i>
        <span class="absolute right-full mr-4 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Chat with us!</span>
    </a>

    <script>
        // Smooth scrolling fallback for older browsers or complex layouts
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offset = 80; // height of fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Intersection Observer for highlighting sections (optional enhancement)
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-primary');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('text-primary');
                }
            });
        });
    </script>
</body>
</html>
`;
};

export const generateCss = (color: string): string => {
  return `
    :root {
      --primary: ${color};
    }
  `;
};

export const generateJs = (): string => {
  return `
    console.log('Kakani Build Template Initialized Successfully.');
    
    // Smooth scrolling logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
  `;
};
