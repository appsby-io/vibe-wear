# Claude Development Notes

## Project: vibe-wear - AI Custom Clothing Generation

### Current Status (2024-06-24)

#### Branch: `fixes`
Latest commit: `3351f35`

### OpenAI Model Migration: DALL-E 3 → gpt-image-1

#### What We Accomplished:
- ✅ Switched from DALL-E 3 to gpt-image-1 model in edge function
- ✅ Fixed edge function deployment by creating `netlify.toml`
- ✅ Improved error handling to show actual API errors instead of generic messages
- ✅ Fixed quality parameter (changed from 'standard'/'hd' to 'medium'/'high')
- ✅ Updated environment variable from `VITE_OPENAI_API_KEY` to `OPENAI_API_KEY_SERVER`
- ✅ Confirmed organization has gpt-image-1 access

#### Fixed Issues:
- ✅ Removed `response_format` parameter - gpt-image-1 doesn't support it
- ✅ Added base64 to data URL conversion in frontend
- ✅ Image generation now properly handles base64 responses

#### Latest Status:
- Image generation works with gpt-image-1
- API returns base64 data (b64_json field)
- Frontend converts base64 to data URLs for display
- Images display properly in the UI

#### Key Files Modified:
- `/netlify/edge-functions/generateImage.ts` - Changed model to gpt-image-1, updated quality params
- `/src/utils/imageGeneration.ts` - Improved error handling and logging
- `/src/hooks/useCart.ts` - Fixed circular dependency issue
- `/src/App.tsx` - Added support for VITE_GA_ID environment variable
- `netlify.toml` - Created for proper edge function deployment

#### Environment Variables Required in Netlify:
- `OPENAI_API_KEY_SERVER` - OpenAI API key with gpt-image-1 access
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GA_ID` - Google Analytics ID

#### Important Notes:
- gpt-image-1 requires organization verification (completed ✅)
- gpt-image-1 uses different quality parameters than DALL-E 3:
  - DALL-E 3: 'standard', 'hd'
  - gpt-image-1: 'low', 'medium', 'high', 'auto'
- The edge function is deployed at `/.netlify/edge-functions/generateImage`

#### Commands to Run:
```bash
# When returning to this work:
git checkout fixes
git pull origin fixes

# After making changes:
npm run lint
npm run build
git add -A
git commit -m "Your commit message"
git push origin fixes
```

### Testing Notes:
- Preview deployment URL format: `fixes--yoursite.netlify.app`
- Check browser console for detailed error logs
- Check Netlify Functions tab for server-side logs