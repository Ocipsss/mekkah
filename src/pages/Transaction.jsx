import React, { useState, useEffect } from 'react';
import { CATEGORIES, UNIT_OPTIONS, PAYMENT_METHODS } from '@/constants/appConfig';
import { formatRupiah, parseRawAmount } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar'; // Import Navbar
import { Package, Save, Calculator, Tag } from 'lucide-react';

const Transaction = () => {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES.KITAB);
  const [unit, setUnit] = useState(UNIT_OPTIONS[CATEGORIES.KITAB][0]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(''); 
  const [qty, setQty] = useState(1);
  const [payMethod, setPayMethod] = useState('Cash');

  const total = price * qty;

  useEffect(() => {
    setUnit(UNIT_OPTIONS[selectedCat][0]);
  }, [selectedCat]);

  const handleSelectAll = (e) => e.target.select();
  const handlePriceChange = (e) => {
    const input = e.target.value;
    const rawValue = parseRawAmount(input);
    setPrice(rawValue);
    setDisplayPrice(rawValue === 0 ? '' : formatRupiah(rawValue, false));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-36 font-sans">
      <Navbar activeCat={selectedCat} onSelectCat={setSelectedCat} />

      <div className="p-4 space-y-6">
        {/* Label Kategori Aktif (Indikator saja) */}
        <div className="flex items-center gap-2 px-1">
          <Tag size={14} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Mode Input: {selectedCat}
          </span>
        </div>

        <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-5">
          {/* ... Bagian Nama Produk, Qty, Harga tetap sama seperti sebelumnya ... */}
          {/* (Hanya pindahkan isi Detail Produk yang tadi ke sini) */}
          
          {/* Nama Produk */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nama Produk</label>
            <div className="flex items-center gap-3 border-b border-gray-100 focus-within:border-emerald-500 transition-colors py-2">
              <Package size={20} className="text-gray-300" />
              <input 
                type="text" value={productName} onFocus={handleSelectAll}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nama barang..." 
                className="w-full outline-none bg-transparent text-gray-700 font-medium" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Jumlah</label>
              <div className="flex items-center gap-3 border-b border-gray-100 py-2 focus-within:border-emerald-500 transition-colors">
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
              <div className="relative border-b border-gray-100 py-2">
                <select 
                  value={unit} onChange={(e) => setUnit(e.target.value)}
                  className="w-full outline-none bg-transparent font-bold text-gray-700 appearance-none cursor-pointer pr-4 text-lg"
                >
                  {UNIT_OPTIONS[selectedCat].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">▼</div>
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
        </section>

        {/* 3. Pembayaran */}
        <section>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block px-1">
            Metode Bayar
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
            {PAYMENT_METHODS.map((m) => (
            <button
                key={m}
                onClick={() => setPayMethod(m)}
                className={`px-5 py-2.5 rounded-xl snap-start whitespace-nowrap border-2 text-xs font-bold transition-all duration-200 ${
                payMethod === m 
                ? 'bg-slate-800 border-slate-800 text-white shadow-md scale-95' 
                : 'bg-white border-transparent text-gray-500 shadow-sm hover:border-gray-200'
                }`}
            >
                {m}
            </button>
            ))}
        </div>
        </section>
      </div>

      {/* Floating Bottom Bar Tetap Sama */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl p-5 border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-t-[2.5rem]">
        <div className="flex justify-between items-center mb-5 px-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Tagihan</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatRupiah(total)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-2xl">
            <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">{qty} {unit}</p>
          </div>
        </div>
        <Button className="h-16 rounded-2xl shadow-xl shadow-emerald-200" onClick={() => alert('Saved!')}>
          <Save size={22} /> SIMPAN
        </Button>
      </div>
    </div>
  );
};

export default Transaction;