import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cuai.edu';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/forms/', '/chat/login'],
        disallow: [
          '/admin/',
          '/super-admin/',
          '/api/',
          '/unauthorized',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
