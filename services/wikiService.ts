import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface WikiPage {
  id: string; // The path/filename, e.g., "concepts/llm-wiki.md" or "index.md"
  title: string;
  category: 'index' | 'log' | 'entity' | 'concept' | 'summary' | 'analysis' | 'uncategorized';
  content: string; // Markdown content
  created_at: string;
  updated_at: string;
  source_count: number; // Number of vault sources referenced
  tags: string[];
}

interface WikiDB extends DBSchema {
  pages: {
    key: string; // id
    value: WikiPage;
    indexes: {
      'by-category': string;
      'by-updated': string;
    };
  };
}

const DB_NAME = 'ai-knowledge-wiki';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WikiDB>> | null = null;

export const initWikiDb = async () => {
  if (!dbPromise) {
    dbPromise = openDB<WikiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pages')) {
          const store = db.createObjectStore('pages', { keyPath: 'id' });
          store.createIndex('by-category', 'category', { unique: false });
          store.createIndex('by-updated', 'updated_at', { unique: false });
        }
      },
    });
  }
  return dbPromise;
};

// --- Operations ---

export async function getWikiPage(id: string): Promise<WikiPage | undefined> {
  const db = await initWikiDb();
  return db.get('pages', id);
}

export async function putWikiPage(page: WikiPage): Promise<void> {
  const db = await initWikiDb();
  await db.put('pages', page);
}

export async function getAllWikiPages(): Promise<WikiPage[]> {
  const db = await initWikiDb();
  return db.getAll('pages');
}

export async function getWikiPagesByCategory(category: WikiPage['category']): Promise<WikiPage[]> {
  const db = await initWikiDb();
  return db.getAllFromIndex('pages', 'by-category', category);
}

export async function deleteWikiPage(id: string): Promise<void> {
  const db = await initWikiDb();
  await db.delete('pages', id);
}

export async function searchWikiPages(query: string): Promise<WikiPage[]> {
  const all = await getAllWikiPages();
  const q = query.toLowerCase();
  return all.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
}

// --- Initializing special files ---

export async function initializeWikiDefaults() {
  const indexPage = await getWikiPage('index.md');
  if (!indexPage) {
    await putWikiPage({
      id: 'index.md',
      title: 'Wiki Index',
      category: 'index',
      content: '# Wiki Index\n\nA catalog of everything in the wiki.\n\n## Concepts\n\n## Entities\n\n## Summaries',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_count: 0,
      tags: ['system']
    });
  }

  const logPage = await getWikiPage('log.md');
  if (!logPage) {
    await putWikiPage({
      id: 'log.md',
      title: 'Wiki Operation Log',
      category: 'log',
      content: '# Wiki Log\n\nChronological record of ingestions, queries, and maintenance.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_count: 0,
      tags: ['system']
    });
  }
}

export async function appendToLog(entry: string) {
  const logPage = await getWikiPage('log.md');
  if (logPage) {
    const timestamp = new Date().toISOString().split('T')[0];
    const newContent = logPage.content + `\n\n## [${timestamp}] ${entry}`;
    await putWikiPage({
      ...logPage,
      content: newContent,
      updated_at: new Date().toISOString()
    });
  }
}
