import { Metadata } from 'next';
import { generateSitemapXML } from '@/lib/seo';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const urls = [
    {
      url: '/',
      lastModified: new Date(),
      priority: 1.0,
      changefreq: 'weekly',
    },
    {
      url: '/dashboard',
      lastModified: new Date(),
      priority: 0.9,
      changefreq: 'daily',
    },
    {
      url: '/emissions',
      lastModified: new Date(),
      priority: 0.8,
      changefreq: 'weekly',
    },
    {
      url: '/reports',
      lastModified: new Date(),
      priority: 0.8,
      changefreq: 'monthly',
    },
    {
      url: '/analytics',
      lastModified: new Date(),
      priority: 0.7,
      changefreq: 'weekly',
    },
    {
      url: '/collaboration',
      lastModified: new Date(),
      priority: 0.6,
      changefreq: 'weekly',
    },
    {
      url: '/settings',
      lastModified: new Date(),
      priority: 0.5,
      changefreq: 'monthly',
    },
    {
      url: '/rgpd',
      lastModified: new Date(),
      priority: 0.4,
      changefreq: 'monthly',
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
      changefreq: 'weekly',
    },
    ...urls.map(({ url, lastModified, priority, changefreq }) => ({
      url: `${baseUrl}${url}`,
      lastModified,
      priority,
      changefreq,
    })),
  ];
}