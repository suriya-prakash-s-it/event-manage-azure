# Full-Stack Event Management System

A complete MERN stack (MongoDB, Express, React, Node.js) application tailored for Event Organizers and Attendees, featuring Role-Based Access Control, JWT Authentication, and a modern UI powered by Tailwind CSS.

## Features Let's take a look
- **Authentication**: JWT-based secure login and registration with Bcrypt hashing.
- **Roles**: Distinct views and capabilities for `Admin`, `Organizer`, and `Attendee`.
- **Event Management**: Create, Read, Update, Delete features for scalable event hosting.
- **Booking Engine**: Attendees can seamlessly book tickets and see ticket availability constraints.
- **Dynamic Frontend**: Modern UI using Vite + React and Tailwind CSS featuring dark mode hooks, hero sections, and glassmorphism UI traits.

## Prerequisites

- Node.js installed
- MongoDB installed locally (or update the `.env` file to use a MongoDB Atlas URI)

## Installation & Setup

1. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables:**
   A `.env` file is already provided in the `server` directory with:
   - `PORT=5000`
   - `MONGODB_URI=mongodb://127.0.0.1:27017/eventmanage`
   - `JWT_SECRET=supersecretjwtkey123`
   - `JWT_EXPIRES_IN=30d`

3. **Seed Database:**
   To easily log in, we have provided a seeder script that inserts test Users and Events.
   ```bash
   cd server
   node seeder.js -i
   ```
   **Logins for seeded users:**
   - Admin: `admin@test.com` | `password123`
   - Organizer: `org@test.com` | `password123`
   - Attendee: `attendee@test.com` | `password123`

4. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

You will need to run the client and the server concurrently in two separate terminal tabs.

**Terminal 1 (Backend API):**
```bash
cd server
node server.js
```
*(Runs on http://localhost:5000)*

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
*(Runs on http://localhost:5173 - Navigate here in your browser)*
