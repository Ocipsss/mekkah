import { db } from './schema';

export const transactionRepo = {
  // Simpan transaksi baru ke lokal
  async save(transactionData) {
    return await db.transactions.add({
      ...transactionData,
      syncStatus: 'pending',
      timestamp: Date.now()
    });
  },

  // Ambil semua transaksi yang belum tersinkron (untuk SyncEngine)
  async getPending() {
    return await db.transactions.where('syncStatus').equals('pending').toArray();
  },

  // Update status setelah sukses kirim ke Firebase
  async markAsSynced(id) {
    return await db.transactions.update(id, { syncStatus: 'synced' });
  },

  // Ambil history hari ini
  async getToday() {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    return await db.transactions
      .where('timestamp')
      .above(startOfDay)
      .reverse()
      .toArray();
  },

  // Fungsi untuk Data Pruning (Hapus yang sudah sync & > 30 hari)
  async pruneOldData() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return await db.transactions
      .where('timestamp')
      .below(thirtyDaysAgo)
      .and(item => item.syncStatus === 'synced')
      .delete();
  }
};