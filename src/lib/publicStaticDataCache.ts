type CacheRecord = Readonly<{
  key: string
  schemaVersion: number
  savedAt: number
  value: unknown
}>

const databaseName = 'pomi-public-static-data'
const storeName = 'static-data'
const schemaVersion = 1

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

export type PublicStaticDataCache = Readonly<{
  read: <T>(key: string) => Promise<T | undefined>
  write: <T>(key: string, value: T) => Promise<void>
  remove: (key: string) => Promise<void>
  prune: (prefix: string, limit: number) => Promise<void>
}>

export function createPublicStaticDataCache(): PublicStaticDataCache {
  const memory = new Map<string, CacheRecord>()
  let database: Promise<IDBDatabase | undefined> | undefined

  async function openDatabase() {
    if (database) return database
    database = new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        resolve(undefined)
        return
      }
      try {
        const request = indexedDB.open(databaseName, schemaVersion)
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(storeName))
            request.result.createObjectStore(storeName, { keyPath: 'key' })
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => resolve(undefined)
        request.onblocked = () => resolve(undefined)
      } catch {
        resolve(undefined)
      }
    })
    return database
  }

  async function read<T>(key: string): Promise<T | undefined> {
    const db = await openDatabase()
    try {
      const record = db
        ? await requestResult<CacheRecord | undefined>(
            db
              .transaction(storeName, 'readonly')
              .objectStore(storeName)
              .get(key),
          )
        : memory.get(key)
      if (!record || record.schemaVersion !== schemaVersion) {
        if (record) await remove(key)
        return undefined
      }
      return record.value as T
    } catch {
      return memory.get(key)?.value as T | undefined
    }
  }

  async function write<T>(key: string, value: T) {
    const record: CacheRecord = {
      key,
      schemaVersion,
      savedAt: Date.now(),
      value,
    }
    memory.set(key, record)
    const db = await openDatabase()
    if (!db) return
    try {
      const transaction = db.transaction(storeName, 'readwrite')
      transaction.objectStore(storeName).put(record)
      await transactionDone(transaction)
    } catch {}
  }

  async function remove(key: string) {
    memory.delete(key)
    const db = await openDatabase()
    if (!db) return
    try {
      const transaction = db.transaction(storeName, 'readwrite')
      transaction.objectStore(storeName).delete(key)
      await transactionDone(transaction)
    } catch {}
  }

  async function prune(prefix: string, limit: number) {
    const db = await openDatabase()
    const records = db
      ? await new Promise<Array<CacheRecord>>((resolve) => {
          try {
            const transaction = db.transaction(storeName, 'readonly')
            const request = transaction.objectStore(storeName).getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => resolve([])
          } catch {
            resolve([])
          }
        })
      : [...memory.values()]
    const expired = records
      .filter((record) => record.key.startsWith(prefix))
      .sort((left, right) => right.savedAt - left.savedAt)
      .slice(limit)
    await Promise.all(expired.map((record) => remove(record.key)))
  }

  return { read, write, remove, prune }
}

export const publicStaticDataCache = createPublicStaticDataCache()
