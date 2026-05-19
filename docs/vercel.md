# Vercel Deployment

This guide outlines how to deploy the React frontend of **NexFlow Assistant** to Vercel and connect it securely to your FastAPI backend.

---

## Frontend Deployment on Vercel (Dashboard Setup)

Use Vercel for hosting the React frontend. Because the project uses SQLite for database persistence, keep the FastAPI backend on a persistent backend host (such as Render, Railway, a VM, or AWS ECS with EFS).

### Step-by-Step Dashboard Setup
1. Push the latest code to GitHub.
2. Open your Vercel Dashboard and click **Add New Project**.
3. Import the `NexFlow_Assistant` GitHub repository.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(This is crucial! It tells Vercel to build inside the `/frontend` subfolder)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add the backend API environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-public-backend-url.com`
6. Click **Deploy**.

---

## Local CLI Deployment (Workspace Root)

If you want to manually deploy to Vercel using the Vercel CLI from your local system, you must deploy from the **workspace root** (rather than the subfolder) once Vercel's **Root Directory** setting is set to `frontend`.

1. Remove any old folder-level linkage:
   ```bash
   cd frontend
   rm -rf .vercel
   cd ..
   ```
2. Link and deploy from the workspace root:
   ```bash
   vercel --prod
   ```
3. Answer the prompts:
   - **Link to existing project?** `Yes`
   - **Which existing project?** `nexflowassisstant`
   - **Would you like to pull environment variables now?** `Yes`

Vercel will upload the workspace, scope the build automatically to `/frontend`, and deploy successfully!

---

## Testing Your Live Vercel Frontend with Local Backend (localtunnel)

If you want to test the fully deployed Vercel frontend against your local backend (`http://localhost:8000`) without a public persistent cloud deployment, you must bypass browser **Mixed Content Security** (which blocks HTTPS-to-HTTP requests).

Here is the exact localtunnel setup used to deploy and connect your project:

### 1. Expose Local Port 8000 Securely
Run the following command in a new terminal window to expose your local FastAPI backend to a secure public HTTPS endpoint:
```bash
npx -y localtunnel --port 8000
```
This will output a public URL, for example:
```text
your url is: https://quick-candles-type.loca.lt
```

### 2. Configure Frontend Environment
Create or update the `.env` file in your `frontend` directory with the secure tunnel URL:
```env
VITE_API_URL=https://quick-candles-type.loca.lt
```

### 3. Redeploy the Frontend
From the workspace root directory, redeploy the frontend so Vite compiles with the new public API URL:
```bash
vercel --prod --yes
```

Now, your live Vercel frontend (`https://nexflowassisstant.vercel.app`) can securely send requests to your local FastAPI backend via the secure HTTPS tunnel!

---

## React Router Support

The file `frontend/vercel.json` rewrites all routes to `index.html` so that deep-linking and browser refreshes work correctly for your custom pages:
- `/signup`
- `/signin`
- `/chat`
- `/admin`
