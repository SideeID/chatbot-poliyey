import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://jempol.sideid.tech',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // {
    //   url: 'https://jempol.sideid.tech/tentang',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
    // {
  ];
}
