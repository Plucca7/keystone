import type { Item } from '@/features/items/api'

/**
 * In-memory backing store for the worked-example items route. Module-level
 * state (not a database) is a deliberate simplification -- see route.ts for
 * why. It resets on every server restart, which is fine for a template
 * example and would NOT be fine for real data.
 */
let items: Item[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'First item',
    updatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
    deletedAt: null,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Second item',
    updatedAt: new Date('2026-01-02T00:00:00.000Z').toISOString(),
    deletedAt: null,
  },
]

export function listItems(): Item[] {
  return items
}

/** Returns the updated item, or null when no item matches the given id. */
export function renameItemById(id: string, name: string): Item | null {
  let updated: Item | null = null
  items = items.map((item) => {
    if (item.id !== id) return item
    updated = { ...item, name, updatedAt: new Date().toISOString() }
    return updated
  })
  return updated
}
