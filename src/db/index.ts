import Dexie, { type EntityTable } from 'dexie'
import type { Record } from '@/types'

const db = new Dexie('ChizuDB') as Dexie & {
  records: EntityTable<Record, 'id'>
}

db.version(1).stores({
  records: 'id, sido, sigungu, category, visitedAt, createdAt',
})

export { db }
