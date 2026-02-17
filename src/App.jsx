import Transaction from '@/pages/Transaction';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* Komponen utama yang baru kita buat */}
      <Transaction />

      {/* Wadah untuk notifikasi pop-up (Toast) */}
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;