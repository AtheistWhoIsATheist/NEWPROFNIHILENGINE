import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface SourceRecord {
  source_id: string; // src:{sha256}
  original_path: string;
  original_filename: string;
  extension: string;
  mime_guess: string;
  encoding: string;
  size_bytes: number;
  sha256: string;
  imported_at: string;
  modified_at_source: string;
  import_batch_id: string;
  status: 'imported' | 'skipped' | 'duplicate' | 'error' | 'quarantined';
  error: string | null;
  content: string; // The raw content
}

interface VaultDB extends DBSchema {
  sources: {
    key: string; // source_id
    value: SourceRecord;
    indexes: {
      'by-sha256': string;
      'by-path': string;
      'by-batch': string;
    };
  };
}

const DB_NAME = 'ai-knowledge-vault';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<VaultDB>> | null = null;

export const initDb = async () => {
  if (!dbPromise) {
    dbPromise = openDB<VaultDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sources')) {
          const store = db.createObjectStore('sources', { keyPath: 'source_id' });
          store.createIndex('by-sha256', 'sha256', { unique: false });
          store.createIndex('by-path', 'original_path', { unique: false });
          store.createIndex('by-batch', 'import_batch_id', { unique: false });
        }
      },
    });
  }
  return dbPromise;
};

export async function addSource(record: SourceRecord) {
  const db = await initDb();
  await db.put('sources', record);
}

export async function getSourceByHash(sha256: string): Promise<SourceRecord | undefined> {
  const db = await initDb();
  return db.getFromIndex('sources', 'by-sha256', sha256);
}

export async function getAllSources(): Promise<SourceRecord[]> {
  const db = await initDb();
  return db.getAll('sources');
}

export async function batchPutSources(records: SourceRecord[]) {
  const db = await initDb();
  const tx = db.transaction('sources', 'readwrite');
  await Promise.all(records.map(record => tx.store.put(record)));
  await tx.done;
}

export async function calculateSHA256(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
