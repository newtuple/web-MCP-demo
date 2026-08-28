export type NewsletterProvider = 'mailchimp' | 'custom' | 'none'

export type NewsletterConfig = {
  provider: NewsletterProvider
  action: string
  method?: 'post' | 'get'
  emailFieldName?: string
  hiddenFields?: Record<string, string>
  submitLabel?: string
  privacyText?: string
}

export type BlogConfig = {
  newsletter: NewsletterConfig
}

export const BLOG_CONFIG: BlogConfig = {
  newsletter: {
    provider: 'mailchimp',
    action: 'https://EXAMPLE.usX.list-manage.com/subscribe/post?u=REPLACE&id=REPLACE',
    method: 'post',
    emailFieldName: 'EMAIL',
    hiddenFields: {
      // Mailchimp requires these hidden inputs for anti-bot and list mapping.
      u: 'REPLACE',
      id: 'REPLACE',
    },
    submitLabel: 'Subscribe',
    privacyText: 'By subscribing you agree to receive updates from Newtuple. You can unsubscribe anytime.',
  },
}
