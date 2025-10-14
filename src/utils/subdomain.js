/**
 * Subdomain Redirect Utility
 * Handles redirecting users to their restaurant subdomain
 */

/**
 * Redirect to subdomain with token and user data in URL
 * @param {string} subdomainUrl - The subdomain URL to redirect to
 * @param {string} token - The JWT token to pass in URL
 * @param {object} userData - User data object to pass in URL
 */
export function redirectToSubdomain(subdomainUrl, token, userData = null) {
  if (!subdomainUrl || !token) {
    console.error('Subdomain URL and token are required for redirect');
    return;
  }

  // Add token to URL as query parameter
  let urlWithToken = `${subdomainUrl}?token=${encodeURIComponent(token)}`;
  
  // Add user data if available
  if (userData) {
    urlWithToken += `&user=${encodeURIComponent(JSON.stringify(userData))}`;
  }
  
  console.log('🔄 Redirecting to subdomain:', urlWithToken);
  
  // Redirect to subdomain
  window.location.href = urlWithToken;
}

/**
 * Extract token and user data from URL and store in localStorage
 * @returns {string|null} - The extracted token or null
 */
export function extractTokenFromUrl() {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userData = urlParams.get('user');
  
  if (token) {
    console.log('🔑 Token found in URL, storing in localStorage');
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    // Store user data if available
    if (userData) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('user', JSON.stringify(parsedUserData));
        console.log('👤 User data found in URL, storing in localStorage');
      } catch (error) {
        console.error('Failed to parse user data from URL:', error);
      }
    }
    
    // Clean up URL by removing token and user parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    url.searchParams.delete('user');
    window.history.replaceState({}, document.title, url.toString());
    
    return token;
  }
  
  return null;
}

/**
 * Check if current page is a subdomain
 * @returns {boolean} - Whether current page is a subdomain
 */
export function isSubdomain() {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  console.log('🔍 Checking subdomain for hostname:', hostname);
  
  // Check for production subdomain
  if (hostname.includes('.dineopen.com') && hostname !== 'dineopen.com' && hostname !== 'www.dineopen.com') {
    console.log('✅ Production subdomain detected');
    return true;
  }
  
  // Check for localhost subdomain (development)
  if (hostname.includes('.localhost') && hostname !== 'localhost') {
    console.log('✅ Localhost subdomain detected');
    return true;
  }
  
  console.log('❌ Not a subdomain');
  return false;
}

/**
 * Get current subdomain from hostname
 * @returns {string|null} - The subdomain or null
 */
export function getCurrentSubdomain() {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Check for production subdomain
  const dineopenMatch = hostname.match(/^([a-zA-Z0-9-]+)\.dineopen\.com$/);
  if (dineopenMatch) {
    return dineopenMatch[1];
  }
  
  // Check for localhost subdomain (development)
  const localhostMatch = hostname.match(/^([a-zA-Z0-9-]+)\.localhost$/);
  if (localhostMatch) {
    return localhostMatch[1];
  }
  
  return null;
}
