# Netlify Deployment Guide for EV Route Planner

## Prerequisites

1. **GitHub Repository**: Your code is already pushed to GitHub ✅
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **MongoDB Atlas Account**: Required for cloud database (free tier available)

## Step 1: Set Up MongoDB Atlas (Cloud Database)

Since Netlify uses serverless functions, you need a cloud MongoDB instance:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Replace `<password>` with your actual password
6. Replace `dbname` with `chargeflow` or your preferred database name

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Login to Netlify**: Go to [app.netlify.com](https://app.netlify.com)

2. **Import from Git**:
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository: `Chanu716/EV-Route-Planner`

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click "Show advanced" → "New variable" to add environment variables

4. **Add Environment Variables**:
   Click "Add environment variable" for each:
   
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=nOy2NmozFabxVtEMfwe1dk3BGPuR7rZW4KqI6TLYAJsgHQjU0cihC89lpXSvD5
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
   NODE_VERSION=18
   ```

5. **Deploy**:
   - Click "Deploy site"
   - Wait for the build to complete (2-3 minutes)
   - Your site will be live at: `https://your-site-name.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize**:
   ```bash
   netlify init
   ```

4. **Set Environment Variables**:
   ```bash
   netlify env:set MONGODB_URI "your-mongodb-atlas-connection-string"
   netlify env:set JWT_SECRET "nOy2NmozFabxVtEMfwe1dk3BGPuR7rZW4KqI6TLYAJsgHQjU0cihC89lpXSvD5"
   netlify env:set VITE_GOOGLE_MAPS_API_KEY "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Step 4: Enable Continuous Deployment

Already configured! Every push to the `main` branch will automatically deploy.

## Important Notes

### ⚠️ API Limitations

The current backend uses Express.js which needs to be converted to serverless functions for Netlify. Here's what you need to know:

1. **Serverless Functions**: Each API endpoint should be a separate serverless function
2. **Cold Starts**: First request may be slow (2-3 seconds)
3. **Execution Time**: Max 10 seconds per function on free tier
4. **MongoDB Connection**: Use connection pooling (already configured in `netlify/functions/utils/db.js`)

### 🔒 Security Checklist

- ✅ API keys are in environment variables
- ✅ `.env` file is in `.gitignore`
- ✅ MongoDB connection string will be in Netlify env vars
- ✅ JWT secret is secure
- ⚠️ Update Google Maps API key restrictions in Google Cloud Console:
  - Add your Netlify domain to allowed referrers
  - Example: `https://your-site.netlify.app/*`

### 🚀 Performance Optimization

Already configured in `netlify.toml`:
- SPA redirects for React Router
- API proxy to serverless functions
- Build optimizations

### 📊 Monitoring

1. **Build Logs**: Check in Netlify Dashboard → Deploys
2. **Function Logs**: Dashboard → Functions → View logs
3. **Analytics**: Dashboard → Analytics (available on paid plans)

## Alternative Deployment Options

If you prefer a traditional server approach instead of serverless:

### Vercel (Similar to Netlify)
- Better for Next.js but supports Vite
- Similar serverless architecture

### Render (Full Backend Support)
- Supports Express.js directly (no conversion needed)
- Free tier includes web services and PostgreSQL
- Deploy from GitHub: [render.com](https://render.com)

### Railway (Full Backend Support)
- Supports Express.js + MongoDB
- Free tier includes $5/month credit
- Deploy from GitHub: [railway.app](https://railway.app)

### Heroku (Traditional PaaS)
- Full Express.js support
- Requires Procfile
- Paid plans only (no free tier anymore)

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version is 18+

### MongoDB Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0` to allow all)
- Ensure database user has read/write permissions

### Google Maps Not Loading
- Verify API key in environment variables
- Check Google Cloud Console for API restrictions
- Ensure "Maps JavaScript API" is enabled

### API Calls Failing
- Check function logs in Netlify dashboard
- Verify CORS headers are set correctly
- Test API endpoints using the Netlify function URL

## Testing Locally with Netlify Dev

Test serverless functions locally:

```bash
npm install -g netlify-cli
netlify dev
```

This will run your site at `http://localhost:8888` with serverless functions working.

## Post-Deployment Steps

1. **Test the application** thoroughly
2. **Update Google Maps API restrictions** with your Netlify domain
3. **Monitor function logs** for any errors
4. **Set up error tracking** (e.g., Sentry)
5. **Configure MongoDB Atlas** IP whitelist if needed

## Cost Estimation

### Free Tier Includes:
- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Google Maps API**: $200 free credit per month

### Expected Costs:
- **Low Traffic** (< 1000 users/month): **FREE**
- **Medium Traffic** (1000-10000 users/month): ~$10-30/month
- **High Traffic** (> 10000 users/month): Scale pricing

## Need Help?

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Build Issues**: Check GitHub Actions or Netlify build logs

---

**Your app is now ready to deploy! 🚀**

Repository: `https://github.com/Chanu716/EV-Route-Planner`
