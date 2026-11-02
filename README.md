# Aravindraj M — AI/ML Portfolio

Personal portfolio site for Aravindraj M, a B.Tech Artificial Intelligence and Data Science student and Computer Vision developer from Coimbatore, Tamil Nadu. It showcases projects, skills, achievements, and a contact form.

## Tech Stack

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Three.js](https://threejs.org) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) for the particle background
- [lucide-react](https://lucide.dev) for icons

## Getting Started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
├── assets/          Profile photo and logo
├── components/      Hero, About, Skills, Projects, Contact, Navbar, Footer, etc.
│   └── three/       Three.js particle field
├── data/portfolio.js  All portfolio content (projects, skills, links)
├── motion.js        Shared animation variants
├── theme.jsx        Theme (light/dark) provider
└── index.css        Global styles
public/              Static files (resume PDF, etc.)
```

## Customizing Content

Projects, case studies, skills, and social links all live in [src/data/portfolio.js](src/data/portfolio.js). Edit that file to update the site — no component changes needed.

## Contact Form

The contact form sends messages through [Formspree](https://formspree.io):

1. Create a free form on Formspree and copy its ID (the part after `https://formspree.io/f/`).
2. Copy `.env.example` to `.env` and set `VITE_FORMSPREE_ID` to that ID.
3. Add the same variable to your hosting provider's environment variables (e.g. Vercel).

Without it, the form falls back to opening the visitor's email client.

## Deployment

The site is a static Vite build and deploys to any static host (Vercel, Netlify, GitHub Pages). Run `npm run build` and serve the `dist/` folder, or connect the repository to your host with:

- Build command: `npm run build`
- Output directory: `dist`

## Featured Projects

- **Bharatanatyam Mudra Detection** — real-time hand gesture recognition with MediaPipe, OpenCV, and TensorFlow. [Repo](https://github.com/Aravindraj0007/mudra-identification)
- **PatientPath AI** — hospital flow optimization with YOLO, FastAPI, and n8n. [Repo](https://github.com/Kishore-mp45/SANKARA_INNOVATION_CHALLENGE_2026.git)
- **Smart Exam Cell Management System** — full-stack academic management with role-based access. [Repo](https://github.com/Aravindraj0007/SMART-EXAM-CELL-MANAGEMENT-SYSTEM.git)
- **WhatsApp Automation Booking** — n8n webhook-based booking workflow. [Repo](https://github.com/Aravindraj0007/n8n-automation-booking.git)

## Contact

- Email: [aravind040806@gmail.com](mailto:aravind040806@gmail.com)
- LinkedIn: [linkedin.com/in/aravindraj-m-35714632a](https://linkedin.com/in/aravindraj-m-35714632a)
- GitHub: [github.com/Aravindraj0007](https://github.com/Aravindraj0007)
