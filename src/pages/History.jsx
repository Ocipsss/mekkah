import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionRepo } from '@/db/repository';
import { formatRupiah } from '@/utils/currency';
import Navbar from '@/components/layout/Navbar';
import HistoryCard from '@/components/transactions/HistoryCard';
import { toast } from 'sonner';
import { History as HistoryIcon, ReceiptText, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dailyTotal = transactions.reduce((acc, curr) => acc + curr.total, 0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await transactionRepo.getToday();
      // Mengurutkan berdasarkan ID atau Timestamp terbaru
      setTransactions(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat riwayat");
    } finally {
      setLoading(false);
    }
  };

  // Navigasi ke Detail
  const handleViewDetail = (trx) => {
    navigate(`/transaction/${trx.id}`, { state: { trxData: trx } });
  };

  // Navigasi ke Edit
  const handleEdit = (trx) => {
    navigate('/edit-transaction', { state: { editData: trx } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus transaksi ini? Data yang dihapus tidak bisa dikembalikan.")) {
      try {
        await transactionRepo.delete(id);
        toast.success("Transaksi berhasil dihapus");
        loadHistory();
      } catch (err) {
        toast.error("Gagal menghapus transaksi");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />

      <div className="p-4 pt-6">
        {/* Omzet Card Premium */}
        <div className="bg-emerald-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200 mb-8 relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <TrendingUp size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Omzet Hari Ini</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-1">
              {formatRupiah(dailyTotal)}
            </h2>
            <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/10">
              <Calendar size={12} className="opacity-60" />
              <p className="text-[10px] font-medium opacity-60">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2">
              <HistoryIcon size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktivitas Terkini</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {transactions.length} Transaksi
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Menyinkronkan data...</p>
              </div>
            ) : transactions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ReceiptText size={40} className="text-gray-200" />
                </div>
                <h3 className="text-slate-800 font-bold text-sm">Belum ada transaksi</h3>
                <p className="text-gray-400 text-xs mt-1">Mulai jualan untuk melihat riwayat di sini.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {transactions.map((trx) => (
                  <HistoryCard 
                    key={trx.id} 
                    trx={trx} 
                    onDetail={handleViewDetail}
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default History;