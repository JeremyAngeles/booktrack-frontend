import React, { useState } from 'react'; // Agregamos useState
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar en móvil

  const menuItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Buscar', path: '/explore', icon: '🔍' },
    { name: 'Mis Libros', path: '/mybooks', icon: '📚' },
    { name: 'Cuenta', path: '/profile', icon: '👤' },
  ];

  return (
    <>
      {/* BOTÓN HAMBURGUESA (Solo visible en móviles) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 rounded-lg text-white"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0f0f0f] border-r border-white/5 p-6 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* SECCIÓN DEL LOGO */}
        <div className="flex flex-col items-center mb-12 px-2 text-center">
          <img src="/mapache_icon.png" alt="Logo Mapache" className="w-20 h-20 object-contain mb-4" />
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl uppercase">Book<span className="text-blue-500">Scout</span></span>
          </div>
        </div>
        
        {/* NAVEGACIÓN */}
        <nav className="space-y-2 flex-grow">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic en un link
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/10' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm uppercase font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* BOTÓN CERRAR SESIÓN */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-red-400">
            <span>🚪</span>
            <span className="text-sm uppercase font-bold">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* OVERLAY: Capa oscura para cerrar el menú al tocar afuera (Solo móvil) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;