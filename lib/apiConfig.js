export const API_URL = '/api';
export const UPLOADS_URL = '/uploads';

export const getImageUrl = (url) => {
  if (!url) return '';
  
  // Handle absolute URLs
  if (url.startsWith('http')) {
    // If it's an internal URL (localhost or railway), convert to a relative path
    // this allows the Vercel proxy (next.config.mjs) to handle the request,
    // which solves ISP/DNS blocking issues on mobile networks like Airtel/Jio.
    if (url.includes('localhost') || url.includes('up.railway.app')) {
      const parts = url.split('/uploads/');
      if (parts[1]) {
        return `/uploads/${parts[1]}`;
      }
    }
    return url;
  }
  
  // Handle relative filenames
  return `/uploads/${url}`;
};
