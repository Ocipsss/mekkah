export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-emerald-600 text-white active:bg-emerald-700',
    secondary: 'bg-slate-800 text-white active:bg-slate-900',
    outline: 'border-2 border-emerald-600 text-emerald-600 active:bg-emerald-50',
    ghost: 'bg-gray-100 text-gray-600 active:bg-gray-200'
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};