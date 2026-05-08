export const API_URL = '/api';
export const UPLOADS_URL = '/uploads';

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) {
    // If it's a railway URL, convert to relative to use the proxy
    if (url.includes('up.railway.app')) {
      return url.split('/uploads/')[1] ? `/uploads/${url.split('/uploads/')[1]}` : url;
    }
    return url;
  }
  return `${UPLOADS_URL}/${url}`;
};
