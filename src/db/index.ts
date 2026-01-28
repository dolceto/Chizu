import Dexie, { type EntityTable } from 'dexie'
import type { Record } from '@/types'

const db = new Dexie('ChizuDB') as Dexie & {
  records: EntityTable<Record, 'id'>
}

db.version(1).stores({
  records: 'id, sido, sigungu, category, visitedAt, createdAt',
})

db.version(2)
  .stores({
    records: 'id, country, sido, sigungu, category, visitedAt, createdAt',
  })
  .upgrade((tx) => {
    return tx
      .table('records')
      .toCollection()
      .modify((record) => {
        if (!record.country) {
          record.country = 'korea'
        }
      })
  })

db.version(3)
  .stores({
    records: 'id, country, sido, sigungu, category, visitType, visitedAt, createdAt',
  })
  .upgrade((tx) => {
    return tx
      .table('records')
      .toCollection()
      .modify((record) => {
        if (!record.visitType) {
          record.visitType = 'visit'
        }
      })
  })

export { db }
