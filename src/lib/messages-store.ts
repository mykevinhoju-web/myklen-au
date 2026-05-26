import { loadJson, saveJson } from './json-store'
import { normalizeMessages } from './messages-normalize'
import type { ClientMessage } from './types'

const FILE = 'messages.json'

export async function loadMessages() {
  const raw = await loadJson<unknown>(FILE)
  return normalizeMessages(raw)
}

export async function saveMessages(messages: ClientMessage[]) {
  await saveJson(FILE, messages)
}

export async function listMessagesForUser(userId: string) {
  const all = await loadMessages()
  return all
    .filter((m) => m.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
