import { loadJson, saveJson } from './json-store'
import type { ClientMessage } from './types'

const FILE = 'messages.json'

export async function loadMessages() {
  return loadJson<ClientMessage[]>(FILE)
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
