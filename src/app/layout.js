import '../styles/globals.css'

export const metadata = {
  title: 'Dine - Restaurant Management System',
  description: 'Complete restaurant management solution with QR menus, ordering, and analytics',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  )
}
