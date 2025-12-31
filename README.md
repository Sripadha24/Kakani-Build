# ⚡ Kakani Build

**Kakani Build** is a high-performance, frontend-only AI Studio designed to generate, preview, and deploy professional business websites in under 60 seconds. 

By leveraging the power of Google's Gemini models, it transforms simple business ideas into production-ready web entities with zero manual coding.

---

## 🚀 Key Features

### 1. AI-Powered Copywriting (GenAI)
Utilizes **Gemini 3 Flash** to analyze raw business descriptions and refine them into high-conversion sales copy, optimized for both human engagement and SEO.

### 2. Generative Visuals
Integrated with **Gemini 2.5 Flash Image** to create bespoke 16:9 hero images. The AI understands the business context and generates cinematic, brand-specific imagery on demand.

### 3. Multi-Theme Engine
A sophisticated design system supporting 10 unique, mobile-first themes:
- **Modern**: Clean, tech-focused layout.
- **Midnight**: High-contrast, sleek dark mode.
- **Executive**: Serif-based professional portfolio.
- **Organic**: Soft, nature-inspired aesthetic.
- **NeoBrutalist**: Bold, high-contrast pop-art style.
- **Luxury**: Elite, gold-and-black minimalist design.
- **Editorial**: Fashion-forward magazine grid.
- **Futuristic**: Neon-cyberpunk interface.
- **Vibrant**: High-energy gradient systems.
- **Vintage**: Warm, heritage-inspired serif layout.

### 4. Direct Cloud Deployment
Seamless integration with the **GitHub REST API**. Users can:
- Create a new repository directly from the app.
- Upload HTML/CSS/JS assets automatically.
- Enable **GitHub Pages** for instant live hosting.

### 5. Source Portability
One-click **ZIP Export** using `JSZip` and `FileSaver`, providing users with full ownership of their generated source code (Vanilla HTML/CSS/JS).

---

## 🛠️ Technical Stack

- **Framework**: React 19 (ES6 Modules)
- **Styling**: Tailwind CSS 3.x
- **AI Core**: `@google/genai` (Gemini API)
- **Routing**: `react-router-dom` v6
- **Asset Handling**: `JSZip`, `FileSaver.js`
- **Deployment**: GitHub REST API v3
- **Icons**: FontAwesome 6

---

## 🧠 AI Prompt Architecture

The app uses structured prompting to ensure quality:
- **Text Refinement**: System instructions guide the model to act as a "Senior Marketing Copywriter."
- **Image Generation**: Context-aware prompts for "Cinematic lighting, modern aesthetics, and professional framing."

---

## 📦 Deployment Workflow

1. **Input Data**: User enters business identity and services.
2. **AI Enhance**: Content is polished and hero image is generated.
3. **Template Engine**: Data is injected into the selected theme's HTML/CSS/JS templates.
4. **Cloud Sync**: The app authenticates via GitHub Token and pushes the bundle to a new repo.
5. **Live**: The site is served via `username.github.io/repo-name`.

---

*Built with passion by the Kakani Build Team.*
