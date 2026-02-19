import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, History, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu size={24} className="text-emerald-700" />
          </button>
          <h1 className="text-xl font-black text-emerald-700 tracking-tight italic">MEKKAH</h1>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop dengan transisi opacity linear */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Sidenav dengan transisi Ease Out (Tanpa Mantul) */}
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ 
                type: "tween", // Mengganti spring menjadi tween
                ease: "easeOut", 
                duration: 0.3 
              }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-emerald-700">Menu</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                    location.pathname === '/' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-emerald-50'
                  }`}
                >
                  <LayoutDashboard size={20} /> Transaksi (POS)
                </button>
                <button
                  onClick={() => handleNavigation('/history')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                    location.pathname === '/history' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-emerald-50'
                  }`}
                >
                  <History size={20} /> Riwayat
                </button>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl">
                  <LogOut size={20} /> Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;