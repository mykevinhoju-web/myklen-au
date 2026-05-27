import { loadJson, saveJson } from './json-store'
import { normalizeContactInquiries } from './contact-inquiries-normalize'
import type { ContactInquiry } from './types'

const FILE = 'contact-inquiries.json'

export async function loadContactInquiries() {
  const raw = await loadJson<unknown>(FILE)
  return normalizeContactInquiries(raw)
}

export async function saveContactInquiries(inquiries: ContactInquiry[]) {
  await saveJson(FILE, inquiries)
}

