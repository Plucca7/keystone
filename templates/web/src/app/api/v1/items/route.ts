import { NextResponse } from 'next/server'

import { listItems } from './store'

/**
 * Worked-example endpoint backing src/features/items/use-items.ts. Data
 * lives in an in-memory store (./store.ts) on purpose -- this route exists
 * to make the React Query registry example genuinely runnable end to end,
 * not to model a production items API. A real project replaces the store
 * with a call to its data-access layer against db/migrations/'s `items`
 * table and keeps the route contract (GET list / PATCH by id) unchanged.
 */
export async function GET() {
  return NextResponse.json(listItems())
}
