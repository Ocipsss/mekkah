import { db } from './schema';

export const transactionRepo = {
  // UPGRADE: Simpan transaksi lengkap (Header + Items)
  async save(cart, headerData) {
    return await db.transaction('rw', [db.transactions, db.transactionItems], async () => {
      // 1. Simpan Header Transaksi
      const transactionId = await db.transactions.add({
        total: headerData.total,
        payMethod: headerData.payMethod,
        userId: headerData.userId || 'guest',
        syncStatus: 'pending',
        timestamp: Date.now()
      });

      // 2. Simpan Semua Item Barang yang ada di keranjang
      const itemsToSave = cart.map(item => ({
        transactionId: transactionId, // Hubungkan ke ID header di atas
        category: item.category,
        productName: item.name,
        price: item.price,
        qty: item.qty,
        unit: item.unit
      }));

      await db.transactionItems.bulkAdd(itemsToSave);
      
      return transactionId;
    });
  },

  // Fungsi getPending tetap ada (untuk SyncEngine)
  async getPending() {
    return await db.transactions.where('syncStatus').equals('pending').toArray();
  },

  // Fungsi markAsSynced tetap ada
  async markAsSynced(id) {
    return await db.transactions.update(id, { syncStatus: 'synced' });
  },

  // Fungsi getToday tetap ada
  async getToday() {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    return await db.transactions
      .where('timestamp')
      .above(startOfDay)
      .reverse()
      .toArray();
  },

  // Fungsi Pruning tetap ada
  async pruneOldData() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return await db.transactions
      .where('timestamp')
      .below(thirtyDaysAgo)
      .and(item => item.syncStatus === 'synced')
      .delete();
  }
};