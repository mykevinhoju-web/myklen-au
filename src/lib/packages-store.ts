import { readFile } from 'fs/promises'
import { dataFilePath, saveJson } from './json-store'
import type { StarterPackage } from './types'

const FILE = 'packages.json'

/** Pricing and copy live in git (`data/packages.json`), not Vercel Blob. */
export async function loadPackages() {
  const raw = await readFile(dataFilePath(FILE), 'utf-8')
  return JSON.parse(raw) as StarterPackage[]
}

export async function savePackages(packages: StarterPackage[]) {
  await saveJson(FILE, packages)
}

export async function getActivePackages() {
  const all = await loadPackages()
  return all.filter((p) => p.active)
}

export async function getPackageBySlug(slug: string) {
  const all = await loadPackages()
  return all.find((p) => p.slug === slug && p.active) ?? null
}
