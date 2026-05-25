import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { usesRemoteDataStore } from '@/lib/json-store'

/** Quick check: is production wired to Blob? (admin only) */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    vercel: Boolean(process.env.VERCEL),
    remoteStore: usesRemoteDataStore(),
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID?.trim()),
  })
}
