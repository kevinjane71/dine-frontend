export default function sitemap() {
  const baseUrl = 'https://www.dineopen.com';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Blog posts
  const blogPosts = [
    'why-dineopen-future-restaurant-management',
    'how-to-reduce-restaurant-operating-costs',
    'ultimate-guide-restaurant-inventory-management',
    'why-qr-code-menus-are-essential-in-2024',
    'ai-powered-restaurant-management-guide',
    'best-practices-restaurant-staff-management',
    'how-to-increase-restaurant-revenue',
    'restaurant-technology-trends-2024',
    'best-restaurant-pos-systems-india-comparison-2024'
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
}

