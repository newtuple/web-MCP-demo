import { getPageContent } from '@/lib/content'
import TerminalAccelerators from '@/components/showcase/TerminalAccelerators'

const WHY_BULLETS: Record<string, string[]> = {
  'Docker-Compose Bundles': ['One-command deploy', 'Terraform & Helm optional', 'Works on any cloud'],
  Composable: ['Clean REST APIs', 'Event-driven integration', 'Mix and match freely'],
  'Fully Customizable': ['100% source access', 'Extend any module', 'White-label ready'],
}

const ACC_TERMINALS: Record<string, { type: string; text: string }[]> = {
  Dialogtuple: [
    { type: 'cmd', text: '$ docker compose up dialogtuple' },
    { type: 'out', text: '[✓] Multi-agent chatbot running on :8080' },
  ],
  // Temporarily hidden while Omnituple is not working.
  // Omnituple: [
  //   { type: 'cmd', text: '$ docker compose up omnituple' },
  //   { type: 'out', text: '[✓] Analytics dashboard running on :8082' },
  // ],
  Gaugetuple: [
    { type: 'cmd', text: '$ docker compose up gaugetuple' },
    { type: 'out', text: '[✓] Evaluation suite running on :8083' },
  ],
}

export default function ShowcasePage() {
  const { data } = getPageContent('genai-accelerators')

  const enriched = {
    ...data,
    hero: {
      ...data.hero,
      statusPhrases: data.hero?.statusPhrases ?? [
        'Deploying accelerators...',
        'Loading modules...',
        'Initializing agents...',
        'Systems online.',
      ],
      installCommand: data.hero?.installCommand ?? 'npx create-newtuple-app@latest',
    },
    why: {
      ...data.why,
      items: (data.why?.items ?? []).map((item: { title: string; icon: string; description: string; bullets?: string[] }) => ({
        ...item,
        bullets: item.bullets ?? WHY_BULLETS[item.title] ?? [],
      })),
    },
    accelerators: {
      ...data.accelerators,
      items: (data.accelerators?.items ?? []).map((item: { name: string; terminal?: { type: string; text: string }[] }) => ({
        ...item,
        terminal: item.terminal ?? ACC_TERMINALS[item.name] ?? [],
      })),
    },
    showDeployment: data.showDeployment ?? true,
  }

  return <TerminalAccelerators data={enriched} />
}
