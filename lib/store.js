import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Requests are saved in data/requests.json. Simple and fine for one server.
// For hosting on Vercel (read-only disk) swap these functions to a database.
const FILE = path.join(process.cwd(), 'data', 'requests.json');
export const STATUSES = ['New', 'In progress', 'Completed', 'Cancelled'];

let queue = Promise.resolve();
const locked = (fn) => {
  const run = queue.then(fn);
  queue = run.catch(() => {});
  return run;
};

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeAll(list) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(list, null, 2));
  await fs.rename(tmp, FILE);
}

export async function listRequests() {
  const list = await readAll();
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getRequest(id) {
  return (await readAll()).find((r) => r.id === id) || null;
}

export function createRequest(data) {
  return locked(async () => {
    const list = await readAll();
    const number = list.length ? Math.max(...list.map((r) => r.number)) + 1 : 1;
    const rec = {
      id: crypto.randomUUID(),
      number,
      ref: `EDL-${String(number).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'New',
      notes: '',
      ...data,
    };
    list.push(rec);
    await writeAll(list);
    return rec;
  });
}

export function updateRequest(id, patch) {
  return locked(async () => {
    const list = await readAll();
    const i = list.findIndex((r) => r.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...patch };
    await writeAll(list);
    return list[i];
  });
}

export function deleteRequest(id) {
  return locked(async () => {
    const list = await readAll();
    await writeAll(list.filter((r) => r.id !== id));
  });
}
