import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Explore from "./pages/Explore";
import MyBooks from "./pages/MyBooks";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; 
import ResetPasswordPage from "./pages/ResetPasswordPage"; 
import { Toaster } from 'sonner';

function App() {
  const { user } = useAuth(); 

  return (
    <Router>
      {/* Toaster global para toda la app */}
      <Toaster position="top-right" richColors closeButton />
      
      <Routes>
        {/* --- CASO 1: USUARIO NO LOGUEADO (Rutas Públicas) --- */}
        {!user && (
          <>
            {/* Ruta raíz muestra el Login */}
            <Route path="/" element={<AuthPage />} />
            
            {/* Ruta para solicitar el correo */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Ruta para poner la nueva contraseña (desde el link del correo) */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Cualquier otra ruta desconocida redirige al Login */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/* --- CASO 2: USUARIO LOGUEADO (Rutas Privadas con Sidebar) --- */}
        {user && (
          <Route
            path="/*"
            element={
              <div className="flex h-screen bg-[#0a0a0a]">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/mybooks" element={<MyBooks />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    {/* Si intenta ir a una ruta desconocida logueado, va al Home */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;