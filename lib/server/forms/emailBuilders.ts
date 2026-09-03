import { CareersLead, ContactLead } from './types'

const NA = 'N/A'

function printable(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : NA
}

export function buildContactLeadEmail(lead: ContactLead): { subject: string; text: string } {
  const lines = [
    'New Contact Lead',
    '',
    `Name: ${printable(lead.name)}`,
    `Email: ${printable(lead.email)}`,
    `Phone: ${printable(lead.phone)}`,
    `Intent type: ${printable(lead.intentType)}`,
    `Intent: ${printable(lead.intent)}`,
    `Regarding: ${printable(lead.regarding)}`,
    `Resume link: ${printable(lead.resumeLink)}`,
    `Message: ${printable(lead.message)}`,
    `Consent: ${printable(lead.consent)}`,
  ]

  if (lead.transcript) {
    lines.push('', '--- Transcript ---', lead.transcript)
  }

  return {
    subject: lead.regarding
      ? `New contact lead: ${lead.name} - regarding ${lead.regarding}`
      : `New contact lead: ${lead.name}`,
    text: lines.join('\n'),
  }
}

export function buildCareersLeadEmail(lead: CareersLead): { subject: string; text: string } {
  const lines = [
    'New Careers Application',
    '',
    `Name: ${printable(lead.name)}`,
    `Email: ${printable(lead.email)}`,
    `Role: ${printable(lead.role)}`,
    `Level: ${printable(lead.level)}`,
    `Employment type: ${printable(lead.employmentType)}`,
    `Location: ${printable(lead.location)}`,
    `Resume link: ${printable(lead.resumeLink)}`,
    '',
    'Message:',
    printable(lead.message),
    '',
    `Consent: ${printable(lead.consent)}`,
  ]

  return {
    subject: `New careers application: ${lead.name} - ${lead.role}`,
    text: lines.join('\n'),
  }
}
