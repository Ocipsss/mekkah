import currency from 'currency.js';

// Mengubah 10000 -> Rp 10.000 atau 10.000
export const formatRupiah = (value, withSymbol = true) => {
  return currency(value, { 
    symbol: withSymbol ? 'Rp ' : '', 
    separator: '.', 
    decimal: ',', 
    precision: 0 
  }).format();
};

// Mengubah "10.000" -> 10000
export const parseRawAmount = (formattedValue) => {
  // Menghapus semua karakter selain angka
  const cleanValue = formattedValue.replace(/[^0-9]/g, '');
  return cleanValue ? parseInt(cleanValue, 10) : 0;
};