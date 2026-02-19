import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatRupiah } from '@/utils/currency';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, Printer, Share2, Calendar, Receipt, User } from 'lucide-react';

const TransactionDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const trx = location.state?.trxData;

  if (!trx) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Data tidak ditemukan</p>
        <button onClick={() => navigate('/history')} className="text-emerald-600 font-bold">Kembali</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-10 font-sans">
      <Navbar />
      
      <div className="p-4 space-y-4">
        {/* Header Navigasi */}
        <button onClick={() => navigate('/history')} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
          <ArrowLeft size={14} /> Kembali ke Riwayat
        </button>

        {/* Kartu Struk Utama */}
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          {/* Bagian Atas: Status */}
          <div className="bg-slate-900 p-8 text-center text-white">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Receipt size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Transaksi Berhasil</h1>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">ID: #{id.toString().slice(-8)}</p>
          </div>

          {/* Bagian Tengah: Info Transaksi */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 border-b border-dashed border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Tanggal</span>
                </div>
                <p className="text-xs font-bold text-slate-700">{new Date(trx.id).toLocaleString('id-ID')}</p>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                  <User size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Kasir</span>
                </div>
                <p className="text-xs font-bold text-slate-700">{trx.userId || 'Admin'}</p>
              </div>
            </div>

            {/* Daftar Barang */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rincian Barang</span>
              {trx.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.qty} {item.unit} x {formatRupiah(item.price)}</p>
                  </div>
                  <p className="text-sm font-black text-slate-800">{formatRupiah(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            {/* Total Akhir */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span>Metode Pembayaran</span>
                <span className="text-slate-800">{trx.payMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total Bayar</span>
                <span className="text-2xl font-black text-emerald-600">{formatRupiah(trx.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="bg-slate-50 p-6 text-center border-t border-gray-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terima kasih atas transaksi Anda</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 h-14 rounded-2xl text-slate-600 font-bold text-sm active:scale-95 transition-all shadow-sm">
            <Printer size={18} /> Cetak
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-800 h-14 rounded-2xl text-white font-bold text-sm active:scale-95 transition-all shadow-lg">
            <Share2 size={18} /> Bagikan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;