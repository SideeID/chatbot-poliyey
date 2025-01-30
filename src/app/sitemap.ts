import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://jempol.side.my.id',
      lastModified: new Date(),
    },
  ];
}
