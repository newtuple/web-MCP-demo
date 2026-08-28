import { NextRequest } from 'next/server'
import { handleCareersSubmitRequest } from '@/lib/server/http/submitHandlers'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  return handleCareersSubmitRequest(req)
}
