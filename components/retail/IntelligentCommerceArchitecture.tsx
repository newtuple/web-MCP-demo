import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Bot,
  Clock,
  CreditCard,
  Database,
  Eye,
  Gauge,
  GitBranch,
  Globe,
  Lock,
  MessageSquare,
  RefreshCw,
  Server,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react'

type IconComponent = LucideIcon

interface MetricItem {
  icon: IconComponent
  valueLines: string[]
  valueSize: number
  labelLines: string[]
}

interface InputItem {
  icon: IconComponent
  iconBackground: string
  title: string
  description: string
}

interface OutcomeItem {
  icon: IconComponent
  title: string
  description: string
}

interface EnterpriseItem {
  icon: IconComponent
  filled?: boolean
  titleLines: string[]
}

const colors = {
  blue: '#0047AB',
  dark: '#0E1320',
  muted: '#6B7686',
  border: '#E2E6EC',
  softBorder: '#CBD2DC',
  softText: '#4B5563',
}

const metrics: MetricItem[] = [
  {
    icon: TrendingUp,
    valueLines: ['3-5%'],
    valueSize: 24,
    labelLines: ['Higher Shelf', 'Availability'],
  },
  {
    icon: CreditCard,
    valueLines: ['10-15%'],
    valueSize: 24,
    labelLines: ['Lower Store', 'Operating Cost'],
  },
  {
    icon: Clock,
    valueLines: ['15-20%'],
    valueSize: 24,
    labelLines: ['Less Reporting', '& Analysis'],
  },
  {
    icon: Zap,
    valueLines: ['8-12 wks'],
    valueSize: 24,
    labelLines: ['To a Live,', 'Measurable Result'],
  },
]

const unifiedInputs: InputItem[] = [
  {
    icon: Database,
    iconBackground: '#0047AB',
    title: 'Enterprise Data Sources',
    description: 'ERP, CRM, POS, Inventory, sales & workforce (SAP, Oracle, Aptos)',
  },
  {
    icon: GitBranch,
    iconBackground: '#10B981',
    title: 'Planning & Supply',
    description: 'Blue Yonder, Relex, o9, Manhattan / Körber WMS',
  },
  {
    icon: BookOpen,
    iconBackground: '#2E6FD6',
    title: 'Product & Content (PIM)',
    description: 'Salsify, Syndigo, Stibo, Akeneo, Informatica',
  },
  {
    icon: Globe,
    iconBackground: '#E8852B',
    title: 'External Intelligence',
    description: 'Market trends, competitive pricing & demand signals',
  },
]

const intelligentOutcomes: OutcomeItem[] = [
  {
    icon: MessageSquare,
    title: 'Retail Operations Copilot',
    description: 'Ask any store question — get the next action',
  },
  {
    icon: Bot,
    title: 'Store Manager Assistant',
    description: 'Daily priorities; managers lead, not chase data',
  },
  {
    icon: AlertTriangle,
    title: 'Exception Agent',
    description: 'Catches shelf gaps & price errors before lost sales',
  },
  {
    icon: RefreshCw,
    title: 'Availability & Replenishment',
    description: 'Lifts on-shelf availability 3-5%',
  },
  {
    icon: Tag,
    title: 'Digital Shelf & Content',
    description: 'Wins the PDP and AI-mediated discovery',
  },
  {
    icon: ShieldCheck,
    title: 'Data Quality & Governance',
    description: 'Audit-ready - every action logged & evaluated',
  },
]

const enterpriseScaleItems: EnterpriseItem[] = [
  {
    icon: Lock,
    filled: true,
    titleLines: ['Secure &', 'Compliant'],
  },
  {
    icon: Share2,
    titleLines: ['API-First', 'Architecture'],
  },
  {
    icon: Eye,
    titleLines: ['Real-Time', 'Observability'],
  },
  {
    icon: Gauge,
    titleLines: ['Evals &', 'Benchmarking'],
  },
  {
    icon: Server,
    titleLines: ['Scalable', 'Infrastructure'],
  },
]

const labelChipStyle: CSSProperties = {
  background: colors.blue,
  color: '#fff',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: 4,
  display: 'inline-block',
  whiteSpace: 'nowrap',
}

const connectorLineStyle: CSSProperties = {
  width: 12,
  height: 1.5,
  background: colors.blue,
}

function StackedLines({
  lines,
  style,
}: {
  lines: string[]
  style?: CSSProperties
}) {
  return (
    <>
      {lines.map((line) => (
        <span key={line} style={{ display: 'block', ...style }}>
          {line}
        </span>
      ))}
    </>
  )
}

function SectionChip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...labelChipStyle, ...style }}>{children}</div>
}

