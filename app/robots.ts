import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/crear', '/upgrade'],
    },
    sitemap: 'https://tinkuy.app/sitemap.xml',
  }
}
