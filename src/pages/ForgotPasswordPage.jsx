import React, { useState } from "react";
import { Card, Input, Button, Image } from "@heroui/react";
import { requestPasswordRecovery } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await requestPasswordRecovery(email);
      setSent(true);
      toast.success("Correo enviado con éxito.");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || "Error al enviar el correo.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    inputWrapper: [
      "border-white/20", "group-data-[focus=true]:border-blue-500", "h-14", "bg-black/60",
    ],
    label: "text-blue-400 font-black text-[11px] tracking-widest",
    input: ["text-white", "placeholder:text-gray-500"],
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/mapache-portada.jpg')", 
          backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.5)" 
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-1" />

      <Card className="w-full max-w-md p-8 bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative z-10 rounded-[40px]">
        <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
                <Image src="/mapache_icon.png" alt="Mapache Icon" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            </div>
            <h1 className="text-3xl font-black text-center bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent uppercase tracking-tighter italic">
              Recuperar Cuenta
            </h1>
        </div>

        {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <p className="text-gray-400 text-center text-sm">
                    Ingresa tu correo electrónico y te enviaremos un enlace mágico para restablecer tu contraseña.
                </p>
                <Input 
                    type="email" label="TU EMAIL REGISTRADO" placeholder="correo@ejemplo.com" 
                    variant="bordered" value={email} onChange={(e) => setEmail(e.target.value)} 
                    classNames={inputStyles}
                />
                <div className="flex flex-col gap-3 mt-2">
                    <Button type="submit" color="primary" size="lg" className="font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 shadow-2xl h-14 rounded-2xl text-white" isLoading={loading}>
                        Enviar Enlace
                    </Button>
                    <Button variant="light" className="font-bold text-gray-400" onPress={() => navigate("/")}>
                        Cancelar
                    </Button>
                </div>
            </form>
        ) : (
            <div className="flex flex-col gap-6 text-center">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
                    <p className="text-green-400 font-bold">¡Correo Enviado! 📨</p>
                    <p className="text-gray-400 text-xs mt-2">Revisa tu bandeja de entrada (y spam) para continuar.</p>
                </div>
                <Button variant="flat" color="primary" className="font-black uppercase" onPress={() => navigate("/")}>
                    Volver al Login
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
}