import React, { useState, useEffect } from "react";
import { Button, Textarea, Input, Select, SelectItem, Image, Card } from "@heroui/react";
import { updateReadingLog } from "../services/api";
import PriceTracker from "../components/PriceTracker";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [logEntry, setLogEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("TO_READ");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [favoriteParts, setFavoriteParts] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  useEffect(() => {
    const savedLog = sessionStorage.getItem("selectedLog");
    if (savedLog) {
      const data = JSON.parse(savedLog);
      setLogEntry(data);
      setStatus(data.status || "TO_READ");
      setRating(data.rating || 0);
      setReview(data.review || "");
      setFavoriteParts(data.favoriteParts || "");
      setStartDate(data.startDate ? data.startDate.split("T")[0] : "");
      setFinishDate(data.finishDate ? data.finishDate.split("T")[0] : "");
    } else {
      navigate("/mybooks");
    }
  }, [navigate]);

  if (!logEntry) return null;
  const { book } = logEntry;

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalStartDate = startDate === "" ? null : startDate;
      let finalFinishDate = finishDate === "" ? null : finishDate;
      let finalRating = rating === 0 ? null : rating;
      if (status === "TO_READ") {
          finalStartDate = null;
          finalFinishDate = null;
          finalRating = null; 
      }

      if (status === "READING") {
          if (!finalStartDate) {
              finalStartDate = new Date().toISOString().split('T')[0];
          }
          finalFinishDate = null; 
          finalRating = null;    
      }

      if (status === "FINISHED") {
          if (!finalFinishDate) {
              toast.error("Por favor, ingresa la fecha de término.");
              setLoading(false);
              return;
          }
          if (!finalRating) {
              toast.error("Por favor, califica el libro con estrellas.");
              setLoading(false);
              return;
          }
        
          if (!finalStartDate) {
              finalStartDate = finalFinishDate; 
          }

          if (new Date(finalFinishDate) < new Date(finalStartDate)) {
              toast.error("Error: La fecha de término es anterior a la de inicio.");
              setLoading(false);
              return; 
          }
      }

      const payload = {
        status, 
        rating: finalRating, 
        review: status === "FINISHED" ? review : "", 
        favoriteParts: favoriteParts || "",
        startDate: finalStartDate,
        finishDate: finalFinishDate
      };

      console.log("Enviando Payload:", payload); 

      await updateReadingLog(logEntry.idReading, payload);
      toast.success("¡Guardado correctamente!");
      
      sessionStorage.removeItem("selectedLog");
      navigate("/mybooks");

    } catch (error) {
      console.error("Error completo:", error);
      
      if (error.response && error.response.data) {
          const data = error.response.data;
          if (typeof data === 'string') {
              toast.error(`Error: ${data}`);
          } else if (data.message) {
              toast.error(`Error: ${data.message}`);
          } else {
              toast.error("Datos inválidos.");
          }
      } else {
          toast.error("Error de conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button" 
        onClick={() => status === "FINISHED" && setRating(star)}
        className={`text-3xl transition-transform ${status === "FINISHED" ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-30"} focus:outline-none ${
          star <= rating ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : "text-gray-700"
        }`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="light" 
          onPress={() => navigate("/mybooks")} 
          className="mb-10 font-bold text-blue-400 hover:bg-blue-500/10 rounded-full px-6"
        >
          ← Volver a Mis Libros
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* INFO DEL LIBRO */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative group">
               <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-20"></div>
               <Image
                src={book.imageUrl || "https://placehold.co/400x600?text=Sin+Portada"}
                alt={book.title}
                className="relative rounded-[19px] shadow-2xl w-[180px] h-auto object-cover z-10 border border-white/5 mb-6"
              />
            </div>
            <h2 className="text-2xl font-black text-center tracking-tighter uppercase leading-tight">{book.title}</h2>
            <p className="text-blue-500 font-semibold text-lg mt-2 text-center opacity-80">{book.authors}</p>
          </div>

          {/* FORMULARIO */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#111] border border-white/5 p-8 rounded-[40px] shadow-2xl">
              <h3 className="text-3xl font-black mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic">
                Bitácora de Lectura ✍️
              </h3>

              <div className="space-y-8">
                {/* ESTADO Y RATING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 ml-4 uppercase tracking-widest">Estado Actual</label>
                    <Select 
                      selectedKeys={[status]} 
                      onChange={(e) => {
                          const newStatus = e.target.value;
                          setStatus(newStatus);
                          if (newStatus !== "FINISHED") {
                              setRating(0);
                              setFinishDate("");
                          }
                          if (newStatus === "READING" && !startDate) {
                              setStartDate(new Date().toISOString().split('T')[0]);
                          }
                      }}
                      variant="flat" radius="full" size="lg" className="dark"
                    >
                      <SelectItem key="TO_READ">📚 Por Leer</SelectItem>
                      <SelectItem key="READING">👓 Leyendo</SelectItem>
                      <SelectItem key="FINISHED">✅ Terminado</SelectItem>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 ml-4 uppercase tracking-widest text-center md:text-left">Tu Calificación</label>
                    <div className="flex gap-2 p-3 bg-white/5 rounded-full border border-white/5 justify-center md:justify-start px-6">
                      {renderStars()}
                    </div>
                  </div>
                </div>

                {/* FECHAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                  <Input type="date" label="Fecha de Inicio" variant="flat" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="dark" />
                  <Input type="date" label="Fecha de Término" variant="flat" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} isDisabled={status !== "FINISHED"} className="dark opacity-80" />
                </div>

                {/* TEXTOS */}
                <div className="space-y-6">
                  <Textarea label="Tu Reseña" variant="flat" radius="2xl" minRows={4} value={review} onChange={(e) => setReview(e.target.value)} isDisabled={status !== "FINISHED"} className="dark" placeholder={status !== "FINISHED" ? "Disponible al terminar..." : "Escribe aquí..."} />
                  <Textarea label="Citas Favoritas" variant="flat" radius="2xl" minRows={2} value={favoriteParts} onChange={(e) => setFavoriteParts(e.target.value)} className="dark" />
                </div>

                {/* GUARDAR */}
                <Button size="lg" color="primary" radius="full" className="w-full font-black text-lg h-16 shadow-xl mt-4 bg-blue-600 hover:bg-blue-500" onPress={handleSave} isLoading={loading}>
                  Guardar Cambios
                </Button>
              </div>
            </Card>
            <div className="mt-10"><PriceTracker bookId={book.id} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}