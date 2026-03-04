import React, { useState, useEffect } from "react";
import { Card, Image, Button } from "@heroui/react";

export default function BookCard({ book, onSave, actionLabel = "Guardar", actionColor = "primary" }) {
  if (!book) return null;

  const [imgSrc, setImgSrc] = useState(book.imageUrl || "/no-portada.png");

  useEffect(() => {
    const urlGoogle = book.imageUrl;
    if (urlGoogle && urlGoogle !== "" && !urlGoogle.includes("placehold.co") && !urlGoogle.includes("text=Sin+Portada")) {
      setImgSrc(urlGoogle);
    } else {
      setImgSrc("/no-portada.png");
    }
  }, [book.imageUrl]);

  const handleError = () => setImgSrc("/no-portada.png");

  const autores = Array.isArray(book.authors) 
    ? book.authors.join(", ") 
    : (book.authors || "Autor Desconocido");

  return (
    /* ALTURA INTERMEDIA: h-48 (aprox 192px) */
    <Card className="flex-row w-full bg-[#121212] border border-white/5 shadow-xl hover:bg-[#1a1a1a] transition-all h-auto sm:h-45 overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: Ancho de imagen balanceado */}
      <div className="w-28 sm:w-36 shrink-0 bg-black flex items-center justify-center p-0 overflow-hidden border-r border-white/5">
        <Image
          alt={book.title || "Libro"}
          src={imgSrc}
          onError={handleError}
          removeWrapper
          className="w-full h-full object-cover aspect-[2/3] rounded-none opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* SECCIÓN DERECHA: Contenido con mejor espaciado */}
      <div className="flex flex-col flex-grow p-4 justify-between overflow-hidden bg-gradient-to-br from-transparent to-black/20">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-grow">
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-tight tracking-tight">
                {book.title || "Título Desconocido"}
              </h3>
              <p className="text-xs text-blue-400 font-medium mt-1 line-clamp-1"> {autores}</p>
            </div>
            
            <Button 
              color={actionColor} 
              size="sm" 
              variant="shadow"
              className="font-bold shrink-0 rounded-full text-[11px] h-8 px-4"
              onPress={() => onSave && onSave(book)}
            >
              {actionLabel}
            </Button>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {book.description ? book.description.replace(/<[^>]*>?/gm, '') : "Sin descripción disponible."}
          </p>
        </div>

        {/* METADATOS ABAJO */}
        <div className="mt-3 flex flex-row justify-between items-end border-t border-white/10 pt-2">
          <div className="flex flex-col">
             <p className="text-[11px] text-gray-500">
                {book.publisher || "S/E"} • {book.publishedDate ? book.publishedDate.substring(0, 4) : "-"}
             </p>
          </div>
          
          {book.previewLink && (
            <Button
              as="a" href={book.previewLink} target="_blank"
              size="sm" variant="light" color="primary"
              className="font-bold shrink-0 text-xs h-7"
              endContent={<span>❯</span>}
            >
              Google
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}