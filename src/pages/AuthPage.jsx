import React, { useState } from "react";
import { 
  Card, Input, Button, Tab, Tabs, Image, 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Link 
} from "@heroui/react";
import { loginUser, registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); 
  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [tempUser, setTempUser] = useState(null); 

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password || (!isLogin && !email)) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      let userResponse;
      if (isLogin) {
        userResponse = await loginUser({ username, password });
      } else {
        if (password.length < 10) {
          setLoading(false);
          return alert("La contraseña debe tener al menos 10 caracteres");
        }
        userResponse = await registerUser({ username, email, password });
      }
      setTempUser(userResponse);
      onOpen(); 
    } catch (error) {
      console.error(error);
      const mensaje = error.response?.data?.message || "Error de credenciales. Verifica tus datos.";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalEnter = () => {
    if (tempUser) {
      login(tempUser);
    }
  };
  const inputStyles = {
    inputWrapper: [
      "border-white/20",
      "group-data-[focus=true]:border-blue-500",
      "h-14",
      "bg-black/60", 
    ],
    label: "text-blue-400 font-black text-[11px] tracking-widest",
    input: [
      "text-white",
      "placeholder:text-gray-500",
      "selection:bg-blue-500/30",
      "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
      "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_black_inset]",
      "[&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]",
    ],
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* IMAGEN DE FONDO */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/mapache-portada.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)" 
        }}
      />

      <div className="absolute inset-0 bg-black/30 z-1" />

      <Card className="w-full max-w-md p-8 bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative z-10 rounded-[40px]">
        <div className="flex flex-col items-center mb-8">
            <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                <Image
                    src="/mapache_icon.png" 
                    alt="Mapache Icon"
                    className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                />
            </div>
            <h1 className="text-4xl font-black text-center bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent uppercase tracking-tighter italic">
              BookScout
            </h1>
            <p className="text-blue-400/90 text-[10px] font-black tracking-[0.3em] mt-2 uppercase italic">
                Donde cada página cuenta una historia
            </p>
        </div>

        <div className="flex w-full flex-col">
          <Tabs 
            aria-label="Acceso" 
            fullWidth 
            size="lg" 
            variant="underlined"
            selectedKey={isLogin ? "login" : "register"}
            onSelectionChange={(key) => setIsLogin(key === "login")}
            classNames={{
                tabList: "border-b border-white/10",
                cursor: "bg-blue-500 w-full",
                tabContent: "group-data-[selected=true]:text-blue-400 font-black tracking-widest text-xs"
            }}
          >
            <Tab key="login" title="ENTRAR" />
            <Tab key="register" title="UNIRSE" />
          </Tabs>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
            <Input 
              label="USUARIO" 
              placeholder="Escribe tu usuario..." 
              variant="bordered"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              classNames={inputStyles}
            />

            {!isLogin && (
              <Input 
                type="email" 
                label="EMAIL" 
                placeholder="correo@ejemplo.com" 
                variant="bordered"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                classNames={inputStyles}
              />
            )}

            <div className="flex flex-col gap-1">
                <Input 
                  type="password" 
                  label="CONTRASEÑA" 
                  placeholder="••••••••••••" 
                  variant="bordered"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  classNames={inputStyles}
                  description={!isLogin ? <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Mínimo 10 caracteres</span> : ""}
                />
                
                {/* --- NUEVO BOTÓN OLVIDÉ MI CONTRASEÑA --- */}
                {isLogin && (
                    <div className="flex justify-end mt-1">
                        <Link 
                            className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer font-bold tracking-wide uppercase italic"
                            onPress={() => navigate("/forgot-password")}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                )}
            </div>

            <Button 
              type="submit"
              color="primary" 
              size="lg" 
              className="mt-4 font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 shadow-2xl h-16 rounded-2xl text-white transition-all"
              isLoading={loading}
            >
              {isLogin ? "INGRESAR" : "CREAR CUENTA"}
            </Button>
          </form>
        </div>
      </Card>

      {/* MODAL (Sin cambios) */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        classNames={{
            base: "bg-[#0a0a0a] border border-white/10 rounded-[40px] p-4",
            header: "text-2xl font-black text-blue-400 italic uppercase tracking-tighter",
            body: "text-gray-300 font-medium",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>¡Bienvenido a BookScout! 📚</ModalHeader>
              <ModalBody>
                <p className="mb-4">Esta página está en <b>fase Demo</b>. Diseñada para amantes de los libros que desean organizar sus lecturas.</p>
                <p className="mb-4">Como lector, la hice para comparar precios y guardar mi colección en un solo lugar.</p>
                <p className="text-blue-400 font-bold italic">"Seguiré actualizándola para que sea nuestra red social literaria favorita."</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" radius="full" className="font-black w-full uppercase" onPress={handleFinalEnter}>
                  ¡VAMOS A LEER! 🚀
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="absolute bottom-6 w-full text-center text-white/40 text-[10px] font-black tracking-[0.4em] uppercase z-10">
        PROYECTO DESARROLLADO POR JEREMY
      </div>
    </div>
  );
}