import { describe, expect, it } from 'vitest'
import worker from '../worker'

const fetchFromWorker = (url: string) =>
  worker.fetch(new Request(url), {} as Parameters<typeof worker.fetch>[1])

describe('legacy blog redirects', () => {
  it('redirects the blog index to Newtuple', async () => {
    const response = await fetchFromWorker('https://demo.example/blog?source=demo')

    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe('https://www.newtuple.com/blog?source=demo')
  })

  it('redirects blog posts to the matching Newtuple post', async () => {
    const response = await fetchFromWorker(
      'https://demo.example/post/newtuple-openai-select-partner',
    )

    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe(
      'https://www.newtuple.com/post/newtuple-openai-select-partner',
    )
  })

  it('redirects legacy blog media to the matching Newtuple file', async () => {
    const response = await fetchFromWorker(
      'https://demo.example/blog/native-ai-apps/image1-native-ai-apps-hero-collage.png',
    )

    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe(
      'https://www.newtuple.com/blog/native-ai-apps/image1-native-ai-apps-hero-collage.png',
    )
  })
})
