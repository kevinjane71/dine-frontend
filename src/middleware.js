import { NextResponse } from 'next/server';

// Subdomain detection and routing middleware
export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Skip if hostname is not available or it's an IP address
  if (!hostname || hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
    return NextResponse.next();
  }
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  let subdomain = null;
  
  // Check for localhost subdomains (e.g., myrestaurant.localhost:3002)
  if (hostname.includes('localhost')) {
    const localhostParts = hostname.split('.localhost');
    if (localhostParts.length > 1) {
      subdomain = localhostParts[0];
    }
  }
  // Check for production subdomains (e.g., restaurant-name.dineopen.com)
  else if (parts.length > 2 && hostname.endsWith('.dineopen.com')) {
    subdomain = parts[0];
  }
  
  // Reserved subdomains that should not be treated as restaurant subdomains
  const reservedSubdomains = ['www', 'api', 'app', 'support', 'dineopen', 'localhost'];
  
  // Check if it's a valid restaurant subdomain
  const isValidSubdomain = subdomain && 
                          !reservedSubdomains.includes(subdomain) && 
                          subdomain.length > 2 &&
                          /^[a-z0-9-]+$/.test(subdomain);
  
          if (isValidSubdomain) {
            console.log(`[Middleware] Subdomain detected: ${subdomain} from ${hostname}`);
            
            // Redirect login requests to main domain
            if (url.pathname === '/login') {
              const mainDomainLogin = 'https://www.dineopen.com/login';
              console.log(`[Middleware] Redirecting login from subdomain to main domain: ${mainDomainLogin}`);
              return NextResponse.redirect(mainDomainLogin);
            }
            
            // Only rewrite the root path to restaurant subdomain page
            // Let other paths like /placeorder pass through normally
            if (url.pathname === '/') {
              url.pathname = `/restaurant/${subdomain}`;
              console.log(`[Middleware] Rewriting ${hostname}${request.nextUrl.pathname} to ${url.pathname}`);
              return NextResponse.rewrite(url);
            }
            
            // For other paths, let them pass through normally
            console.log(`[Middleware] Letting ${hostname}${request.nextUrl.pathname} pass through`);
            return NextResponse.next();
          }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
