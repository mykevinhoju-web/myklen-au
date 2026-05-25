import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export function dataFilePath(name: string) {
  return path.join(process.cwd(), 'data', name)
}

export async function loadJson<T>(filename: string): Promise<T> {
  const raw = await readFile(dataFilePath(filename), 'utf-8')
  return JSON.parse(raw) as T
}

export async function saveJson<T>(
  filename: string,
  data: T,
  options?: { compact?: boolean },
) {
  const text = options?.compact ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  await writeFile(dataFilePath(filename), text, 'utf-8')
}
