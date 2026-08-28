export type IntentType = 'job' | 'services'

export type ContactLead = {
  name: string
  email: string
  phone: string
  intentType: IntentType
  intent: string
  resumeLink: string
  message: string
  consent: boolean
  transcript: string
}

export type CareersLead = {
  name: string
  email: string
  role: string
  location: string
  level: string
  employmentType: string
  resumeLink: string
  message: string
  consent: boolean
}

export type ValidationResult<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: string
    }
