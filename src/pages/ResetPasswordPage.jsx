import React, { useState } from "react";
import { Card, Input, Button, Image } from "@heroui/react";
import { resetPassword } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 10) {
        toast.warning("La contraseña debe tener al menos 10 caracteres.");
        return;
    }
    if (!token) {
        toast.error("Token inválido o expirado. Solicita uno nuevo.");
        return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success("¡Contraseña restablecida! Ahora inicia sesión.");
      navigate("/");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Error al restablecer. El enlace puede haber expirado.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    inputWrapper: ["border-white/20", "group-data-[focus=true]:border-blue-500", "h-14", "bg-black/60"],
    label: "text-blue-400 font-black text-[11px] tracking-widest",
    input: ["text-white", "placeholder:text-gray-500"],
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/mapache-portada.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.5)" }} />
      <div className="absolute inset-0 bg-black/30 z-1" />

      <Card className="w-full max-w-md p-8 bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl relative z-10 rounded-[40px]">
        <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
                <Image src="/mapache_icon.png" alt="Icon" className="w-20 h-20 object-contain drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-black text-center bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent uppercase tracking-tighter italic">
              Nueva Contraseña
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="text-gray-400 text-center text-sm">Ingresa tu nueva contraseña para recuperar el acceso.</p>
            
            <Input 
                type="password" label="NUEVA CONTRASEÑA" placeholder="••••••••••••" 
                variant="bordered" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                classNames={inputStyles}
                description={<span className="text-[10px] text-gray-500">Mínimo 10 caracteres</span>}
            />

            <Button type="submit" color="primary" size="lg" className="font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 shadow-xl h-14 rounded-2xl text-white mt-2" isLoading={loading}>
                Guardar Cambios
            </Button>
        </form>
      </Card>
    </div>
  );
}