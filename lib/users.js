import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Customer accounts live in data/users.json (passwords are salted + hashed with scrypt).
const FILE = path.join(process.cwd(), 'data', 'users.json');

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

const hash = (pw, salt) => crypto.scryptSync(pw, salt, 64);
const publicUser = ({ id, name, email, phone }) => ({ id, name, email, phone });

export function createUser({ name, email, phone, password }) {
  return locked(async () => {
    const list = await readAll();
    const mail = email.toLowerCase();
    if (list.some((u) => u.email === mail)) return { error: 'exists' };
    const salt = crypto.randomBytes(16).toString('hex');
    const user = {
      id: crypto.randomUUID(), name, email: mail, phone,
      salt, hash: hash(password, salt).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    list.push(user);
    await writeAll(list);
    return { user: publicUser(user) };
  });
}

export async function verifyUser(email, password) {
  const user = (await readAll()).find((u) => u.email === String(email).toLowerCase().trim());
  // Always do the hashing work so timing does not reveal whether the email exists.
  const salt = user?.salt || 'x'.repeat(32);
  const attempt = hash(String(password), salt);
  const stored = Buffer.from(user?.hash || '0'.repeat(128), 'hex');
  const ok = crypto.timingSafeEqual(attempt, stored);
  return ok && user ? publicUser(user) : null;
}

export async function getUserById(id) {
  const user = (await readAll()).find((u) => u.id === id);
  return user ? publicUser(user) : null;
}
