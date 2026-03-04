import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { exploreGoogle, saveBookToLog } from "../services/api";
import BookSkeleton from "../components/BookSkeleton";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";
import { toast } from 'sonner';

export default function Explore() {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [publisher, setPublisher] = useState("");
  const [language, setLanguage] = useState("es");
  
  const [currentSearch, setCurrentSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const performSearch = async (searchTerm, pageNumber, langToUse) => {
    if (!searchTerm) return;
    setLoading(true);

    const lang = langToUse || language;

    try {
      const data = await exploreGoogle(searchTerm, pageNumber, lang);
      
      setBooks(data);
      setPage(pageNumber);
      setCurrentSearch(searchTerm);

      sessionStorage.setItem("savedSearch", searchTerm);
      sessionStorage.setItem("savedPage", pageNumber);
      sessionStorage.setItem("savedLang", lang);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error en Explore:", error);
      toast.error("Error de conexión con Google Books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("savedSearch");
    const savedPage = sessionStorage.getItem("savedPage");
    const savedLang = sessionStorage.getItem("savedLang");

    if (savedLang) setLanguage(savedLang);

    if (savedSearch) {
      const parts = savedSearch.split(" inpublisher:");
      setQuery(parts[0].replace("subject:", "")); 
      
      performSearch(savedSearch, savedPage ? parseInt(savedPage) : 0, savedLang || "es");
    } else {
      performSearch("subject:fiction", 0, "es");
    }
  }, []);

  const handleSearchClick = () => {
    if (!query.trim() && !publisher.trim()) {
        toast.warning("Ingresa un título o editorial para buscar.");
        return;
    }
    
    let finalSearchTerm = query.trim();
    
    if (publisher.trim()) {
      if (finalSearchTerm) {
          finalSearchTerm += ` inpublisher:${publisher.trim()}`;
      } else {
          finalSearchTerm = `inpublisher:${publisher.trim()}`;
      }
    }
    
    performSearch(finalSearchTerm, 0, language);
  };

  const handleLanguageChange = (e) => {
      const newLang = e.target.value;
      if (!newLang) return;
      
      setLanguage(newLang);

      if (currentSearch) {
          performSearch(currentSearch, 0, newLang);
      }
  };

  // --- GUARDAR LIBRO ---
  const handleSave = async (bookData) => {
    try {
      let cleanDate = bookData.publishedDate || "2000-01-01";
      if (cleanDate.length === 4) cleanDate = `${cleanDate}-01-01`;
      if (cleanDate.length === 7) cleanDate = `${cleanDate}-01`;

      const payload = {
        googleId: bookData.googleId || bookData.id,
        title: (bookData.title || "Sin título").substring(0, 200),
        authors: (bookData.authors || "Desconocido").substring(0, 500),
        imageUrl: (bookData.imageUrl || "").substring(0, 1900),
        description: bookData.description ? bookData.description.substring(0, 3000) : "Sin descripción",
        pageCount: bookData.pageCount || 0,
        publisher: (bookData.publisher || "Desconocido").substring(0, 200),
        publishedDate: cleanDate,
        isbn: bookData.isbn || "N/A",
        categories: bookData.categories || "General",
        language: bookData.language || "es",
        printType: bookData.printType || "BOOK",
        previewLink: bookData.previewLink || ""
      };

      await saveBookToLog(user.id, payload);

      toast.success(`"${payload.title}" guardado en tu biblioteca correctamente`);
    } catch (error) {
      toast.error("Error al guardar el libro");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">Explora el catálogo</h1>

          {/* BARRA DE BÚSQUEDA COMPLETA */}
          <div className="bg-[#141414] p-6 rounded-[32px] border border-white/5 shadow-2xl space-y-4">
            <div className="flex flex-wrap lg:flex-nowrap gap-4 items-end">
              
              {/* INPUT: BUSCADOR GENERAL */}
              <div className="flex-grow min-w-[300px]">
                <p className="text-[10px] font-bold text-gray-500 ml-4 mb-2 uppercase tracking-widest">Buscador</p>
                <Input
                  aria-label="Buscador principal"
                  placeholder="Título, autor o ISBN..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                  variant="flat"
                  radius="full"
                  size="lg"
                  className="dark shadow-sm"
                  isClearable
                  onClear={() => setQuery("")}
                />
              </div>

              {/* INPUT: EDITORIAL */}
              <div className="w-full lg:w-64">
                <p className="text-[10px] font-bold text-gray-500 ml-4 mb-2 uppercase tracking-widest">Editorial</p>
                <Input
                  aria-label="Filtro de editorial"
                  placeholder="Ej: Alfaguara..."
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                  variant="flat"
                  radius="full"
                  size="lg"
                  className="dark shadow-sm"
                  isClearable
                  onClear={() => setPublisher("")}
                />
              </div>

              {/* SELECT: IDIOMA */}
              <div className="w-44">
                <p className="text-[10px] font-bold text-gray-500 ml-4 mb-2 uppercase tracking-widest">Idioma</p>
                <Select
                  aria-label="Selección de idioma"
                  size="lg"
                  variant="flat"
                  radius="full"
                  classNames={{
                    base: "dark",
                    trigger: "bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white",
                    value: "text-white font-medium",
                    listbox: "bg-[#1f1f1f] text-white",
                    popoverContent: "bg-[#1f1f1f] border border-gray-800",
                  }}
                  selectedKeys={[language]}
                  onChange={handleLanguageChange}
                >
                  <SelectItem key="es" textValue="Español">Español 🇪🇸</SelectItem>
                  <SelectItem key="en" textValue="Inglés">Inglés 🇺🇸</SelectItem>
                </Select>
              </div>

              {/* BOTÓN BUSCAR */}
              <Button
                color="primary"
                size="lg"
                radius="full"
                onPress={handleSearchClick}
                isLoading={loading}
                className="font-bold px-10 shadow-lg shadow-blue-900/20 h-[48px]"
              >
                Buscar
              </Button>
            </div>
          </div>
        </header>

        {/* --- SECCIÓN DE CATEGORÍAS ELIMINADA COMO PEDISTE --- */}

        {/* RESULTADOS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {[1, 2, 3, 4, 5, 6].map((i) => <BookSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {books.length === 0 ? (
              <div className="text-center py-20 bg-[#111] rounded-3xl border-2 border-dashed border-white/5">
                <p className="text-gray-500 font-medium tracking-tight">No se encontraron resultados para esta búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                {books.map((book, index) => (
                  <BookCard
                    key={`${book.googleId || book.id || index}`}
                    book={book}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}

            {/* PAGINACIÓN */}
            {books.length > 0 && (
              <div className="flex justify-center items-center gap-6 py-10">
                <Button
                  variant="light"
                  isDisabled={page === 0}
                  onPress={() => performSearch(currentSearch, page - 1, language)}
                  className="rounded-full font-bold text-gray-400"
                >
                  ← Anterior
                </Button>
                <div className="bg-blue-900/20 px-6 py-2 rounded-full border border-blue-500/20">
                  <span className="text-blue-400 font-black text-xs uppercase">PÁGINA {page + 1}</span>
                </div>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => performSearch(currentSearch, page + 1, language)}
                  className="rounded-full px-8 font-bold"
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}