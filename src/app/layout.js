import './globals.css'
import PrefetchErrorBoundary from '../components/PrefetchErrorBoundary'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: 'DineOpen - AI-Powered Restaurant Management System | POS, Inventory & Order Tracking',
  description: 'Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, order tracking, QR menus, and real-time analytics. Streamline your restaurant operations with DineOpen.',
  keywords: 'restaurant management, POS system, inventory management, order tracking, QR menu, restaurant analytics, multi-restaurant management, AI restaurant, food service management, restaurant software, table management, kitchen display system, restaurant POS, order management system',
  authors: [{ name: 'DineOpen Team' }],
  creator: 'DineOpen',
  publisher: 'DineOpen',
  robots: 'index, follow',
  openGraph: {
    title: 'DineOpen - AI-Powered Restaurant Management System',
    description: 'Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, and order tracking.',
    url: 'https://dineopen.com',
    siteName: 'DineOpen',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DineOpen Restaurant Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DineOpen - AI-Powered Restaurant Management System',
    description: 'Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, and order tracking.',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ef4444',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Prefetch Error Handler - Must load first */}
        <script src="/prefetch-error-handler.js" async></script>
      </head>
      <body suppressHydrationWarning={true} className={inter.className}>
        <PrefetchErrorBoundary>
          {children}
        </PrefetchErrorBoundary>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  )
}
