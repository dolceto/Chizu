import { v4 as uuidv4 } from 'uuid'
import { db } from './index'
import type { Record, RecordInput, Country } from '@/types'

export async function getAllRecords(): Promise<Record[]> {
  return db.records.toArray()
}

export async function getRecordsByCountry(country: Country): Promise<Record[]> {
  return db.records.where('country').equals(country).toArray()
}

export async function getRecordById(id: string): Promise<Record | undefined> {
  return db.records.get(id)
}

export async function getRecordsBySido(sido: string, country?: Country): Promise<Record[]> {
  const query = db.records.where('sido').equals(sido)
  if (country) {
    return query.and((r) => r.country === country).toArray()
  }
  return query.toArray()
}

export async function getRecordsBySigungu(
  sido: string,
  sigungu: string,
  country?: Country
): Promise<Record[]> {
  const query = db.records.where('sido').equals(sido).and((r) => r.sigungu === sigungu)
  if (country) {
    return query.and((r) => r.country === country).toArray()
  }
  return query.toArray()
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

export async function getRecordCountBySido(sido: string, country?: Country): Promise<number> {
  const query = db.records.where('sido').equals(sido)
  if (country) {
    return query.and((r) => r.country === country).count()
  }
  return query.count()
}

export async function getRecordCountBySigungu(
  sido: string,
  sigungu: string,
  country?: Country
): Promise<number> {
  const query = db.records.where('sido').equals(sido).and((r) => r.sigungu === sigungu)
  if (country) {
    return query.and((r) => r.country === country).count()
  }
  return query.count()
}

export async function getRecordCountByAllSido(country?: Country): Promise<Map<string, number>> {
  let records: Record[]
  if (country) {
    records = await db.records.where('country').equals(country).toArray()
  } else {
    records = await db.records.toArray()
  }
  const counts = new Map<string, number>()

  for (const record of records) {
    const current = counts.get(record.sido) ?? 0
    counts.set(record.sido, current + 1)
  }

  return counts
}

export async function getRecordCountByAllSigungu(
  sido: string,
  country?: Country
): Promise<Map<string, number>> {
  let query = db.records.where('sido').equals(sido)
  if (country) {
    query = query.and((r) => r.country === country) as typeof query
  }
  const records = await query.toArray()
  const counts = new Map<string, number>()

  for (const record of records) {
    const current = counts.get(record.sigungu) ?? 0
    counts.set(record.sigungu, current + 1)
  }

  return counts
}
