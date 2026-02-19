import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatRupiah } from '@/utils/currency';

const CartItem = ({ item, onRemove }) => {
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-gray-100"
    >
      <div className="flex-1">
        <h4 className="font-bold text-xs text-slate-800 uppercase leading-none">{item.name}</h4>
        <p className="text-[9px] text-slate-400 mt-1">
          {item.qty} {item.unit} x {formatRupiah(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-sm text-slate-700">
          {formatRupiah(item.price * item.qty)}
        </span>
        <button 
          onClick={() => onRemove(item.id)} 
          className="text-red-200 hover:text-red-500 p-1 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;