import InventoryManagementClient from './InventoryManagementClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Inventory Management for Restaurant | Stock Tracking | DineOpen',
  description: 'Complete inventory management system for restaurants with stock tracking, low stock alerts, purchase orders, and real-time inventory updates.',
  keywords: 'restaurant inventory management, stock management, inventory tracking, purchase orders, stock alerts, restaurant inventory software',
  robots: { index: true, follow: true },
};

export default function InventoryManagementPage() {
  return <InventoryManagementClient />;
}

