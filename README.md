# Emotional Resilience Platform

Educational project developed for the course GESCI110: Sustaining Human Life at Brigham Young University - Idaho (BYUI).

## Description
This platform helps users strengthen their emotional and spiritual resilience through courses, blogs, support circles, and interactive resources. The educational content is based on official materials from The Church of Jesus Christ of Latter-day Saints, but the platform is not officially affiliated with or endorsed by the Church.

## Main Features
- Interactive emotional resilience courses
- Blogs and comments
- Discussion forums and resilience circles
- Progress tracking and personal notes by chapter
- Multilanguage support (Spanish, English, Quechua, Aymara)

## Project Structure
- `backend/`: API built with NestJS and Prisma
- `frontend/`: Web application built with React and Vite

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/jorgechvz/emotional-resilience-platform.git
   ```
2. Install dependencies in both projects:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Configure environment variables as described in the internal documentation.
4. Start the development servers:
   - Backend: `npm run start:dev` in the `backend` folder
   - Frontend: `npm run dev` in the `frontend` folder

## Technologies Used
- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** React, Vite, TypeScript
- **Others:** i18n, JWT Auth, Docker (optional)

## Credits and Attribution
- Academic project for GESCI110 - Sustaining Human Life (BYUI)
- Educational content based on materials from The Church of Jesus Christ of Latter-day Saints
- Lead developer: Jorge Chávez (jorgechvzpon@gmail.com)

## Limitations
This platform is for educational and demonstration purposes only. It should not be considered as professional medical or psychological advice.

---
