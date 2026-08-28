import { NextRequest } from 'next/server'
import { handleContactSubmitRequest } from '@/lib/server/http/submitHandlers'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  return handleContactSubmitRequest(req)
}
