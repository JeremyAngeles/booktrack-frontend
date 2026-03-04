import React from "react";
import { Card, Image, Button } from "@heroui/react";

export default function ReadingLogCard({ logEntry, onDelete }) {
  const { book } = logEntry;

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "TERMINADO": return "bg-green-600 text-white";
      case "EN_CURSO": return "bg-blue-600 text-white";
      case "POR_LEER": return "bg-gray-600 text-gray-200";
      default: return "bg-gray-600 text-white";
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-2xl ${star <= logEntry.rating ? "text-yellow-400" : "text-gray-700"}`}>
        ★
      </span>
    ));
  };

  if (!book) return null;

  return (
    <Card className="flex-col sm:flex-row w-full bg-[#18181b] border border-gray-800 shadow-xl overflow-hidden hover:border-gray-700 transition-colors">
      
      {/* Portada */}
      <div className="w-full sm:w-48 shrink-0 bg-black/40 flex items-center justify-center p-4">
        <Image
          alt={book.title}
          src={book.imageUrl || "https://placehold.co/400x600?text=Sin+Portada"}
          className="object-contain h-48 sm:h-56 rounded-md shadow-lg"
          removeWrapper
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
             <h3 className="text-xl font-bold text-white leading-tight">{book.title}</h3>
             <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(logEntry.status)}`}>
               {logEntry.status.replace("_", " ")}
             </span>
          </div>
          
          <p className="text-sm text-blue-400 font-semibold mt-1">{book.authors}</p>

          {/* --- SECCIÓN DE RESEÑA (NUEVO) --- */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-4 border-blue-500">
             <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tu Reseña:</p>
             <p className="text-sm text-gray-200 italic">
               {logEntry.review ? `"${logEntry.review}"` : "Aún no has escrito una reseña para este libro."}
             </p>
             {logEntry.favoriteParts && (
               <p className="text-xs text-gray-400 mt-2">
                 <span className="font-bold text-blue-300">Partes favoritas:</span> {logEntry.favoriteParts}
               </p>
             )}
          </div>

          {/* Información Detallada */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-400 mt-4 border-t border-gray-800 pt-3">
             <span>📅 {book.publishedDate?.substring(0,4) || "N/A"}</span>
             <span>📄 {book.pageCount || 0} págs</span>
             <span>🏢 {book.publisher || "S/E"}</span>
             <span>🌐 {book.language?.toUpperCase() || "ES"}</span>
             <span>🏷️ {book.categories || "General"}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-1">{renderStars()}</div>
          
          <Button 
            color="danger" 
            variant="light" 
            size="sm" 
            className="font-bold text-xs opacity-60 hover:opacity-100"
            onPress={() => onDelete(logEntry.idReading)}
          >
            🗑️ Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}