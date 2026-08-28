import { createMetadata } from '@/lib/metadata'
import { getPageContent } from '@/lib/content'
import ReactMarkdown from 'react-markdown'
import Section from '@/components/ui/Section'

const { data, body } = getPageContent('service-agreement')

export const metadata = createMetadata({
  title: data.title,
  description: data.description,
  path: '/service-agreement',
  noindex: true,
})

export default function ServiceAgreementPage() {
  return (
    <div className="pt-32 pb-20">
      <Section>
        <div className="max-w-3xl mx-auto prose prose-gray prose-headings:text-gray-900 prose-p:font-light prose-p:leading-relaxed">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      </Section>
    </div>
  )
}
