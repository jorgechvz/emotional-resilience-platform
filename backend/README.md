# Emotional Resilience Platform – Backend

This is the backend API for the Emotional Resilience Platform, a web application designed to help users strengthen their emotional and spiritual resilience through interactive courses, blogs, support circles, and community resources. The project is part of the GESCI110: Sustaining Human Life course at Brigham Young University - Idaho (BYUI).

## Overview
The backend is built with [NestJS](https://nestjs.com/), a progressive Node.js framework, and uses [Prisma ORM](https://www.prisma.io/) for database management with PostgreSQL. It provides a robust, scalable, and secure RESTful API for the frontend application.

## Main Features
- User authentication and JWT-based authorization
- Management of courses, chapters, enrollments, and progress
- Blog posts and comments
- Discussion forums and resilience circles
- Personal notes and progress tracking
- Multilanguage support (data endpoints)
- Modular and scalable architecture

## Technologies Used
- **NestJS** (TypeScript, modular server-side framework)
- **Prisma ORM** (database access and migrations)
- **PostgreSQL** (relational database)
- **JWT Auth** (secure authentication)
- **Docker** (optional, for containerized deployment)
- **ESLint & Prettier** (code quality and formatting)

## Project Structure
- `src/`
  - `auth/` – Authentication and user management
  - `blog-posts/`, `blog-comments/` – Blog and comment endpoints
  - `courses/`, `chapters/`, `enrollments/`, `chapters-progress/`, `chapters-notes/` – Course and progress management
  - `discussions/`, `discussions-replies/` – Forums and replies
  - `resilence-circle/`, `resilence-circle-enrollment/` – Support circles
  - `prisma/` – Prisma schema and migrations
  - `main.ts`, `app.module.ts` – Application entry point and root module
- `test/` – End-to-end tests

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables as described in the internal documentation (e.g., database URL, JWT secret).
3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Scripts
- `npm run start:dev` – Start development server with hot reload
- `npm run start` – Start server in production mode
- `npm run test` – Run unit tests
- `npm run test:e2e` – Run end-to-end tests
- `npm run test:cov` – Run test coverage

## Credits
- Developer: Jorge Chávez (jorgechvzpon@gmail.com)
- Educational content based on materials from The Church of Jesus Christ of Latter-day Saints

## Disclaimer
This platform is for educational and demonstration purposes only. It is not intended as professional medical or psychological advice.

---
