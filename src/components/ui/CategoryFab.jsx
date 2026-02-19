import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Layers } from 'lucide-react';
import { CATEGORIES } from '@/constants/appConfig';

const CategoryFab = ({ isOpen, setIsOpen, selectedCat, onSelect }) => {
  const catKeys = Object.keys(CATEGORIES);
  const constraintsRef = useRef(null);
  const fabRef = useRef(null); // Ref untuk ambil posisi asli tombol
  
  const [isAtLeft, setIsAtLeft] = useState(false);

  // Fungsi yang dijalankan saat jari lepas dari tombol
  const handleDragEnd = () => {
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      
      // Cek apakah posisi tombol lebih dekat ke kiri layar
      // Jika posisi X tombol < setengah lebar layar, berarti dia di kiri
      if (rect.left < screenWidth / 2) {
        setIsAtLeft(true);
      } else {
        setIsAtLeft(false);
      }
    }
  };

  // Sudut yang adaptif
  // Kanan: Mekar ke kiri atas (160 s/d 240)
  // Kiri: Mekar ke kanan atas (20 s/d -60)
  const START_ANGLE = isAtLeft ? 20 : 160;
  const END_ANGLE = isAtLeft ? -60 : 240;

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        ref={fabRef}
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd} // Update posisi pas berhenti ditarik
        className="absolute bottom-28 right-8 pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <AnimatePresence>
          {isOpen && (
            <div className="relative">
              {catKeys.map((key, index) => {
                const angle = START_ANGLE + (index * ((END_ANGLE - START_ANGLE) / (catKeys.length - 1 || 1)));
                const radian = (angle * Math.PI) / 180;
                const RADIUS = 95;
                const x = Math.cos(radian) * RADIUS;
                const y = Math.sin(radian) * RADIUS;

                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, x: x, y: y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    onClick={() => {
                      onSelect(CATEGORIES[key]);
                      setIsOpen(false);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full shadow-xl border-2 transition-colors whitespace-nowrap ${
                      selectedCat === CATEGORIES[key] 
                        ? 'bg-emerald-600 text-white border-white' 
                        : 'bg-white/95 text-emerald-700 border-emerald-50'
                    }`}
                    style={{ left: '50%', top: '50%' }}
                  >
                    <Package size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider">{CATEGORIES[key]}</span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-slate-800 text-white rotate-45 rounded-full' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50'
          }`}
        >
          {isOpen ? <Plus size={32} /> : <Layers size={28} />}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CategoryFab;