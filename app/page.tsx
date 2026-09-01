import { createMetadata } from '@/lib/metadata'
import { getAllCaseStudies } from '@/lib/content'
import AdaptiveSiteExperience from '@/components/webmcp/AdaptiveSiteExperience'

const caseStudies = getAllCaseStudies()

export const metadata = createMetadata({
  title: 'The website that rebuilds itself for every visitor',
  description:
    'Tell Newtuple what you are trying to improve and the homepage rebuilds around you, live.',
  path: '/',
})

export default function HomePage() {
  return <AdaptiveSiteExperience caseStudies={caseStudies} />
}
