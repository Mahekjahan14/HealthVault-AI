# Vercel Deployment

1. Push project to GitHub.
2. Import repository in Vercel.
3. Use:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm run vercel-build
   - Output Directory: frontend/dist
4. Add environment variables:
   - MONGODB_URI
   - GROQ_API_KEY
   - GEMINI_API_KEY
5. Deploy.

The app has demo fallback mode if API keys are missing, but for a real demo add all keys.
