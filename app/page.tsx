import { createMetadata } from '@/lib/metadata'
import AdaptiveSiteExperience from '@/components/webmcp/AdaptiveSiteExperience'

export const metadata = createMetadata({
  title: 'Build your agentic enterprise',
  description:
    'Newtuple designs, ships, and operates production-grade AI. Tell the site who you are and it rebuilds itself around your goals in real time.',
  path: '/',
})

export default function HomePage() {
  return <AdaptiveSiteExperience />
}
