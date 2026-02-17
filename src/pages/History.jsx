import React, { useState, useEffect } from 'react';
import { transactionRepo } from '@/db/repository';
import { formatRupiah } from '@/utils/currency';
import Navbar from '@/components/layout/Navbar';
import { 
  History as HistoryIcon, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Calendar,
  ReceiptText
} from 'lucide-react';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hitung total omzet hari ini dari state
  const dailyTotal = transactions.reduce((acc, curr) => acc + curr.total, 0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await transactionRepo.getToday();
      setTransactions(data);
    } catch (error) {
      console.error("Gagal memuat histori:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />

      {/* --- Header & Ringkasan Hari Ini --- */}
      <div className="p-4 pt-6">
        <div className="bg-emerald-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-emerald-100 mb-8 relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Calendar size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Penjualan Hari Ini</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">{formatRupiah(dailyTotal)}</h2>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">
              Total {transactions.length} Transaksi
            </div>
          </div>
        </div>

        {/* --- Daftar Transaksi --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <HistoryIcon size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktivitas Terkini</span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs font-medium italic">Memuat data...</div>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
              <ReceiptText size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm font-medium">Belum ada transaksi hari ini</p>
            </div>
          ) : (
            transactions.map((trx) => (
              <div 
                key={trx.id} 
                className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-gray-100 active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-4">
                  {/* Ikon Status Sync */}
                  <div className={`p-2.5 rounded-2xl ${trx.syncStatus === 'synced' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {trx.syncStatus === 'synced' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-800">
                        {new Date(trx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </h4>
                      <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold uppercase tracking-tighter">
                        {trx.payMethod}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">ID: #{trx.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-black text-sm text-slate-800">{formatRupiah(trx.total)}</p>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Berhasil</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;