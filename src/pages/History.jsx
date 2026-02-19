import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionRepo } from '@/db/repository';
import { formatRupiah } from '@/utils/currency';
import Navbar from '@/components/layout/Navbar';
import HistoryCard from '@/components/transactions/HistoryCard'; // Import komponen baru
import { toast } from 'sonner';
import { History as HistoryIcon, Calendar, ReceiptText } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dailyTotal = transactions.reduce((acc, curr) => acc + curr.total, 0);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const data = await transactionRepo.getToday();
      setTransactions(data.sort((a, b) => b.id - a.id));
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleEdit = (trx) => navigate('/edit-transaction', { state: { editData: trx } });

  const handleDelete = async (id) => {
    if (window.confirm("Hapus transaksi ini?")) {
      await transactionRepo.delete(id);
      toast.success("Transaksi dihapus");
      loadHistory();
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />
      <div className="p-4 pt-6">
        {/* Omzet Card tetap di sini karena ini bagian dari header halaman */}
        <div className="bg-emerald-700 rounded-[2.5rem] p-6 text-white shadow-xl mb-8 relative overflow-hidden">
           {/* ... isi omzet card sama seperti sebelumnya ... */}
           <h2 className="text-3xl font-black tracking-tight">{formatRupiah(dailyTotal)}</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <HistoryIcon size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktivitas Terkini</span>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <p className="text-center py-10 text-slate-400 text-xs italic">Memuat...</p>
            ) : transactions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed">
                <ReceiptText size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm font-medium">Belum ada transaksi</p>
              </div>
            ) : (
              transactions.map((trx) => (
                <HistoryCard 
                  key={trx.id} 
                  trx={trx} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default History;