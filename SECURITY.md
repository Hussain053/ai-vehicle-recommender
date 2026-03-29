# Security Guide for AI Vehicle Recommender

## Vulnerabilities Fixed

### 1. ✅ API Key Exposure
**Issue**: Gemini API key was hardcoded in client-side code
**Fix**: API key is now only stored on the backend server

### 2. ✅ No Request Validation
**Issue**: No input validation or rate limiting
**Fix**: Backend now validates all requests and implements rate limiting (10 req/min per IP)

### 3. ✅ Direct API Access
**Issue**: Frontend made direct calls to Gemini API
**Fix**: All API calls now go through a backend proxy

---

## Setup Instructions

### Install Dependencies
```bash
npm install
```

### Environment Variables

1. **Create `.env.local`** in project root (already configured, but verify):
   ```
   VITE_API_URL=http://localhost:5000
   GEMINI_API_KEY=your_actual_key_here
   ```

2. **Never commit credentials**:
   - `.env.local` is in `.gitignore` ✓
   - Use `.env.example` as a template for other developers

### Development Mode

**Terminal 1 - Start Backend**:
```bash
npm run server
```

**Terminal 2 - Start Frontend**:
```bash
npm run dev
```

Or use both simultaneously:
```bash
npm run dev:full
```

---

## Security Best Practices Implemented

### Backend Security
- ✅ API key only on server
- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Request validation
- ✅ CORS enabled for local development
- ✅ Error handling without exposing sensitive info

### Frontend Security
- ✅ No hardcoded credentials
- ✅ Environment variables prefixed with `VITE_` (Vite best practice)
- ✅ Backend URL configurable per environment
- ✅ User input passed to backend for processing

---

## Additional Hardening (Production)

### For Production Deployment:

1. **Update Backend URL**:
   ```bash
   VITE_API_URL=https://your-production-api.com
   ```

2. **Enable HTTPS**:
   ```javascript
   // In server.js, add SSL
   import https from 'https';
   import fs from 'fs';
   
   const options = {
     key: fs.readFileSync('path/to/key.pem'),
     cert: fs.readFileSync('path/to/cert.pem')
   };
   https.createServer(options, app).listen(5000);
   ```

3. **Strengthen Rate Limiting**:
   - Use Redis for distributed rate limiting
   - Implement per-user rate limits with authentication
   - Add DDoS protection (Cloudflare)

4. **Add Authentication**:
   ```javascript
   // Add API key requirement for frontend calls
   const authenticateRequest = (req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (!apiKey || apiKey !== process.env.FRONTEND_API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   };
   app.use('/api/', authenticateRequest);
   ```

5. **Environment-Specific Configuration**:
   - `.env.development` - Local development
   - `.env.staging` - Staging server
   - `.env.production` - Production (never committed!)

6. **Monitor API Usage**:
   - Log all API requests
   - Set up alerts for unusual patterns
   - Track API costs

---

## Testing Security

### Check for Exposed Keys
```bash
# Search for API keys in code
grep -r "AIzaSy" src/ --exclude-dir=node_modules
```

### Verify Backend Handling
1. Start backend: `npm run server`
2. Test without frontend:
   ```bash
   curl -X POST http://localhost:5000/api/recommendations \
     -H "Content-Type: application/json" \
     -d '{"vehicleType":"car","minBudget":5,"maxBudget":15,"city":"Pune","state":"Maharashtra"}'
   ```

---

## Common Mistakes to Avoid

❌ **Don't**:
- Commit `.env.local` or any file with `GEMINI_API_KEY`
- Use `process.env.GEMINI_API_KEY` in frontend code
- Expose backend URLs in error messages
- Skip input validation on backend

✅ **Do**:
- Keep credentials in `.env.local` (in `.gitignore`)
- Use environment variables with `VITE_` prefix (frontend only)
- Validate all user input on the backend
- Use HTTPS in production
- Implement proper error handling

---

## Troubleshooting

### "Cannot connect to server" error
- Ensure backend is running: `npm run server`
- Check `VITE_API_URL` in `.env.local`
- Verify backend port (default: 5000)

### 429 Rate Limit error
- Wait 1 minute before requesting again
- Implement caching on frontend for repeated queries

### API key not working
- Verify key in `.env.local` (backend only)
- Check API key is valid in Google Cloud Console
- Ensure Generative AI API is enabled

