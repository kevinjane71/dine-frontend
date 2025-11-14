import HotelManagementClient from './HotelManagementClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Hotel Management System | PMS for Hotels | DineOpen',
  description: 'Complete Property Management System (PMS) for hotels with room booking, guest management, housekeeping, and maintenance tracking.',
  keywords: 'hotel management system, PMS, property management system, hotel booking, guest management, housekeeping management',
  robots: { index: true, follow: true },
};

export default function HotelManagementPage() {
  return <HotelManagementClient />;
}

