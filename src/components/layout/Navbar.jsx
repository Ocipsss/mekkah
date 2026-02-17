import React, { useState } from 'react';
import { Menu, X, ShoppingCart, History, Settings, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ activeCat, onSelectCat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'Kitab', icon: <Package size={20} /> },
    { id: 'Minyak', icon: <Package size={20} /> },
    { id: 'Kurma', icon: <Package size={20} /> },
  ];

  return (
    <>
      <nav className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl">
            <Menu size={24} className="text-emerald-700" />
          </button>
          <h1 className="text-xl font-black text-emerald-700 tracking-tight">MEKKAH</h1>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
          <ShoppingCart size={20} />
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-emerald-700">Menu</h2>
                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Kategori Produk</p>
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { onSelectCat(item.id); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                          activeCat === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-emerald-50'
                        }`}
                      >
                        {item.icon} {item.id}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl">
                    <History size={20} /> Riwayat
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl">
                    <LogOut size={20} /> Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;