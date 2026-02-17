import React, { useState, useEffect } from 'react';
import { CATEGORIES, UNIT_OPTIONS, PAYMENT_METHODS } from '@/constants/appConfig';
import { formatRupiah, parseRawAmount } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import { transactionRepo } from '@/db/repository'; // Import repo
import { toast } from 'sonner'; // Import toast untuk notifikasi
import { Package, Save, Calculator, Tag, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Transaction = () => {
  // --- State Form Input ---
  const [selectedCat, setSelectedCat] = useState(CATEGORIES.KITAB);
  const [unit, setUnit] = useState(UNIT_OPTIONS[CATEGORIES.KITAB][0]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(''); 
  const [qty, setQty] = useState(1);
  const [payMethod, setPayMethod] = useState('Cash');

  // --- State Keranjang Belanja ---
  const [cart, setCart] = useState([]);

  // --- Kalkulasi ---
  const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  useEffect(() => {
    setUnit(UNIT_OPTIONS[selectedCat][0]);
  }, [selectedCat]);

  // --- Handlers ---
  const handleSelectAll = (e) => e.target.select();

  const handleFinalSave = async () => {
    if (cart.length === 0) return;

    try {
      // Memanggil fungsi upgrade save dari repository.js
      await transactionRepo.save(cart, {
        total: grandTotal,
        payMethod: payMethod,
        userId: 'Abdullah' // Bisa diganti sesuai user yang login
      });
      
      toast.success("Transaksi Berhasil Disimpan!");
      setCart([]); // Kosongkan keranjang setelah berhasil
      setPayMethod('Cash'); // Reset metode bayar
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan transaksi ke database");
    }
  };

  const handlePriceChange = (e) => {
    const rawValue = parseRawAmount(e.target.value);
    setPrice(rawValue);
    setDisplayPrice(rawValue === 0 ? '' : formatRupiah(rawValue, false));
  };

  const addToCart = () => {
    if (!productName || price <= 0) {
      toast.error("Lengkapi nama barang dan harga!");
      return;
    }

    const newItem = {
      id: Date.now(),
      category: selectedCat,
      name: productName,
      price: price,
      qty: qty,
      unit: unit
    };

    setCart([newItem, ...cart]); 
    
    // Reset form setelah tambah
    setProductName('');
    setPrice(0);
    setDisplayPrice('');
    setQty(1);
    toast.success("Ditambahkan ke daftar");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-72 font-sans">
      <Navbar activeCat={selectedCat} onSelectCat={setSelectedCat} />

      <div className="p-4 space-y-6">
        {/* Indikator Mode Input */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
              Mode: {selectedCat}
            </span>
          </div>
          {cart.length > 0 && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {cart.length} Item dalam daftar
            </span>
          )}
        </div>

        {/* --- SECTION 1: INPUT FORM --- */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nama Produk</label>
            <div className="flex items-center gap-3 border-b border-gray-100 focus-within:border-emerald-500 transition-colors py-1">
              <Package size={20} className="text-gray-300" />
              <input 
                type="text" value={productName} onFocus={handleSelectAll}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nama barang..." 
                className="w-full outline-none bg-transparent text-gray-700 font-bold" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Jumlah</label>
              <div className="flex items-center gap-3 border-b border-gray-100 py-1 focus-within:border-emerald-500 transition-colors">
                <Calculator size={18} className="text-gray-300" />
                <input 
                  type="number" inputMode="numeric" value={qty === 0 ? '' : qty}
                  onFocus={handleSelectAll}
                  onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                  className="w-full outline-none bg-transparent font-bold text-gray-700 text-lg" 
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Satuan</label>
              <div className="relative border-b border-gray-100 py-1">
                <select 
                  value={unit} onChange={(e) => setUnit(e.target.value)}
                  className="w-full outline-none bg-transparent font-bold text-gray-700 appearance-none pr-4 text-lg cursor-pointer"
                >
                  {UNIT_OPTIONS[selectedCat].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 text-[8px]">▼</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Harga Satuan</label>
            <div className="flex items-baseline gap-2 pt-1 border-b border-gray-50 focus-within:border-emerald-500 transition-colors">
              <span className="text-xl font-bold text-emerald-600/50">Rp</span>
              <input 
                type="text" inputMode="numeric" placeholder="0"
                value={displayPrice} onFocus={handleSelectAll}
                onChange={handlePriceChange}
                className="w-full text-4xl font-black text-emerald-600 outline-none tracking-tight"
              />
            </div>
          </div>

          <Button 
            variant="secondary" 
            onClick={addToCart}
            className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 rounded-2xl flex items-center justify-center gap-2 shadow-none mt-2"
          >
            <Plus size={20} />
            <span className="font-bold text-sm">TAMBAH KE DAFTAR</span>
          </Button>
        </section>

        {/* --- SECTION 2: DAFTAR BELANJA (PREVIEW) --- */}
        {cart.length > 0 && (
          <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 px-1">
              <ShoppingBag size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Belanjaan</span>
            </div>
            
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100">
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-slate-800 uppercase leading-none">{item.name}</h4>
                    <p className="text-[9px] text-slate-400 mt-1">
                      {item.qty} {item.unit} x {formatRupiah(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-slate-700">{formatRupiah(item.price * item.qty)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-200 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* --- SECTION 3: BOTTOM TOTAL & SIMPAN --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl p-5 border-t border-gray-100 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] z-30">
        <div className="mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m} onClick={() => setPayMethod(m)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  payMethod === m ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatRupiah(grandTotal)}</p>
          </div>
          <div className="text-right">
            <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
               <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-tighter">{cart.length} Item</p>
            </div>
          </div>
        </div>

        <Button 
          disabled={cart.length === 0}
          className={`h-16 rounded-2xl shadow-xl transition-all duration-300 ${
            cart.length === 0 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-emerald-600 shadow-emerald-200 text-white'
          }`} 
          onClick={handleFinalSave}
        >
          <Save size={22} />
          <span className="font-black tracking-widest">SIMPAN TRANSAKSI</span>
        </Button>
      </div>
    </div>
  );
};

export default Transaction;