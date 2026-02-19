import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UNIT_OPTIONS, PAYMENT_METHODS } from '@/constants/appConfig';
import { formatRupiah } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import CategoryFab from '@/components/ui/CategoryFab';
import CartItem from '@/components/transactions/CartItem';
import { useTransactionForm } from '@/features/pos/useTransactionForm';
import { transactionRepo } from '@/db/repository';
import { toast } from 'sonner';
import { Package, Save, Calculator, Plus, ShoppingBag, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Transaction = () => {
  const { state, actions } = useTransactionForm();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.editData) {
      actions.loadEditData(location.state.editData);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, actions]);

  const handleFinalSave = async () => {
    if (state.cart.length === 0) return;
    
    const payload = {
      total: state.grandTotal,
      payMethod: state.payMethod,
      userId: 'Abdullah',
      updatedAt: Date.now()
    };

    try {
      if (state.editingId) {
        await transactionRepo.update(state.editingId, state.cart, payload);
        toast.success("Transaksi Berhasil Diperbarui!");
        navigate('/history');
      } else {
        await transactionRepo.save(state.cart, payload);
        toast.success("Transaksi Berhasil Disimpan!");
      }
      actions.resetForm();
    } catch (err) {
      console.error(err);
      toast.error(state.editingId ? "Gagal memperbarui" : "Gagal menyimpan");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-72 font-sans relative overflow-x-hidden">
      <Navbar />

      <AnimatePresence>
        {isFabOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsFabOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40"
          />
        )}
      </AnimatePresence>

      <div className="p-4 space-y-6">
        
        {/* BANNER MODE EDIT TRANSAKSI */}
        {state.editingId && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            className="bg-amber-500 text-white p-3 rounded-2xl flex items-center justify-between shadow-lg shadow-amber-100"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg"><Save size={14} /></div>
              <span className="text-[10px] font-black uppercase tracking-wider">Mode Edit Transaksi #{state.editingId.toString().slice(-4)}</span>
            </div>
            <button onClick={actions.resetForm} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={16} /></button>
          </motion.div>
        )}

        <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">Mode: {state.selectedCat}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{state.cart.length} Item</span>
        </div>

        {/* --- SECTION 1: INPUT FORM --- */}
        <section className={`bg-white p-5 rounded-[2.5rem] shadow-sm border transition-all duration-300 ${state.editingItem ? 'border-blue-400 ring-4 ring-blue-50' : 'border-gray-100'}`}>
          {state.editingItem && (
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Plus size={12} className="rotate-45" />
              <span className="text-[10px] font-black uppercase tracking-widest">Sedang Mengubah Item</span>
            </div>
          )}
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 ml-1">Nama Produk</label>
            <div className="flex items-center gap-3 border-b border-gray-100 focus-within:border-emerald-500 transition-colors py-1">
              <Package size={20} className="text-gray-300" />
              <input type="text" value={state.productName} onFocus={actions.handleSelectAll}
                onChange={(e) => actions.setProductName(e.target.value)}
                placeholder="Ketik nama barang..." className="w-full outline-none bg-transparent text-gray-700 font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 ml-1">Jumlah</label>
              <div className="flex items-center gap-3 border-b border-gray-100 py-1">
                <Calculator size={18} className="text-gray-300" />
                <input type="number" inputMode="numeric" value={state.qty === 0 ? '' : state.qty}
                  onFocus={actions.handleSelectAll}
                  onChange={(e) => actions.setQty(parseInt(e.target.value) || 0)}
                  className="w-full outline-none bg-transparent font-bold text-gray-700 text-lg" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 ml-1">Satuan</label>
              <div className="relative border-b border-gray-100 py-1">
                <select value={state.unit} onChange={(e) => actions.setUnit(e.target.value)}
                  className="w-full outline-none bg-transparent font-bold text-gray-700 appearance-none pr-4 text-lg cursor-pointer">
                  {UNIT_OPTIONS[state.selectedCat].map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 text-[8px]">▼</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1 ml-1">Harga Satuan</label>
            <div className="flex items-baseline gap-2 pt-1 border-b border-gray-50">
              <span className="text-xl font-bold text-emerald-600/50">Rp</span>
              <input type="text" inputMode="numeric" placeholder="0" value={state.displayPrice}
                onFocus={actions.handleSelectAll} onChange={actions.handlePriceChange}
                className="w-full text-4xl font-black text-emerald-600 outline-none tracking-tight" />
            </div>
          </div>

          {/* TOMBOL DINAMIS: Update vs Tambah */}
          {state.editingItem ? (
            <div className="flex gap-2 pt-2">
              <Button onClick={actions.updateItemInCart} className="flex-2 py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                <Check size={20} /> <span className="font-bold text-sm uppercase">Simpan Perubahan</span>
              </Button>
              <Button onClick={actions.resetInputFields} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase text-[10px]">
                Batal
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={actions.addToCart} className="w-full py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <Plus size={20} /> <span className="font-bold text-sm uppercase">Tambah ke Daftar</span>
            </Button>
          )}
        </section>

        {/* --- SECTION 2: DAFTAR BELANJA --- */}
        {state.cart.length > 0 && (
          <section className="space-y-3 pb-10">
            <div className="flex items-center gap-2 px-1 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
              <ShoppingBag size={14} /> <span>Detail Belanjaan (Klik untuk edit)</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode='popLayout'>
                {state.cart.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => actions.startEditItem(item)}
                    className={`cursor-pointer transition-all duration-300 rounded-3xl ${state.editingItem?.id === item.id ? 'ring-2 ring-blue-500 shadow-md scale-[1.02]' : 'hover:scale-[1.01]'}`}
                  >
                    <CartItem item={item} onRemove={(e) => {
                      e.stopPropagation(); // Biar klik hapus gak memicu edit
                      actions.removeFromCart(item.id);
                    }} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}
      </div>

      <CategoryFab isOpen={isFabOpen} setIsOpen={setIsFabOpen} selectedCat={state.selectedCat} onSelect={actions.setSelectedCat} />

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl p-5 border-t border-gray-100 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] z-30">
        <div className="mb-4 overflow-x-auto scrollbar-hide flex gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button key={m} onClick={() => actions.setPayMethod(m)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${state.payMethod === m ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatRupiah(state.grandTotal)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
            <p className="text-[10px] font-extrabold text-emerald-700 uppercase">{state.cart.length} Item</p>
          </div>
        </div>
        <Button disabled={state.cart.length === 0}
          className={`h-16 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 ${
            state.cart.length === 0 ? 'bg-slate-200 text-slate-400' : 
            state.editingId ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
          }`} onClick={handleFinalSave}>
          <Save size={22} />
          <span className="font-black tracking-widest uppercase ml-2">{state.editingId ? 'Update Transaksi' : 'Simpan Transaksi'}</span>
        </Button>
      </div>
    </div>
  );
};

export default Transaction;