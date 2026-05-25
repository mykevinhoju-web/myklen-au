import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { StarterPackage } from './types'

const FILE = path.join(process.cwd(), 'data', 'packages.json')

export async function loadPackages() {
  const raw = await readFile(FILE, 'utf8')
  return JSON.parse(raw) as StarterPackage[]
}

export async function savePackages(packages: StarterPackage[]) {
  await writeFile(FILE, JSON.stringify(packages, null, 2), 'utf8')
}

export async function getActivePackages() {
  const all = await loadPackages()
  return all.filter((p) => p.active)
}

export async function getPackageBySlug(slug: string) {
  const all = await loadPackages()
  return all.find((p) => p.slug === slug && p.active) ?? null
}
