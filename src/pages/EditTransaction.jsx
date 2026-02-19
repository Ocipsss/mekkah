import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { transactionRepo } from '@/db/repository';
import { formatRupiah, parseRawAmount } from '@/utils/currency';
import { UNIT_OPTIONS, PAYMENT_METHODS } from '@/constants/appConfig';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import CartItem from '@/components/transactions/CartItem';
import { toast } from 'sonner';
import { Save, Check, X, ShoppingBag, ArrowLeft } from 'lucide-react';

const EditTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState('Cash');
  const [transactionId, setTransactionId] = useState(null);

  const [editingItem, setEditingItem] = useState(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const data = location.state?.editData;
    if (!data) {
      navigate('/history');
      return;
    }
    setTransactionId(data.id);
    setCart(data.items);
    setPayMethod(data.payMethod);
  }, [location, navigate]);

  const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleSelectToEdit = (item) => {
    setEditingItem(item);
    setProductName(item.name);
    setPrice(item.price);
    setDisplayPrice(formatRupiah(item.price, false));
    setQty(item.qty);
    setUnit(item.unit);
    setCategory(item.category);
  };

  const handleUpdateItem = () => {
    setCart(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { ...item, name: productName, price, qty, unit } 
        : item
    ));
    cancelItemEdit();
    toast.success("Barang diperbarui");
  };

  const cancelItemEdit = () => {
    setEditingItem(null);
    setProductName('');
    setPrice(0);
    setDisplayPrice('');
    setQty(1);
  };

  const handleSaveTransaction = async () => {
    try {
      await transactionRepo.update(transactionId, cart, {
        total: grandTotal,
        payMethod: payMethod,
        userId: 'Abdullah'
      });
      toast.success("Transaksi Berhasil Diupdate!");
      navigate('/history');
    } catch (err) {
      toast.error("Gagal update transaksi");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-80 font-sans relative">
      <Navbar />
      
      <div className="p-4 space-y-4">
        <button onClick={() => navigate('/history')} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Riwayat
        </button>

        <h1 className="text-xl font-black text-slate-800 tracking-tight">
          Edit Transaksi <span className="text-emerald-600">#{transactionId?.toString().slice(-4)}</span>
        </h1>

        {/* --- FORM EDIT BARANG --- */}
        <div className={`bg-white p-6 rounded-[2.5rem] shadow-sm border-2 transition-all duration-300 ${editingItem ? 'border-amber-400 ring-8 ring-amber-50' : 'border-dashed border-gray-200 opacity-60'}`}>
          {!editingItem ? (
            <div className="text-center py-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilih barang di keranjang untuk diedit</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg uppercase tracking-wider">Editing: {category}</span>
                <button onClick={cancelItemEdit} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={18} /></button>
              </div>

              <input 
                type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                className="w-full text-lg font-bold border-b border-gray-100 outline-none focus:border-amber-500 pb-1 transition-colors"
                placeholder="Nama Produk"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Jumlah</label>
                  <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full text-xl font-bold border-b border-gray-100 outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Satuan</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full text-lg font-bold border-b border-gray-100 outline-none bg-transparent focus:border-amber-500 transition-colors">
                    {UNIT_OPTIONS[category]?.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Harga Satuan</label>
                <div className="flex items-baseline gap-1 border-b border-gray-100 focus-within:border-amber-500 transition-colors">
                  <span className="font-bold text-amber-600">Rp</span>
                  <input type="text" value={displayPrice} 
                    onChange={(e) => {
                      const raw = parseRawAmount(e.target.value);
                      setPrice(raw);
                      setDisplayPrice(formatRupiah(raw, false));
                    }}
                    className="w-full text-3xl font-black text-slate-800 outline-none" />
                </div>
              </div>

              <Button onClick={handleUpdateItem} className="w-full bg-amber-500 hover:bg-amber-600 text-white h-14 rounded-2xl shadow-lg shadow-amber-100 font-bold transition-transform active:scale-95">
                <Check size={20} className="mr-2" /> SIMPAN PERUBAHAN
              </Button>
            </div>
          )}
        </div>

        {/* --- DAFTAR ITEM --- */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1 text-slate-400 uppercase tracking-[0.2em] font-black text-[9px]">
            <ShoppingBag size={12} /> <span>Daftar Keranjang</span>
          </div>
          {cart.map((item) => (
            <div key={item.id} onClick={() => handleSelectToEdit(item)} 
              className={`cursor-pointer transition-all duration-200 ${editingItem?.id === item.id ? 'scale-95 opacity-50 ring-2 ring-amber-400 rounded-2xl' : 'active:scale-98'}`}>
              <CartItem item={item} onRemove={(e) => {
                e.stopPropagation();
                setCart(cart.filter(i => i.id !== item.id));
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM BAR (IDENTIK DENGAN TRANSACTION.JSX) --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl p-5 border-t border-gray-100 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] z-30">
        
        {/* Row 1: Metode Pembayaran */}
        <div className="mb-4 overflow-x-auto scrollbar-hide flex gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button 
              key={m} 
              onClick={() => setPayMethod(m)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                payMethod === m ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Row 2: Harga & Badge Item */}
        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Baru</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatRupiah(grandTotal)}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 px-3 py-1 rounded-xl">
            <p className="text-[10px] font-extrabold text-amber-700 uppercase">{cart.length} Item</p>
          </div>
        </div>

        {/* Row 3: Tombol Aksi Utama (Full Width) */}
        <Button 
          disabled={cart.length === 0}
          onClick={handleSaveTransaction}
          className={`h-16 w-full rounded-2xl shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
            cart.length === 0 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-amber-500 text-white shadow-amber-100'
          }`} 
        >
          <Save size={22} />
          <span className="font-black tracking-widest uppercase">Update Transaksi</span>
        </Button>
      </div>
    </div>
  );
};

export default EditTransaction;