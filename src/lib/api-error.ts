import { NextResponse } from 'next/server'

export function storageErrorResponse(error: unknown) {
  console.error('[storage]', error)
  const message =
    error instanceof Error ? error.message : 'Could not save data. Check Vercel Blob settings.'
  return NextResponse.json({ error: message }, { status: 500 })
}
