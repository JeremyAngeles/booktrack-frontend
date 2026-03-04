import React, { useState, useEffect } from "react";
import { getBookPrices } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PriceListStatic = ({ bookId }) => {
  const { user } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!bookId || !user?.id) return;
      setLoading(true);
      try {
        const data = await getBookPrices(user.id, bookId);
        setPrices(data);
      } catch (e) {
        console.error("Error cargando precios:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookId, user.id]);

  if (loading) return <Spinner size="sm" color="success" />;
  if (prices.length === 0) return <p className="text-[10px] text-gray-600 italic">Sin precios registrados</p>;

  return (
    <div className="space-y-3">
      {prices.map((p) => (
        <div key={p.idPrice} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{p.storeName}</span>
              <span className="text-[8px] text-gray-500">{new Date(p.seenAt).toLocaleDateString()}</span>
            </div>
            <span className="text-sm font-black text-green-400">
              {p.currency === "PEN" ? "S/" : "$"} {p.price}
            </span>
          </div>

          {/* BOTÓN IR A TIENDA: Solo aparece si existe el link */}
          {p.storeLink && (
            <Button 
              as="a" 
              href={p.storeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              size="sm" 
              variant="flat" 
              color="primary"
              className="w-full h-7 text-[9px] font-bold uppercase rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
            >
              Ir a Tienda ↗
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};