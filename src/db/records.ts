import { v4 as uuidv4 } from 'uuid'
import { db } from './index'
import type { Record, RecordInput } from '@/types'

export async function getAllRecords(): Promise<Record[]> {
  return db.records.toArray()
}

export async function getRecordById(id: string): Promise<Record | undefined> {
  return db.records.get(id)
}

export async function getRecordsBySido(sido: string): Promise<Record[]> {
  return db.records.where('sido').equals(sido).toArray()
}

export async function getRecordsBySigungu(sido: string, sigungu: string): Promise<Record[]> {
  return db.records.where('sido').equals(sido).and((r) => r.sigungu === sigungu).toArray()
}

export async function createRecord(input: RecordInput): Promise<Record> {
  const now = new Date().toISOString()
  const record: Record = {
    ...input,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }

  await db.records.add(record)
  return record
}

export async function updateRecord(id: string, updates: Partial<RecordInput>): Promise<Record> {
  const existing = await db.records.get(id)
  if (!existing) {
    throw new Error(`Record with id ${id} not found`)
  }

  const updated: Record = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await db.records.put(updated)
  return updated
}

export async function deleteRecord(id: string): Promise<void> {
  await db.records.delete(id)
}

export async function getRecordCountBySido(sido: string): Promise<number> {
  return db.records.where('sido').equals(sido).count()
}

export async function getRecordCountBySigungu(sido: string, sigungu: string): Promise<number> {
  return db.records.where('sido').equals(sido).and((r) => r.sigungu === sigungu).count()
}

export async function getRecordCountByAllSido(): Promise<Map<string, number>> {
  const records = await db.records.toArray()
  const counts = new Map<string, number>()

  for (const record of records) {
    const current = counts.get(record.sido) ?? 0
    counts.set(record.sido, current + 1)
  }

  return counts
}

export async function getRecordCountByAllSigungu(sido: string): Promise<Map<string, number>> {
  const records = await db.records.where('sido').equals(sido).toArray()
  const counts = new Map<string, number>()

  for (const record of records) {
    const current = counts.get(record.sigungu) ?? 0
    counts.set(record.sigungu, current + 1)
  }

  return counts
}
