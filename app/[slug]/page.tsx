import { notFound } from 'next/navigation'
import { createMetadata } from '@/lib/metadata'
import { getPageContent } from '@/lib/content'
import { PAGE_REGISTRY, type PageSlug } from '../_pageRegistry'

type BasePageData = {
  title?: string
  description?: string
}

export function generateStaticParams() {
  return Object.keys(PAGE_REGISTRY).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = PAGE_REGISTRY[params.slug as PageSlug]
  if (!entry) {
    return {}
  }

  const { data } = getPageContent<BasePageData>(params.slug)
  const title = typeof data.title === 'string' ? data.title : params.slug
  const description = typeof data.description === 'string' ? data.description : ''

  return createMetadata({
    title,
    description,
    path: entry.path,
    noindex: params.slug === 'contactus',
  })
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const entry = PAGE_REGISTRY[params.slug as PageSlug]
  if (!entry) {
    notFound()
  }

  const { data } = getPageContent(params.slug)
  const { default: PageComponent } = (await entry.load()) as {
    default: React.ComponentType<{data: unknown}>
  }

  return <PageComponent data={data} />
}