function ArrowConnector({ width = 12 }: { width?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', paddingTop: 11, flexShrink: 0 }}>
      <div style={{ ...connectorLineStyle, width }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: '3.5px solid transparent',
          borderBottom: '3.5px solid transparent',
          borderLeft: `5px solid ${colors.blue}`,
        }}
      />
    </div>
  )
}

function VerticalConnector({ lineHeight = 20 }: { lineHeight?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <div
        style={{
          width: 1.5,
          height: lineHeight,
          background: colors.blue,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `6px solid ${colors.blue}`,
        }}
      />
    </div>
  )
}

function FlowConnector() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 6px' }}>
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(0,71,171,0.35)',
            display: 'block',
          }}
        />
      ))}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: '6px solid rgba(0,71,171,0.45)',
        }}
      />
    </div>
  )
}

function IconCircle({
  icon: Icon,
  size,
  iconSize,
  color,
  background,
  border,
}: {
  icon: IconComponent
  size: number
  iconSize: number
  color: string
  background: string
  border?: string
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        flexShrink: 0,
        border,
      }}
    >
      <Icon size={iconSize} strokeWidth={1.5} style={{ display: 'block' }} />
    </div>
  )
}

export default function IntelligentCommerceArchitecture({ className = '' }: { className?: string }) {
  return (
    <div className={className} style={{ width: '100%', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      <div className="desktop-layout" style={{ overflowX: 'auto' }}>
        <div
          style={{
            background: '#fff',
            padding: '36px 44px',
            maxWidth: 1240,
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <h1
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: colors.dark,
                margin: '0 0 8px',
                letterSpacing: '-0.5px',
                lineHeight: 1.15,
              }}
            >
              Intelligent Commerce Architecture
            </h1>
            <p style={{ fontSize: 15, color: colors.muted, margin: 0, fontWeight: 300 }}>
              Higher shelf availability, lower store cost, and a winning digital shelf — governed AI across your existing stack.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              border: `1.5px solid ${colors.border}`,
              borderRadius: 12,
              padding: '16px 40px',
              marginBottom: 18,
              gap: 8,
            }}
          >
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.valueLines.join('-')}
                  style={{ display: 'contents' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ color: colors.blue, flexShrink: 0, display: 'flex' }}>
                      <Icon size={32} strokeWidth={1.5} style={{ display: 'block' }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: metric.valueSize,
                          fontWeight: 700,
                          color: colors.dark,
                          lineHeight: metric.valueLines.length > 1 ? 1.1 : 1,
                        }}
                      >
                        <StackedLines lines={metric.valueLines} />
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: colors.muted,
                          fontWeight: 400,
                          marginTop: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        <StackedLines lines={metric.labelLines} />
                      </div>
                    </div>
                  </div>
                  {index < metrics.length - 1 && (
                    <div style={{ width: 1, height: 48, background: colors.border, flexShrink: 0 }} />
                  )}
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '218px 1fr 268px',
              gap: 12,
              marginBottom: 18,
              alignItems: 'start',
            }}
          >
            <div>
              <SectionChip style={{ marginBottom: 14 }}>Unified Data Inputs</SectionChip>

              {unifiedInputs.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      marginBottom: index === unifiedInputs.length - 1 ? 0 : 14,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: item.iconBackground,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#fff',
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} style={{ display: 'block' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: colors.dark,
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: colors.muted,
                          fontWeight: 300,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                    <ArrowConnector />
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <SectionChip style={{ padding: '4px 14px' }}>Orchestration Hub</SectionChip>

              <div
                style={{
                  background: 'linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#0047AB 0%,#00B8D9 100%) border-box',
                  border: '2px solid transparent',
                  borderRadius: 20,
                  padding: '22px 28px 20px',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.dark,
                    lineHeight: 1.2,
                    marginBottom: 8,
                  }}
                >
                  Agentic
                  <br />
                  Orchestration Core
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.muted,
                    fontWeight: 300,
                    lineHeight: 1.65,
                    marginBottom: 20,
                    maxWidth: 340,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Reads your operational data, reasons over it, and acts through governed agents — with human-in-the-loop. No system is replaced.
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 58 }}>
                    <IconCircle
                      icon={Database}
                      size={46}
                      iconSize={20}
                      color={colors.blue}
                      background="rgba(0,71,171,0.07)"
                      border={`2px solid ${colors.blue}`}
                    />
                    <div style={{ fontSize: 10, color: colors.muted, fontWeight: 400, textAlign: 'center', lineHeight: 1.2 }}>
                      Read & Reason
                    </div>
                  </div>
                  <div style={{ paddingTop: 18 }}>
                    <FlowConnector />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <IconCircle
                      icon={Sparkles}
                      size={62}
                      iconSize={28}
                      color="#fff"
                      background={colors.blue}
                    />
                  </div>
                  <div style={{ paddingTop: 18 }}>
                    <FlowConnector />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 86 }}>
                    <IconCircle
                      icon={Workflow}
                      size={46}
                      iconSize={20}
                      color={colors.blue}
                      background="rgba(0,71,171,0.07)"
                      border={`2px solid ${colors.blue}`}
                    />
                    <div style={{ fontSize: 10, color: colors.muted, fontWeight: 400, textAlign: 'center', lineHeight: 1.2 }}>
                      Act & Resolve
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    borderTop: `1.5px solid ${colors.border}`,
                    paddingTop: 14,
                  }}
                >
                  {[
                    { icon: Bot, label: ['AI Agents'] },
                    { icon: Gauge, label: ['Evals'] },
                    { icon: Shield, label: ['Guardrails'] },
                    { icon: ShieldCheck, label: ['Governance'] },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label.join('-')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ color: colors.blue, display: 'flex' }}>
                          <Icon size={18} strokeWidth={1.5} style={{ display: 'block' }} />
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: colors.softText,
                            fontWeight: 400,
                            textAlign: 'center',
                            lineHeight: 1.3,
                          }}
                        >
                          <StackedLines lines={item.label} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <SectionChip style={{ marginBottom: 14 }}>Intelligent Outcomes</SectionChip>

              {intelligentOutcomes.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                      marginBottom: index === intelligentOutcomes.length - 1 ? 0 : 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: 9, flexShrink: 0 }}>
                      <div style={{ ...connectorLineStyle, width: 10 }} />
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: '3.5px solid transparent',
                          borderBottom: '3.5px solid transparent',
                          borderLeft: `5px solid ${colors.blue}`,
                        }}
                      />
                    </div>
                    <IconCircle
                      icon={Icon}
                      size={34}
                      iconSize={15}
                      color={colors.blue}
                      background="rgba(0,71,171,0.07)"
                      border={`1.5px solid ${colors.blue}`}
                    />
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: colors.dark, lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: colors.muted, fontWeight: 300, lineHeight: 1.4 }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div
              style={{
                textAlign: 'center',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: colors.blue,
                marginBottom: 12,
              }}
            >
              Built for Enterprise Scale
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                border: `1.5px solid ${colors.border}`,
                borderRadius: 12,
                padding: '16px 40px',
              }}
            >
              {enterpriseScaleItems.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.titleLines.join('-')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: item.filled ? colors.blue : 'rgba(0,71,171,0.1)',
                        border: item.filled ? undefined : `1.5px solid ${colors.softBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.filled ? '#fff' : colors.blue,
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} style={{ display: 'block' }} />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: colors.dark,
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}
                    >
                      <StackedLines lines={item.titleLines} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-layout" style={{ background: '#fff', padding: '16px 12px 14px', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.dark,
              margin: '0 0 6px',
              letterSpacing: '-0.4px',
              lineHeight: 1.15,
            }}
          >
            Intelligent Commerce Architecture
          </h2>
          <p style={{ fontSize: 11.5, color: colors.muted, margin: 0, fontWeight: 300, lineHeight: 1.45 }}>
            Higher shelf availability, lower store cost, and a winning digital shelf — governed AI across your existing stack.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            border: `1.5px solid ${colors.border}`,
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 12,
          }}
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={metric.valueLines.join('-')}
                style={{
                  padding: '10px 9px',
                  borderRight: index % 2 === 0 ? `1px solid ${colors.border}` : undefined,
                  borderBottom: index < 2 ? `1px solid ${colors.border}` : undefined,
                }}
              >
                <div style={{ color: colors.blue, display: 'flex', marginBottom: 7 }}>
                  <Icon size={20} strokeWidth={1.5} style={{ display: 'block' }} />
                </div>
                <div
                  style={{
                    fontSize: metric.valueSize === 20 ? 15 : 18,
                    fontWeight: 700,
                    color: colors.dark,
                    lineHeight: 1.1,
                    marginBottom: 3,
                  }}
                >
                  <StackedLines lines={metric.valueLines} />
                </div>
                <div style={{ fontSize: 9.5, color: colors.muted, fontWeight: 400, lineHeight: 1.25 }}>
                  <StackedLines lines={metric.labelLines} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: '100%' }}>
            <SectionChip style={{ marginBottom: 8 }}>Unified Data Inputs</SectionChip>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {unifiedInputs.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    style={{
                      border: `1.5px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 10,
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: item.iconBackground,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} strokeWidth={1.5} style={{ display: 'block' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 600, color: colors.dark, lineHeight: 1.25, marginBottom: 2 }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 9, color: colors.muted, fontWeight: 300, lineHeight: 1.3 }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <VerticalConnector lineHeight={10} />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <SectionChip style={{ padding: '4px 12px' }}>Orchestration Hub</SectionChip>

            <div
              style={{
                width: '100%',
                background: 'linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#0047AB 0%,#00B8D9 100%) border-box',
                border: '2px solid transparent',
                borderRadius: 18,
                padding: '14px 12px 12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: colors.dark, lineHeight: 1.15, marginBottom: 6 }}>
                Agentic
                <br />
                Orchestration Core
              </div>
              <div style={{ fontSize: 10, color: colors.muted, fontWeight: 300, lineHeight: 1.4, marginBottom: 12 }}>
                Reads your operational data, reasons over it, and acts through governed agents — with human-in-the-loop. No system is replaced.
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <IconCircle
                    icon={Database}
                    size={34}
                    iconSize={15}
                    color={colors.blue}
                    background="rgba(0,71,171,0.07)"
                    border={`1.5px solid ${colors.blue}`}
                  />
                  <div style={{ fontSize: 8.5, color: colors.muted, fontWeight: 400, textAlign: 'center', lineHeight: 1.2 }}>
                    Read & Reason
                  </div>
                </div>
                <div style={{ paddingTop: 12 }}>
                  <FlowConnector />
                </div>
                <div style={{ paddingTop: 2 }}>
                  <IconCircle icon={Sparkles} size={46} iconSize={20} color="#fff" background={colors.blue} />
                </div>
                <div style={{ paddingTop: 12 }}>
                  <FlowConnector />
                </div>
                <div style={{ width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <IconCircle
                    icon={Workflow}
                    size={34}
                    iconSize={15}
                    color={colors.blue}
                    background="rgba(0,71,171,0.07)"
                    border={`1.5px solid ${colors.blue}`}
                  />
                  <div style={{ fontSize: 8.5, color: colors.muted, fontWeight: 400, textAlign: 'center', lineHeight: 1.2 }}>
                    Act & Resolve
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  borderTop: `1.5px solid ${colors.border}`,
                  paddingTop: 10,
                }}
              >
                {[
                  { icon: Bot, label: ['AI Agents'] },
                  { icon: Gauge, label: ['Evals'] },
                  { icon: Shield, label: ['Guardrails'] },
                  { icon: ShieldCheck, label: ['Governance'] },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label.join('-')}
                      style={{
                        border: `1px solid ${colors.border}`,
                        borderRadius: 10,
                        padding: '8px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <div style={{ color: colors.blue, display: 'flex' }}>
                        <Icon size={16} strokeWidth={1.5} style={{ display: 'block' }} />
                      </div>
                      <div style={{ fontSize: 9, color: colors.softText, fontWeight: 400, textAlign: 'center', lineHeight: 1.2 }}>
                        <StackedLines lines={item.label} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <VerticalConnector lineHeight={10} />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionChip style={{ marginBottom: 8 }}>Intelligent Outcomes</SectionChip>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                width: '100%',
              }}
            >
              {intelligentOutcomes.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    style={{
                      border: `1.5px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 10,
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, textAlign: 'center' }}>
                      <IconCircle
                        icon={Icon}
                        size={30}
                        iconSize={13}
                        color={colors.blue}
                        background="rgba(0,71,171,0.07)"
                        border={`1px solid ${colors.blue}`}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 600, color: colors.dark, lineHeight: 1.2, marginBottom: 2 }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 9, color: colors.muted, fontWeight: 300, lineHeight: 1.25 }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: colors.blue,
              marginBottom: 8,
            }}
          >
            Built for Enterprise Scale
          </div>
          <div
            style={{
              border: `1.5px solid ${colors.border}`,
              borderRadius: 12,
              padding: '10px 8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 8,
              }}
            >
              {enterpriseScaleItems.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.titleLines.join('-')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 5,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: item.filled ? colors.blue : 'rgba(0,71,171,0.1)',
                        border: item.filled ? undefined : `1.5px solid ${colors.softBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.filled ? '#fff' : colors.blue,
                      }}
                    >
                      <Icon size={15} strokeWidth={1.5} style={{ display: 'block' }} />
                    </div>
                    <div style={{ fontSize: 8.5, fontWeight: 500, color: colors.dark, lineHeight: 1.15 }}>
                      <StackedLines lines={item.titleLines} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .desktop-layout {
          display: block;
        }

        .mobile-layout {
          display: none;
        }

        @media (max-width: 767px) {
          .desktop-layout {
            display: none;
          }

          .mobile-layout {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}
