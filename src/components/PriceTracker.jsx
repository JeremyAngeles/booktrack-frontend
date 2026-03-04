import React, { useState, useEffect } from "react";
import { Card, Input, Button, Select, SelectItem, Link } from "@heroui/react";
import { getBookPrices, addPrice, deletePrice, updatePrice } from "../services/api"; 
import { useAuth } from "../context/AuthContext";
import { toast } from 'sonner';

export default function PriceTracker({ bookId }) {
  const { user } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);


  const [editingId, setEditingId] = useState(null); 
  const [storeName, setStoreName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("PEN");
  const [storeLink, setStoreLink] = useState("");

  useEffect(() => {
    if (bookId) loadPrices();
  }, [bookId]);

  const loadPrices = async () => {
    try {
      const data = await getBookPrices(user.id, bookId);
      setPrices(data);
    } catch (error) {
      console.error("Error cargando precios:", error);
    }
  };

  const startEditing = (p) => {
    setEditingId(p.idPrice);
    setStoreName(p.storeName);
    setPrice(p.price.toString());
    setCurrency(p.currency);
    setStoreLink(p.storeLink || "");
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setStoreName("");
    setPrice("");
    setStoreLink("");
  };

  const handleSavePrice = async () => {
    if (!storeName || !price) return toast.error("Llena los datos obligatorios");
    
    setLoading(true);
    try {
      const payload = {
        bookId: bookId,
        storeName,
        price: parseFloat(price),
        currency,
        storeLink
      };

      if (editingId) {
  
        await updatePrice(editingId, payload);
        toast.success("Precio actualizado");
      } else {

        await addPrice(user.id, payload);
        toast.success("Precio guardado");
      }
      
      cancelEditing();
      await loadPrices();
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el precio");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idPrice) => {
    if (!window.confirm("¿Borrar este precio?")) return;
    try {
      await deletePrice(idPrice);
      setPrices(prices.filter(p => p.idPrice !== idPrice));
      toast.success("Precio eliminado");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="bg-[#18181b]/90 border border-gray-700 p-6 rounded-[32px] shadow-xl mt-8">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent italic">
        💰 Comparador de Precios
      </h3>

      {/* LISTA DE PRECIOS */}
      <div className="space-y-4 mb-8">
        {prices.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-4">No has registrado precios para este libro.</p>
        ) : (
          prices.map((p) => (
            <div key={p.idPrice} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${editingId === p.idPrice ? 'border-yellow-500 bg-yellow-500/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">{p.storeName}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                   Visto el: {new Date(p.seenAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-green-400 mr-2">
                  {p.currency === "PEN" ? "S/" : "$"} {p.price}
                </span>
                
                {p.storeLink && (
                  <Button as={Link} href={p.storeLink} isExternal size="sm" variant="flat" color="primary" className="rounded-xl font-bold">
                    Tienda ↗
                  </Button>
                )}
                
                {/* BOTÓN EDITAR */}
                <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => startEditing(p)}>
                  ✏️
                </Button>

                {/* BOTÓN ELIMINAR */}
                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(p.idPrice)}>
                  ✕
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORMULARIO PARA AGREGAR / EDITAR */}
      <div className="pt-6 border-t border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            {editingId ? "Editando Precio" : "Agregar Nuevo Precio"}
          </h4>
          {editingId && (
            <Button size="xs" variant="light" color="danger" onPress={cancelEditing} className="text-[10px] font-bold uppercase">
              Cancelar Edición
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-black/20 p-5 rounded-3xl border border-white/5">
          <div className="md:col-span-4">
            <Input label="Tienda" variant="flat" size="sm" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="dark" />
          </div>

          <div className="md:col-span-2">
             <Select label="Moneda" variant="flat" size="sm" selectedKeys={[currency]} onChange={(e) => setCurrency(e.target.value)} className="dark">
                <SelectItem key="PEN" value="PEN">S/ (PEN)</SelectItem>
                <SelectItem key="USD" value="USD">$ (USD)</SelectItem>
             </Select>
          </div>

          <div className="md:col-span-2">
            <Input type="number" label="Precio" variant="flat" size="sm" value={price} onChange={(e) => setPrice(e.target.value)} className="dark" />
          </div>

          <div className="md:col-span-3">
             <Input label="Link" variant="flat" size="sm" value={storeLink} onChange={(e) => setStoreLink(e.target.value)} className="dark" />
          </div>

          <div className="md:col-span-1">
            <Button 
              isIconOnly 
              color={editingId ? "success" : "warning"} 
              variant="shadow" 
              isLoading={loading} 
              onPress={handleSavePrice}
              className="w-full h-12 rounded-2xl"
            >
              {editingId ? "💾" : "＋"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}