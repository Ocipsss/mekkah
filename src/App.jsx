import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Transaction from '@/pages/Transaction';
import History from '@/pages/History'; // Pastikan sudah diimport
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      {/* Wadah untuk notifikasi pop-up (Toast) */}
      <Toaster 
        position="top-center" 
        richColors 
        expand={false}
        closeButton
      />

      <Routes>
        {/* Halaman Utama (Mesin Kasir) */}
        <Route path="/" element={<Transaction />} />

        {/* Halaman Riwayat Penjualan */}
        <Route path="/history" element={<History />} />

        {/* Kamu bisa tambah route lain di sini nanti, contoh: */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;