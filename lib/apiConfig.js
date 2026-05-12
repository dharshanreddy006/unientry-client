export const API_URL = '/api';
export const UPLOADS_URL = 'https://unientry-server-production.up.railway.app/uploads';

export const getImageUrl = (url) => {
  if (!url) return '';
  
  // Handle absolute URLs
  if (url.startsWith('http')) {
    // If it's a local development URL or a railway URL, normalize it to the production server
    if (url.includes('localhost') || url.includes('up.railway.app')) {
      const parts = url.split('/uploads/');
      if (parts[1]) {
        return `${UPLOADS_URL}/${parts[1]}`;
      }
    }
    return url;
  }
  
  // Handle relative filenames
  return `${UPLOADS_URL}/${url}`;
};
