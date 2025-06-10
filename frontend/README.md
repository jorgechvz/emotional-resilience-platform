# Emotional Resilience Platform – Frontend

This is the frontend of the Emotional Resilience Platform, a web application designed to help users strengthen their emotional and spiritual resilience through interactive courses, blogs, support circles, and community resources. The project is part of the GESCI110: Sustaining Human Life course at Brigham Young University - Idaho (BYUI).

## Overview

The frontend is built with modern web technologies to provide a fast, accessible, and multilingual user experience. It connects to a NestJS/Prisma backend API and supports features such as user authentication, course progress tracking, discussion forums, and more.

## Main Features

- Interactive emotional resilience courses
- Blog posts and comments
- Discussion forums and resilience circles
- Personal notes and progress tracking by chapter
- Multilanguage support (English, Spanish, Quechua, Aymara)
- Responsive and accessible design
- JWT-based authentication

## Technologies Used

- **React** (with Hooks and functional components)
- **Vite** (for fast development and build tooling)
- **TypeScript** (type safety and modern JavaScript features)
- **i18n** (internationalization and localization)
- **React Router** (client-side routing)
- **Axios** (API requests)
- **Tailwind CSS** (utility-first CSS framework)
- **JWT Auth** (secure authentication)
- **ESLint & Prettier** (code quality and formatting)

## Project Structure

- `src/`
  - `auth/` – Authentication pages and logic
  - `blogs/` – Blog post and comment components
  - `courses/` – Course content, progress, and enrollment
  - `components/` – Shared UI components
  - `landing/` – Landing and home page
  - `layout/` – Layout and navigation components
  - `lib/` – Utilities, i18n, and helper functions
  - `meetings/` – Support circle and meeting features
  - `pages/` – Top-level pages/routes
  - `router/` – Application routing
  - `assets/` – Images and static assets
- `public/` – Static files and icons
- `index.html` – Main HTML entry point
- `vite.config.ts` – Vite configuration
- `eslint.config.js` – ESLint configuration

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables as described in the internal documentation (e.g., API base URL, JWT secret).
3. Start the development server:

   ```bash
   npm run dev
   ```

4. The app will be available at `http://localhost:5173` by default.

## Scripts

- `npm run dev` – Start development server with hot module replacement
- `npm run build` – Build the app for production
- `npm run preview` – Preview the production build
- `npm run lint` – Run ESLint for code quality

## Credits

- Developer: Jorge Chávez (jorgechvzpon@gmail.com)
- Educational content based on materials from The Church of Jesus Christ of Latter-day Saints

## Disclaimer

This platform is for educational and demonstration purposes only. It is not intended as professional medical or psychological advice.

---
