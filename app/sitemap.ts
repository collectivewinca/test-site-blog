import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

type Blog = {
  draft?: boolean
  path: string
  lastmod?: string
  date: string
  tags?: string[]
}

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')

  // Helper function to format date in the required format
  const formatDate = (date: Date) => {
    return date.toISOString().split('.')[0] + '+00:00'
  }

  // Static routes with specific priorities and change frequencies
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: formatDate(new Date()),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: formatDate(new Date()),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: formatDate(new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: formatDate(new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ]

  // Blog routes with high priority and weekly changes
  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path.replace(/^\//, '')}`,
      lastModified: formatDate(new Date(post.lastmod || post.date)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

  // Tag pages with high priority and weekly changes
  const tags = Array.from(new Set(allBlogs.flatMap((post: Blog) => post.tags || [])))
  const tagRoutes = tags.map((tag: string) => ({
    url: `${siteUrl}/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: formatDate(new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...tagRoutes, ...blogRoutes].sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  )
}