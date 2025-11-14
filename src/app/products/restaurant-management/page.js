import RestaurantManagementClient from './RestaurantManagementClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata = {
  title: 'Restaurant Management System | Complete POS Solution | DineOpen',
  description: 'Complete restaurant management system with POS, order tracking, kitchen display, staff management, and real-time analytics. Streamline your restaurant operations with DineOpen.',
  keywords: 'restaurant management system, restaurant POS, POS system for restaurant, order management, kitchen display system, staff management, restaurant analytics, restaurant software',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Restaurant Management System | DineOpen',
    description: 'Complete restaurant management system with POS, order tracking, and analytics.',
    url: 'https://www.dineopen.com/products/restaurant-management',
  },
};

export default function RestaurantManagementPage() {
  return <RestaurantManagementClient />;
}

