# Sadaqa Jariya

> An ongoing charity Islamic website dedicated to the souls of **Mohamed Ahmed Mohamed Anwar** and **Mohamed Ezzat Helmy El-Biby**.

A comprehensive Islamic platform featuring prayer times, Quran recitation, digital Mushaf, morning & evening Athkar, supplications (Du'a), an electronic Misbaha, and more — all in one place.

## Features

- **Prayer Times** — Accurate prayer schedules based on location
- **Quran Recitation** — Audio recitation from multiple renowned reciters (El-Hosary, El-Menshawy, Yasser Al-Dosari, and more)
- **Digital Mushaf** — Read the Quran online
- **Morning & Evening Athkar** — Daily morning and evening remembrances with audio
- **Du'a (Supplications)** — Collection of Islamic supplications
- **Electronic Misbaha** — Digital counter for Tasbih
- **Sunnan Rawatib** — Guide to the regular Sunnah prayers
- **Daily Content** — Rotating daily reminders and Islamic content
- **Visit Tracking** — Anonymous visitor statistics
- **Suggestions & Feedback** — Users can submit suggestions and report issues
- **PWA Ready** — Mobile-friendly, responsive design

## Tech Stack

- **HTML5 / CSS3** — Semantic markup with a modern glassmorphism design system
- **JavaScript (ES Modules)** — Modular architecture with lazy-loaded components
- **Firebase** — Realtime Database for visit tracking and daily content management
- **Font Awesome** — Icon library
- **Google Fonts** — Arabic-friendly typography
- **Netlify** — Hosting & deployment

## Project Structure

```
sadaqaSite/
├── css/                # Global styles & design system
├── js/                 # JavaScript modules (components, services, Firebase config)
├── praytimes/          # Prayer times page
├── quran/              # Quran recitation (multiple reciters)
├── moshaf/             # Digital Mushaf
├── morningazkar/       # Morning Athkar
├── eveningazkar/       # Evening Athkar
├── doaa/               # Supplications
├── masbaha/            # Electronic Misbaha
├── sonan/              # Sunnan Rawatib
├── adminpage/          # Admin panel
├── downloadpage/       # Android APK download
├── resources/          # Images, icons, favicons
└── index.html          # Main entry point
```

## Getting Started

This is a fully static site. No build step required.

```bash
git clone https://github.com/your-username/sadaqaSite.git
cd sadaqaSite
# Serve locally using any HTTP server, e.g.:
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

The site is deployed on **Netlify**. Any push to the `main` branch triggers an automatic deployment.

## License

All rights reserved. This project is a personal ongoing charity (Sadaqa Jariya) and is not licensed for commercial use.

## Author

- **Moaaz Ashraf** — Design & Development
