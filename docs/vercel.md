# Vercel Deployment

Use Vercel for the React frontend. Keep the FastAPI backend on a persistent backend host such as Render, Railway, a VM, or your Docker server because this project currently uses SQLite for users and leads.

## Frontend Deployment on Vercel

1. Push the latest code to GitHub.
2. Open Vercel and click **Add New Project**.
3. Import the `NexFlow_Assistant` GitHub repository.
4. Configure the project:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Add this Vercel environment variable:

```env
VITE_API_URL=https://your-backend-api-url
```

6. Deploy.

## Backend Requirement

The frontend calls the backend through `VITE_API_URL`. Deploy the FastAPI backend first, then paste that public backend URL into Vercel.

For example:

```env
VITE_API_URL=https://nexflow-backend.onrender.com
```

## React Router Support

The file `frontend/vercel.json` rewrites all routes to `index.html`, so these URLs work after refresh:

```text
/signup
/signin
/chat
/admin
```

## Important Notes

- Do not add `GEMINI_API_KEY` to the Vercel frontend project. It belongs only on the backend.
- `VITE_API_URL` is public because frontend environment variables are bundled into browser code.
- If the frontend deploys but login/chat fails, check that the backend URL is correct and that backend CORS allows your Vercel domain.

Add your Vercel frontend URL to the backend environment:

```env
CORS_ORIGINS=http://localhost:5173,https://your-vercel-app.vercel.app
```
