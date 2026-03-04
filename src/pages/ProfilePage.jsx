import React, { useState } from "react";
import { Card, Input, Button, Avatar, Tab, Tabs } from "@heroui/react";
import { useAuth } from "../context/AuthContext";
import { updateUserPassword, updateUserName } from "../services/api";

export default function ProfilePage() {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateName = async () => {
    if (!newUsername.trim() || newUsername.length < 5) return alert("El nombre debe tener al menos 5 caracteres");
    setLoading(true);
    try {
      const updatedUser = await updateUserName(user.id, { newUsername });
      login({ ...user, username: updatedUser.username });
      alert("¡Nombre de usuario actualizado! 😎");
      setNewUsername("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al actualizar nombre");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePass = async () => {
    if (!oldPassword || !newPassword) return alert("Llena ambos campos");
    if (newPassword.length < 10) return alert("La nueva contraseña debe tener 10 caracteres mínimo");

    setLoading(true);
    try {
      await updateUserPassword(user.id, { oldPassword, newPassword });
      alert("¡Contraseña cambiada exitosamente! 🔒");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "La contraseña actual no coincide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      
      {/* HEADER DEL PERFIL */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <Avatar 
                src={`https://ui-avatars.com/api/?name=${user.username}&background=0D47A1&color=fff&size=128`} 
                className="w-32 h-32 text-4xl font-bold shadow-2xl relative z-10 border-4 border-[#111]" 
            />
        </div>
        <h1 className="text-4xl font-black mt-4 text-white tracking-tighter uppercase italic">{user.username}</h1>
        <p className="text-gray-500 font-medium">{user.email}</p>
      </div>

      <div className="max-w-3xl mx-auto">
          <Tabs 
            aria-label="Opciones de Perfil" 
            color="primary" 
            variant="underlined" 
            size="lg" 
            fullWidth
            classNames={{
                tabList: "border-b border-white/5",
                cursor: "bg-blue-500",
                tabContent: "group-data-[selected=true]:text-blue-400 font-bold"
            }}
          >
              
              {/* PESTAÑA 1: EDITAR PERFIL */}
              <Tab key="edit" title="EDITAR PERFIL">
                  <Card className="p-8 bg-[#111] border border-white/5 mt-6 rounded-[32px] shadow-2xl">
                      <h3 className="text-xl font-black mb-6 text-blue-400 uppercase italic">Cambiar Nombre de Usuario</h3>
                      <div className="flex flex-col md:flex-row gap-4 items-end">
                          <Input 
                              label="Nuevo Usuario" 
                              labelPlacement="outside"
                              placeholder={user.username} 
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className="flex-grow dark"
                              classNames={{
                                  inputWrapper: "bg-[#1a1a1a] group-data-[focus=true]:bg-[#222] border border-white/10",
                                  input: "text-white placeholder:text-gray-600 font-medium",
                                  label: "text-gray-400 font-bold mb-2"
                              }}
                          />
                          <Button 
                            color="primary" 
                            onPress={handleUpdateName} 
                            isLoading={loading}
                            className="w-full md:w-32 font-black uppercase tracking-widest bg-blue-600 h-14 rounded-2xl"
                          >
                              Guardar
                          </Button>
                      </div>
                      <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold tracking-widest">Tu email no se puede cambiar por seguridad.</p>
                  </Card>
              </Tab>

              {/* PESTAÑA 2: SEGURIDAD */}
              <Tab key="security" title="SEGURIDAD">
                  <Card className="p-8 bg-[#111] border border-white/5 mt-6 rounded-[32px] shadow-2xl space-y-6">
                      <h3 className="text-xl font-black text-green-400 uppercase italic">Cambiar Contraseña</h3>
                      
                      <Input 
                          type="password" 
                          label="Contraseña Actual" 
                          labelPlacement="outside"
                          placeholder="••••••••" 
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="dark"
                          classNames={{
                            inputWrapper: "bg-[#1a1a1a] group-data-[focus=true]:bg-[#222] border border-white/10",
                            input: "text-white placeholder:text-gray-600",
                            label: "text-gray-400 font-bold"
                          }}
                      />
                      
                      <Input 
                          type="password" 
                          label="Nueva Contraseña" 
                          labelPlacement="outside"
                          placeholder="Mínimo 10 caracteres" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="dark"
                          classNames={{
                            inputWrapper: "bg-[#1a1a1a] group-data-[focus=true]:bg-[#222] border border-white/10",
                            input: "text-white placeholder:text-gray-600",
                            label: "text-gray-400 font-bold"
                          }}
                      />

                      <Button 
                        color="success" 
                        className="w-full font-black uppercase tracking-widest h-14 rounded-2xl bg-green-600 text-white shadow-lg shadow-green-900/20" 
                        onPress={handleUpdatePass} 
                        isLoading={loading}
                      >
                          Actualizar Contraseña
                      </Button>
                  </Card>
              </Tab>
          </Tabs>
      </div>
    </div>
  );
}