import { MetadataRoute } from 'next';
import { loadDatabase } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cuai.edu';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/forms/1st-year`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forms/2nd-year`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forms/3rd-year`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forms/4th-year`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chat/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const db = loadDatabase();
    if (db.year_folders) {
      const dynamicFolderRoutes: MetadataRoute.Sitemap = db.year_folders.map(f => ({
        url: `${baseUrl}/forms/${f.slug}`,
        lastModified: new Date(f.created_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      return [...staticRoutes, ...dynamicFolderRoutes.filter(r => !staticRoutes.some(s => s.url === r.url))];
    }
  } catch {}

  return staticRoutes;
}
