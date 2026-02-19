import React from 'react';
import { CheckCircle2, Clock, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatRupiah } from '@/utils/currency';

const HistoryCard = ({ trx, onEdit, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-4"
    >
      {/* Detail Bagian Atas */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-2xl ${trx.syncStatus === 'synced' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
            {trx.syncStatus === 'synced' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-800">
                {new Date(trx.timestamp || trx.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h4>
              <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold uppercase tracking-tighter">
                {trx.payMethod}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">ID: #{trx.id.toString().slice(-4)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-sm text-slate-800">{formatRupiah(trx.total)}</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Berhasil</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-50">
        <button 
          onClick={() => onEdit(trx)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
        >
          <Edit3 size={14} /> Edit Transaksi
        </button>
        <button 
          onClick={() => onDelete(trx.id)}
          className="px-4 py-2.5 bg-slate-50 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default HistoryCard;