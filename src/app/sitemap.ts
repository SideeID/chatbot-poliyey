import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://jempol.sideid.tech',
      lastModified: new Date(),
    },
  ];
}
