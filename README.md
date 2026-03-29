# 🚗 AI Vehicle Recommender

An intelligent vehicle recommendation system powered by Google Gemini AI. Find the perfect car or bike based on your budget, location, and preferences.

## Features

- 🤖 AI-powered vehicle recommendations using Google Gemini
- 🚙 Support for both cars and bikes
- 💰 Budget-based filtering
- 📍 Location-aware recommendations
- 📊 Detailed comparison tables
- 🔒 Secure backend API proxy

## Quick Start

### Prerequisites
- Node.js 16+
- Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-vehicle-recommender.git
   cd ai-vehicle-recommender
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your API key:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   VITE_API_URL=http://localhost:5000
   ```

4. Start both backend and frontend:
   ```bash
   npm run dev:full
   ```

   Or run separately:
   - Backend: `npm run server` (runs on port 5000)
   - Frontend: `npm run dev` (runs on port 3000)

## Security

This project implements secure API practices:
- ✅ Backend proxy for all API calls
- ✅ API keys never exposed to frontend
- ✅ Rate limiting (10 requests/min per IP)
- ✅ Input validation

See [SECURITY.md](SECURITY.md) for detailed security information.

## Deployment

### GitHub Pages + Cloud Function

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions.

## Technologies

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express
- **AI**: Google Gemini 2.5 Flash

## License

MIT
