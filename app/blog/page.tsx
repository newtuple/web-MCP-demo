import { getAllBlogPosts } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import BlogListContent from './content'

export const metadata = createMetadata({
  title: 'Blog',
  description: 'Research notes, product updates, and practical field learnings from Newtuple.',
  path: '/blog',
})

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()
  return <BlogListContent posts={posts} />
}
