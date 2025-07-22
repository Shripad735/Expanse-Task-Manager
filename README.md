# Sample Project Deployment Guide

## Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Click "New → Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (use render.yaml)
6. Add environment variables from `.env.example`
7. Deploy

## Frontend Deployment (Vercel)

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - **Framework**: React
   - **Root Directory**: `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL
5. Deploy

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
MONGODB_URI=your-mongodb-connection-string
```

### Frontend (.env.local)
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

## Post-Deployment

1. Update CORS origin in backend with your Vercel URL
2. Update REACT_APP_API_URL with your Render URL
3. Redeploy both services
