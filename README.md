BLOGGING PLATFORM — MERN Full Stack (React + JS + Tailwind)

## Structure
- `server/` — Express + MongoDB REST API
- `client/` — React (Vite) + Tailwind CSS frontend

## Prerequisites
- Node.js 18+
- MongoDB: local OR MongoDB Atlas (free)

## 1. Backend setup

```bash
cd server
cp .env.example .env   # then edit MONGO_URI + JWT_SECRET
npm install
npm run dev            # http://localhost:5000
```

`.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/blogging
# OR Atlas:
# MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/blogging
JWT_SECRET=super_secret_change_me
PORT=5000
CLIENT_URL=http://localhost:5173
```

API:
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (Bearer token)
- `GET /api/posts?search=&author=&page=1&limit=9`
- `GET /api/posts/:id`
- `POST /api/posts` (auth) { title, content, excerpt, coverImage, tags[] }
- `PUT /api/posts/:id` (auth, owner)
- `DELETE /api/posts/:id` (auth, owner)
- `PUT /api/posts/:id/like` (auth, toggle)
- `GET /api/posts/user/:userId`
- `GET /api/comments/post/:postId`
- `POST /api/comments/post/:postId` (auth) { text }
- `DELETE /api/comments/:id` (auth)
- `GET /api/users/:id` — author profile + posts
- `PUT /api/users/profile` (auth) { name, bio, avatar }

## 2. Frontend setup

```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Features implemented
- [x] Publish / edit / delete posts (owner only)
- [x] JWT user authentication (register/login/persist)
- [x] Comments + like toggle with counts
- [x] Author profiles (bio, avatar, their posts)
- [x] Search, tags, pagination
- [x] Tailwind responsive UI
