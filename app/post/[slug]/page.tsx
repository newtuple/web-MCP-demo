import { notFound } from 'next/navigation'
import { createMetadata } from '@/lib/metadata'
import { getAllBlogPosts, getBlogPost, getRelatedPosts } from '@/lib/content'
import { SITE_URL, SITE_NAME, COMPANY } from '@/lib/constants'
import BlogPostContent from './content'

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) {
    return {}
  }

  const { frontmatter } = post
  return createMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/post/${frontmatter.slug}`,
    image: frontmatter.socialImage ?? frontmatter.heroImage,
    canonical: frontmatter.canonical,
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.slug, post.frontmatter.tags ?? [], 3)

  const { frontmatter } = post
  const postUrl = frontmatter.canonical ?? `${SITE_URL}/post/${frontmatter.slug}`
  const metadataImage = frontmatter.socialImage ?? frontmatter.heroImage
  const structuredImage = metadataImage
    ? metadataImage.startsWith('http')
      ? metadataImage
      : `${SITE_URL}${metadataImage}`
    : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated ?? frontmatter.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    url: postUrl,
    image: structuredImage ? [structuredImage] : undefined,
    author: frontmatter.author
      ? { '@type': 'Person', name: frontmatter.author }
      : { '@type': 'Organization', name: COMPANY.name },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.svg` },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </>
  )
}
