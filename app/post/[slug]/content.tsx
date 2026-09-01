'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, RefreshCw, User } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Badge from '@/components/ui/Badge'
import FadeIn from '@/components/motion/FadeIn'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import CTASection from '@/components/sections/CTASection'
import MarkdownContent from '@/components/blog/MarkdownContent'
import NewsletterForm from '@/components/blog/NewsletterForm'
import SocialShare from '@/components/blog/SocialShare'
import type { BlogPost, BlogPostSummary } from '@/lib/content'
import { getBlogImageMotionClass } from '@/lib/blogImages'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function RelatedPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block h-full">
      <div className="h-full rounded-2xl bg-white shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {post.coverImage || post.heroImage ? (
          <div className="aspect-[16/9] overflow-hidden bg-gray-50/50">
            <img
              src={post.coverImage || post.heroImage}
              alt={post.title}
              className={`w-full h-full object-contain transition-transform duration-500 ${getBlogImageMotionClass(post.coverImage || post.heroImage)}`}
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-[var(--accent-50)] to-[var(--accent-100)]/80 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-200)]/40" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--accent-800)] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPostContent({
  post,
  relatedPosts,
}: {
  post: BlogPost
  relatedPosts: BlogPostSummary[]
}) {
  const { frontmatter, body, readingTime } = post

  return (
    <main className="min-h-screen">
      {/* Article hero */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-hero">
        <div className="absolute inset-0 bg-grid" />
        <Container className="relative z-10">
          <FadeIn>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent-700)] hover:text-[var(--accent-900)] mb-8 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </FadeIn>

          <div className="max-w-3xl">
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <FadeIn delay={0.05}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="cobalt">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </FadeIn>
            )}

            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-gray-900 mb-4 antialiased">
                {frontmatter.title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-gray-600 font-normal leading-relaxed mb-6 antialiased">
                {frontmatter.description}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div
                className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 border-t border-gray-200/60 pt-6 antialiased"
                role="doc-details"
              >
                {frontmatter.authors && frontmatter.authors.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {frontmatter.authors.map((author) => (
                      <span key={author.name} className="flex items-center gap-2">
                        {author.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <User className="w-4 h-4 shrink-0" aria-hidden />
                        )}
                        {author.linkedin ? (
                          <a
                            href={author.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-[var(--accent-700)] transition-colors font-medium text-gray-700"
                          >
                            {author.name}
                          </a>
                        ) : (
                          <span className="font-medium text-gray-700">{author.name}</span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : frontmatter.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 shrink-0" aria-hidden />
                    {frontmatter.author}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" aria-hidden />
                  {formatDate(frontmatter.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" aria-hidden />
                  {readingTime} min read
                </span>
                {frontmatter.updated && (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 shrink-0" aria-hidden />
                    Updated {formatDate(frontmatter.updated)}
                  </span>
                )}
                <SocialShare title={frontmatter.title} description={frontmatter.description} />
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Hero image */}
      {frontmatter.heroImage && (
        <FadeIn delay={0.3}>
          <Container className="py-8">
            <div className="max-w-4xl mx-auto">
              <img
                src={frontmatter.heroImage}
                alt={frontmatter.title}
                className="w-full rounded-2xl border border-gray-200 shadow-premium-lg"
              />
            </div>
          </Container>
        </FadeIn>
      )}

      {/* Article body */}
      <section className="py-12 md:py-16" aria-label="Article content">
        <Container>
          <article className="max-w-3xl mx-auto">
            <div className="max-w-prose [&>*:first-child]:mt-0">
              <FadeIn>
                <MarkdownContent content={body} />
              </FadeIn>
            </div>
          </article>
        </Container>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Section className="bg-gray-50">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2 text-center">
              Related articles
            </h2>
            <p className="text-gray-600 font-light text-center mb-10">
              Continue exploring insights from the Newtuple team.
            </p>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rp) => (
              <StaggerItem key={rp.slug}>
                <RelatedPostCard post={rp} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Section>
      )}

      {/* Newsletter */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <NewsletterForm />
        </div>
      </Section>

      <CTASection
        title="Ready to build production AI?"
        description="Talk to our team about AI agents, data platforms, and GenAI accelerators."
      />
    </main>
  )
}
