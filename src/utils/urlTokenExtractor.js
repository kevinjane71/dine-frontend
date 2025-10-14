/**
 * URL Token Extractor Utility
 * Extracts authentication tokens and user data from URL parameters
 * and cleans the URL after extraction
 */

export const extractTokenFromUrl = () => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userData = urlParams.get('user');

  if (token || userData) {
    console.log('🔗 Token found in URL:', !!token);
    console.log('👤 User data found in URL:', !!userData);

    // Clean the URL by removing token parameters
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('token');
    cleanUrl.searchParams.delete('user');
    
    // Update the URL without triggering a page reload
    window.history.replaceState({}, '', cleanUrl.toString());
    
    console.log('🧹 URL cleaned, token parameters removed');

    return {
      token: token ? decodeURIComponent(token) : null,
      user: userData ? JSON.parse(decodeURIComponent(userData)) : null
    };
  }

  return null;
};

export const hasTokenInUrl = () => {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('token') || urlParams.has('user');
};

export default extractTokenFromUrl;
