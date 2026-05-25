import { loadJson, saveJson } from './json-store'
import type { ClientUser } from './types'

const FILE = 'client-users.json'

export async function loadClientUsers() {
  return loadJson<ClientUser[]>(FILE)
}

export async function saveClientUsers(users: ClientUser[]) {
  await saveJson(FILE, users)
}

export async function findClientUserByUsername(username: string) {
  const normalized = username.trim().toLowerCase()
  const users = await loadClientUsers()
  return users.find((u) => u.username === normalized) ?? null
}

export async function findClientUserById(id: string) {
  const users = await loadClientUsers()
  return users.find((u) => u.id === id) ?? null
}
