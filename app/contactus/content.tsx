import ConversationalContact from '@/components/sections/ConversationalContact'

interface ContactData {
  hero: {
    title: string
    description: string
  }
  thankYou: {
    title: string
    description: string
  }
}

export default function ContactContent({ data }: { data: ContactData }) {
  return (
    <>
      <ConversationalContact
        title={data.hero.title}
        description={data.hero.description}
        thankYouTitle={data.thankYou.title}
        thankYouDescription={data.thankYou.description}
      />
    </>
  )
}
