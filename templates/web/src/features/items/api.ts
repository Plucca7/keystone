import { apiFetch } from '@/lib/fetch'

/**
 * Item entity as the client sees it -- the data-access boundary already
 * mapped snake_case database columns (see db/migrations/) to camelCase, so
 * everything above this file only ever deals with camelCase.
 */
export interface Item {
  id: string
  name: string
  updatedAt: string
  deletedAt: string | null
}

const ITEMS_ENDPOINT = '/api/v1/items'

/**
 * Fetches the item list. Thin wrapper around apiFetch -- all the Result
 * handling (network error vs. RFC 9457 Problem Detail vs. success) is
 * already implemented there; this function only knows the URL and the shape.
 */
export function fetchItems() {
  return apiFetch<Item[]>(ITEMS_ENDPOINT)
}

/**
 * Renames an item. PATCH (not PUT) because this endpoint updates a single
 * field, not the whole resource.
 */
export function renameItem(id: string, name: string) {
  return apiFetch<Item>(`${ITEMS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}
