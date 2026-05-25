import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { get, put } from '@vercel/blob'

const BLOB_PREFIX = 'myklen-data'

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined
}

/** True when production should read/write Vercel Blob (not local `data/`). */
export function usesRemoteDataStore() {
  if (blobToken()) return true
  if (process.env.BLOB_STORE_ID?.trim() && process.env.VERCEL) return true
  return false
}

function assertCanPersist() {
  if (process.env.VERCEL && !usesRemoteDataStore()) {
    throw new Error(
      'Blob storage is not connected. In Vercel: Storage → Blob → connect to this project, then Redeploy.',
    )
  }
}

export function dataFilePath(name: string) {
  return path.join(process.cwd(), 'data', name)
}

function blobPath(filename: string) {
  return `${BLOB_PREFIX}/${filename}`
}

async function readLocalSeed<T>(filename: string): Promise<T | null> {
  try {
    const raw = await readFile(dataFilePath(filename), 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, {
    access: 'private',
    useCache: false,
    token: blobToken(),
  })
  if (!result || result.statusCode !== 200 || !result.stream) {
    return null
  }
  const text = await new Response(result.stream).text()
  return JSON.parse(text) as T
}

async function loadFromBlob<T>(filename: string): Promise<T> {
  const pathname = blobPath(filename)
  const existing = await readBlobJson<T>(pathname)
  if (existing !== null) return existing

  const seed = await readLocalSeed<T>(filename)
  if (seed !== null) {
    await saveToBlob(filename, seed, { compact: true })
    return seed
  }

  throw new Error(
    `Data file missing: ${filename}. Add it under data/ in the repo or create it in admin.`,
  )
}

async function saveToBlob<T>(filename: string, data: T, options?: { compact?: boolean }) {
  const text = options?.compact ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  await put(blobPath(filename), text, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token: blobToken(),
  })
}

export async function loadJson<T>(filename: string): Promise<T> {
  if (usesRemoteDataStore()) {
    return loadFromBlob<T>(filename)
  }
  const raw = await readFile(dataFilePath(filename), 'utf-8')
  return JSON.parse(raw) as T
}

export async function saveJson<T>(
  filename: string,
  data: T,
  options?: { compact?: boolean },
) {
  assertCanPersist()
  if (usesRemoteDataStore()) {
    await saveToBlob(filename, data, options)
    return
  }
  const text = options?.compact ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  await writeFile(dataFilePath(filename), text, 'utf-8')
}
