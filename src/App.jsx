import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Transaction from '@/pages/Transaction';
import History from '@/pages/History';
import EditTransaction from '@/pages/EditTransaction'; // TAMBAHKAN INI
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors expand={false} closeButton />
      <Routes>
        <Route path="/" element={<Transaction />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit-transaction" element={<EditTransaction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;