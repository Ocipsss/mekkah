import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, History, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ activeCat, onSelectCat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { id: 'Kitab', icon: <Package size={20} /> },
    { id: 'Minyak', icon: <Package size={20} /> },
    { id: 'Kurma', icon: <Package size={20} /> },
  ];

  // Fungsi navigasi yang menutup sidebar otomatis
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
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              {/* Header Sidebar */}
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-emerald-700">Menu</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aplikasi Kasir v1.0</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 space-y-8">
                {/* Menu Utama Navigasi */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Main Menu</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation('/')}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                        location.pathname === '/' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <LayoutDashboard size={20} /> Transaksi (POS)
                    </button>
                    <button
                      onClick={() => handleNavigation('/history')}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                        location.pathname === '/history' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <History size={20} /> Riwayat
                    </button>
                  </div>
                </div>

                {/* Kategori - Hanya muncul jika di halaman POS */}
                {location.pathname === '/' && onSelectCat && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Kategori Produk</p>
                    <div className="space-y-2">
                      {categories.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { onSelectCat(item.id); setIsOpen(false); }}
                          className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                            activeCat === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-500 hover:bg-emerald-50'
                          }`}
                        >
                          {item.icon} {item.id}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Sidebar */}
              <div className="pt-6 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
                  <LogOut size={20} /> Keluar Akun
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