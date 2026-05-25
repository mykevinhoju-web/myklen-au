import { loadJson, saveJson } from './json-store'
import type { StarterPackage } from './types'

const FILE = 'packages.json'

export async function loadPackages() {
  return loadJson<StarterPackage[]>(FILE)
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
