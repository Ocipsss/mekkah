import { db } from './schema';
import { headerRepo } from './repos/transactionHeader.repo';
import { itemRepo } from './repos/transactionItems.repo';

export const transactionRepo = {
  // --- CREATE ---
  async save(cart, headerData) {
    return await db.transaction('rw', [db.transactions, db.transactionItems], async () => {
      const transactionId = await headerRepo.add(headerData);
      await itemRepo.addBulk(transactionId, cart);
      return transactionId;
    });
  },

  // --- UPDATE ---
  async update(id, cart, headerData) {
    return await db.transaction('rw', [db.transactions, db.transactionItems], async () => {
      await headerRepo.update(id, headerData);
      await itemRepo.deleteByTransactionId(id);
      await itemRepo.addBulk(id, cart);
    });
  },

  // --- DELETE ---
  async delete(id) {
    return await db.transaction('rw', [db.transactions, db.transactionItems], async () => {
      await itemRepo.deleteByTransactionId(id);
      await headerRepo.delete(id);
    });
  },

  // --- READ ---
  async getToday() {
    const headers = await headerRepo.getTodayHeaders();
    
    return await Promise.all(headers.map(async (h) => {
      const items = await itemRepo.getByTransactionId(h.id);
      return { ...h, items };
    }));
  },

  // --- SYNC HELPERS (Langsung ke DB atau Header Repo) ---
  async getPending() {
    return await db.transactions.where('syncStatus').equals('pending').toArray();
  },

  async markAsSynced(id) {
    return await db.transactions.update(id, { syncStatus: 'synced' });
  }
};