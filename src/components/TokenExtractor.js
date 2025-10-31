'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { extractTokenFromUrl, isSubdomain } from '../utils/subdomain';

/**
 * Token Extraction Component
 * Extracts token from URL parameters and stores in localStorage
 * Should be used on subdomain pages
 */
const TokenExtractor = () => {
  const router = useRouter();

  useEffect(() => {
    // Extract token from URL if present
    const token = extractTokenFromUrl();
    
    if (token) {
      // SECURITY: Commented out to prevent exposing sensitive token data in console logs
      // console.log('✅ Token extracted and stored from URL');
      
      // If we're on a subdomain and have a token, clean up URL but don't redirect
      // Let the dashboard page handle the authentication and redirect
      if (isSubdomain()) {
        console.log('🔄 Cleaning up URL (dashboard will handle redirect)');
        // Just clean up the URL, don't redirect
        const url = new URL(window.location);
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [router]);

  // This component doesn't render anything
  return null;
};

export default TokenExtractor;
