import Dexie from 'dexie';

export const db = new Dexie('MekkahDB');

db.version(1).stores({
  // transactions: Header transaksi (Total, Bayar, Waktu)
  transactions: '++id, timestamp, total, payMethod, syncStatus, userId',
  
  // transactionItems: Detail barang-barang yang dibeli
  transactionItems: '++id, transactionId, category, productName, price, qty, unit',
  
  users: 'uid, name, role'
});

export default db;