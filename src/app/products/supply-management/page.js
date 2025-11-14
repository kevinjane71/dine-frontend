import SupplyManagementClient from './SupplyManagementClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Supply Chain Management for Restaurant | SCM System | DineOpen',
  description: 'Complete supply chain management system for restaurants with GRN, purchase requisitions, supplier management, and AI-powered reorder suggestions.',
  keywords: 'supply chain management, restaurant SCM, purchase requisitions, GRN, supplier management, restaurant procurement',
  robots: { index: true, follow: true },
};

export default function SupplyManagementPage() {
  return <SupplyManagementClient />;
}

