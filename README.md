# Social Post App

A full-stack social media app built with React, Express, and MongoDB-ready persistence. Users can sign up, log in, create text or image posts, like posts, and comment on them through a clean social-feed interface.

Repository: `https://github.com/nithin54/social-post-app`

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/nithin54/social-post-app)

## Features

- User signup and login with JWT authentication
- Create posts with text, image, or both
- Like and comment on posts
- Media-first feed layout inspired by modern social apps
- MongoDB support with automatic in-memory fallback for local development
- Backend tests using Jest, Supertest, and `mongodb-memory-server`

## Tech Stack

- Frontend: React, React Router, Material UI, Axios
- Backend: Node.js, Express, JWT, bcryptjs
- Database: MongoDB with Mongoose
- Testing: Jest, Supertest, mongodb-memory-server

## Project Structure

```text
social-post-app/
|- backend/
|  |- data/
|  |- middleware/
|  |- models/
|  |- routes/
|  `- tests/
|- frontend/
|  |- public/
|  `- src/
`- README.md
```

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET=replace-me
CORS_ORIGIN=http://localhost:8080
MONGODB_URI=mongodb://127.0.0.1:27017/social-post-app
```

Create `frontend/.env`:

```env
PORT=8080
BROWSER=none
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:5000`.

If MongoDB is not available, the app falls back to in-memory storage unless `REQUIRE_MONGODB=true` is set.

### 4. Start the frontend

```bash
cd frontend
npm start
```

The frontend runs on `http://localhost:8080`.

## Available Scripts

### Backend

```bash
npm start
npm run dev
npm test
```

### Frontend

```bash
npm start
npm run build
npm test
```

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Posts

- `GET /api/posts`
- `POST /api/posts`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/comments`

### Health

- `GET /api/health`

## Example Post Payload

```json
{
  "content": "My first image post",
  "imageUrl": "data:image/png;base64,..."
}
```

## Testing

Run backend tests:

```bash
cd backend
npm test
```

## Deployment Notes

- GitHub is best used here for source control.
- GitHub Pages can host only the frontend static build.
- For full-stack deployment, host the backend on a platform like Render, Railway, or Cyclic and point `REACT_APP_API_URL` to the deployed API.
- For production, use a real MongoDB instance such as MongoDB Atlas.

## Recommended Deployment Setup

### Render for both frontend and backend

This repository is now configured for a two-service Render Blueprint deployment:

- `social-post-app-backend`
  - Node web service
  - root directory: `backend`
- `social-post-app-frontend`
  - static site
  - root directory: `frontend`

Set these environment variables in Render:

#### Backend

```env
JWT_SECRET=your-long-random-secret
MONGODB_URI=your-mongodb-uri
REQUIRE_MONGODB=false
```

#### Frontend

```env
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
```

The frontend static site is configured for React SPA routing through `render.yaml`.

## Current Development Notes

- Image uploads are currently stored as `data:` URLs.
- Local fallback storage is temporary and resets when the backend restarts.
- For persistent production data, connect the backend to MongoDB.
