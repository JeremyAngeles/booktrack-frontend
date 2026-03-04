import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); 

  const menuItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Buscar', path: '/explore', icon: '🔍' },
    { name: 'Mis Libros', path: '/mybooks', icon: '📚' },
    { name: 'Cuenta', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0f0f0f] border-r border-white/5 p-6 flex flex-col flex-shrink-0">
      
      {/* SECCIÓN DEL LOGO */}
      <div className="flex flex-col items-center mb-12 px-2 text-center">
        <div className="relative mb-4">
          <div className="absolute -inset-3 bg-gray-500 rounded-full blur-2xl opacity-20"></div>
          <img 
            src="/mapache_icon.png" 
            alt="Logo Mapache"     
            className="relative w-35 h-35 object-contain"
          />
        </div>
        
        <div className="flex flex-col">
          <span className="text-white font-black text-2xl tracking-tighter leading-none uppercase">
            Book<span className="text-blue-500">Scout</span>
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
            Library App
          </span>
        </div>
      </div>
      
      {/* NAVEGACIÓN (Usa flex-grow para empujar el botón de salir hacia abajo) */}
      <nav className="space-y-2 flex-grow">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path 
              ? 'bg-blue-600/20 text-blue-400 font-bold shadow-sm border border-blue-500/10' 
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm uppercase tracking-wider font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* BOTÓN CERRAR SESIÓN (Al final) */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
          <span className="text-sm uppercase tracking-wider font-bold">Cerrar Sesión</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;