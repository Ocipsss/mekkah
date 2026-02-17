import Dexie from 'dexie';

export const db = new Dexie('MekkahDB');

// ++id: auto-increment
// Indexing dilakukan agar pencarian data (History) tetap cepat
db.version(1).stores({
  transactions: '++id, timestamp, category, productName, syncStatus, userId',
  users: 'uid, name, role'
});

export default db;