import { db } from '../schema';

export const headerRepo = {
  // Ambil data header mentah berdasarkan ID
  async getById(id) {
    return await db.transactions.get(id);
  },

  // Tambah header baru
  async add(headerData) {
    return await db.transactions.add({
      total: headerData.total,
      payMethod: headerData.payMethod,
      userId: headerData.userId || 'guest',
      syncStatus: 'pending',
      timestamp: Date.now()
    });
  },

  // Update data header
  async update(id, headerData) {
    return await db.transactions.update(id, {
      total: headerData.total,
      payMethod: headerData.payMethod,
      syncStatus: 'pending', // Reset ke pending agar SyncEngine tahu ada perubahan
      updatedAt: Date.now()
    });
  },

  // Hapus header
  async delete(id) {
    return await db.transactions.delete(id);
  },

  // Ambil semua header untuk hari ini
  async getTodayHeaders() {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    return await db.transactions
      .where('timestamp')
      .above(startOfDay)
      .reverse()
      .toArray();
  }
};