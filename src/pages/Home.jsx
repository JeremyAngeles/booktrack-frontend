import React, { useState, useEffect } from "react";
import { Button, Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { exploreGoogle, saveBookToLog } from "../services/api"; 
import { useAuth } from "../context/AuthContext";
import { toast } from 'sonner';
import BookCard from "../components/BookCard";

export default function Home() {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [sectionsData, setSectionsData] = useState({
    novedades: [],
    mangas: [],
    literatura: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [resNov, resEva, resVar] = await Promise.all([
          exploreGoogle("Dostoievski", 0, "es"),
          exploreGoogle("Evangelion", 0, "es"),
          exploreGoogle("Vargas Llosa", 0, "es")
        ]);

        setSectionsData({
          novedades: (resNov || []).slice(0, 4),
          mangas: (resEva || []).slice(0, 4),
          literatura: (resVar || []).slice(0, 4)
        });

      } catch (error) {
        console.error("Error en el Home:", error);
        toast.error("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [user]);

  const handleViewMore = (query) => {
    sessionStorage.setItem("savedSearch", query);
    sessionStorage.setItem("savedPage", "0");
    navigate('/explore');
  };

  const handleSave = async (bookData) => {
    try {
      await saveBookToLog(user.id, bookData);
      toast.success(`"${bookData.title}" guardado en tu biblioteca.`);
    } catch (error) {
      toast.error("Error al guardar el libro.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Spinner size="lg" label="Cargando las mejores lecturas..." color="primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex-1 p-8 max-w-7xl mx-auto">
        
        <section className="bg-gradient-to-r from-[#111] to-[#1a1a1a] rounded-[40px] p-12 flex justify-between items-center relative mb-12 border border-white/5 shadow-2xl overflow-hidden">
          <div className="z-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight italic">
              ¡HOLA, {user.username.toUpperCase()}!
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Explora una colección curada de clásicos, novelas gráficas y las últimas tendencias literarias.
            </p>
            <Button 
              color="primary" size="lg" radius="full" className="font-bold px-10 shadow-lg"
              onPress={() => navigate('/explore')}
            >
              EXPLORAR MÁS
            </Button>
          </div>
          <div className="text-[150px] opacity-[0.03] transform rotate-12 select-none absolute right-10">📚</div>
        </section>

        {[
          { title: "Mario Vargas Llosa", data: sectionsData.literatura, query: "Vargas Llosa" },
          { title: "Cómics y Manga", data: sectionsData.mangas, query: "Evangelion" },
          { title: "Obras Imprescindibles", data: sectionsData.novedades, query: "Dostoievski" }
        ].map((section, idx) => (
          <div key={idx} className="mb-16">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-black tracking-tight uppercase italic border-l-4 border-blue-600 pl-4">
                {section.title}
              </h2>
              <Button 
                variant="light" color="primary" className="font-bold"
                onPress={() => handleViewMore(section.query)}
              >
                Ver más ❯
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.data.length > 0 ? (
                section.data.map((book) => (
                  <BookCard key={book.googleId || book.id} book={book} onSave={handleSave} />
                ))
              ) : (
                <div className="col-span-2 p-10 bg-[#111] rounded-2xl border border-dashed border-white/10 text-center">
                  <p className="text-gray-500 italic">No se encontraron libros. Asegúrate de que el servidor esté activo.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}