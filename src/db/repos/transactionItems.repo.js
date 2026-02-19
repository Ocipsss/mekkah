import { db } from '../schema';

export const itemRepo = {
  async addBulk(transactionId, cart) {
    const itemsToSave = cart.map(item => ({
      transactionId,
      category: item.category,
      productName: item.name || item.productName,
      price: item.price,
      qty: item.qty,
      unit: item.unit
    }));
    return await db.transactionItems.bulkAdd(itemsToSave);
  },

  async deleteByTransactionId(transactionId) {
    return await db.transactionItems.where('transactionId').equals(transactionId).delete();
  },

  async getByTransactionId(transactionId) {
    const items = await db.transactionItems.where('transactionId').equals(transactionId).toArray();
    // Kita map kembali ke properti 'name' agar cocok dengan state keranjang di UI
    return items.map(i => ({ ...i, name: i.productName }));
  }
};