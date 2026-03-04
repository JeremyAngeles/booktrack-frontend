import React, { useState, useEffect } from "react";
import { Spinner, Input, Select, SelectItem, Button, Card, Tabs, Tab } from "@heroui/react"; 
import { getMyReadingLog, searchMyBooksByTitle, searchMyBooksByAuthor, getBookPrices, deleteLogEntry } from "../services/api"; 
import ReadingLogCard from "../components/ReadingLogCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

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
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [bookId, user.id]);

  if (loading) return <Spinner size="sm" color="success" />;
  if (prices.length === 0) return <p className="text-[10px] text-gray-600 italic">Sin precios registrados</p>;

  return (
    <div className="space-y-3">
      {prices.map((p) => (
        <div key={p.idPrice} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col gap-2 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{p.storeName}</span>
              <span className="text-[8px] text-gray-500">{new Date(p.seenAt).toLocaleDateString()}</span>
            </div>
            <span className="text-sm font-black text-green-400">
              {p.currency === "PEN" ? "S/" : "$"} {p.price}
            </span>
          </div>
          {p.storeLink && (
            <Button 
              as="a" href={p.storeLink} target="_blank" rel="noopener noreferrer"
              size="sm" variant="flat" color="primary"
              className="w-full h-7 text-[9px] font-bold uppercase rounded-lg bg-blue-600/10 hover:bg-blue-600 hover:text-white"
            >
              Ir a Tienda ↗
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default function MyBooks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [selectedTab, setSelectedTab] = useState("todos");

  const STATUS_LABELS = {
    TO_READ: "Por leer",
    READING: "Leyendo",
    FINISHED: "Terminado"
  };

  useEffect(() => {
    if (user?.id) fetchMyBooks();
  }, [user]);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const data = await getMyReadingLog(user.id);
      setLogs(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };
  const handleDeleteLog = async (idReading) => {
    try {
      await deleteLogEntry(idReading);
      toast.success("Libro eliminado de tu biblioteca");
      fetchMyBooks(); 
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el libro");
    }
  };

  const handleGoToReview = (logEntry) => {
    sessionStorage.setItem("selectedLog", JSON.stringify(logEntry));
    navigate("/review");
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim().length > 1) {
      try {
        let results = searchType === "title" 
          ? await searchMyBooksByTitle(user.id, value) 
          : await searchMyBooksByAuthor(user.id, value);
        setLogs(results);
      } catch (e) { console.error(e); }
    } else if (value.trim() === "") {
      fetchMyBooks();
    }
  };

  const getFilteredLogs = () => {
      if (selectedTab === "todos") return logs;
      return logs.filter(log => log.status === selectedTab);
  };

  const displayedLogs = getFilteredLogs();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-6xl font-[1000] bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent uppercase tracking-[calc(-0.05em)] mb-2 italic leading-none">
            Mi Biblioteca
          </h1>
          <p className="text-gray-500 font-medium text-lg">Gestiona tus lecturas y precios guardados.</p>
        </header>

        <div className="mb-8">
            <Tabs 
                aria-label="Filtro de Estados" 
                color="primary" 
                variant="underlined"
                size="lg"
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab}
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
                    cursor: "w-full bg-blue-500",
                    tab: "max-w-fit px-2 h-12",
                    tabContent: "group-data-[selected=true]:text-blue-400 font-bold text-gray-400"
                }}
            >
                <Tab key="todos" title="Todos" />
                <Tab key="TO_READ" title={<div className="flex items-center gap-2">🔵 <span>Por Leer</span></div>}/>
                <Tab key="READING" title={<div className="flex items-center gap-2">🟢 <span>Leyendo</span></div>}/>
                <Tab key="FINISHED" title={<div className="flex items-center gap-2">🔴 <span>Terminado</span></div>}/>
            </Tabs>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-16 bg-[#111] p-6 rounded-[32px] border border-white/5 shadow-2xl items-center">
          <div className="w-full md:w-60">
            <Select label="Filtrar por" variant="flat" className="dark" selectedKeys={[searchType]} onChange={(e) => setSearchType(e.target.value)}>
                <SelectItem key="title">Título</SelectItem>
                <SelectItem key="author">Autor</SelectItem>
            </Select>
          </div>
          <div className="flex-grow w-full">
            <Input placeholder="Escribe para buscar un libro..." variant="flat" radius="full" size="lg" value={searchTerm} onValueChange={handleSearch} className="dark" isClearable onClear={() => handleSearch("")} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" color="primary" /></div>
        ) : (
          <div className="flex flex-col gap-10">
            {displayedLogs.length === 0 ? (
                 <div className="text-center py-20 bg-[#111] rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-lg">No hay libros en la sección "{selectedTab === 'todos' ? 'Todos' : STATUS_LABELS[selectedTab]}".</p>
                 </div>
            ) : (
                displayedLogs.map((logEntry) => (
                <div key={logEntry.idReading} className="flex flex-col lg:flex-row gap-6 group">
                    <div className="flex-grow flex flex-col gap-4 relative">
                      <Card className="bg-[#111] border border-white/5 rounded-[40px] p-2 shadow-xl relative overflow-visible">
                          {/* Pasamos handleDeleteLog a la prop onDelete del componente hijo */}
                          <ReadingLogCard logEntry={logEntry} onDelete={() => handleDeleteLog(logEntry.idReading)} />
                      </Card>

                      <Button 
                        size="lg" color="primary" radius="full" 
                        className="w-full font-black text-sm uppercase tracking-widest bg-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.2)] h-14 hover:scale-[1.01] transition-all"
                        onPress={() => handleGoToReview(logEntry)}
                      >
                        Editar Experiencia
                      </Button>
                    </div>

                    <div className="w-full lg:w-72 flex flex-col gap-4">
                      <div className="bg-[#111] p-6 rounded-[32px] border border-white/5 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Tu Valoración</p>
                        <div className="flex gap-1 text-2xl">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={s <= (logEntry.rating || 0) ? "text-yellow-400" : "text-gray-800"}>★</span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#111] p-6 rounded-[32px] border border-white/5 overflow-hidden">
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Precios Guardados</p>
                        <PriceListStatic bookId={logEntry.book?.id || logEntry.googleId} />
                      </div>
                    </div>
                </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}