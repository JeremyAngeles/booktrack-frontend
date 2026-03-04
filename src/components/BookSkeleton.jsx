import React from "react";
import { Card, Skeleton } from "@heroui/react";

export default function BookSkeleton() {
  return (
    <Card className="flex-row w-full bg-[#18181b] border border-gray-800 shadow-md h-auto sm:h-56 overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: ESPACIO DE LA FOTO */}
      <div className="w-32 sm:w-40 shrink-0 p-3 flex items-center justify-center">
        <Skeleton className="w-full h-40 sm:h-48 rounded-md" />
      </div>

      {/* SECCIÓN DERECHA: CONTENIDO */}
      <div className="flex flex-col flex-grow p-4 justify-between">
        <div className="space-y-3">
          {/* Título y Autor */}
          <div className="flex justify-between items-start">
            <div className="w-full space-y-2">
              <Skeleton className="w-3/4 h-5 rounded-lg" />
              <Skeleton className="w-1/2 h-3 rounded-lg" />
            </div>
            {/* Espacio del botón superior */}
            <Skeleton className="w-20 h-8 rounded-lg shrink-0" />
          </div>
          
          {/* Descripción (3 líneas) */}
          <div className="space-y-2 mt-4">
            <Skeleton className="w-full h-3 rounded-lg" />
            <Skeleton className="w-full h-3 rounded-lg" />
            <Skeleton className="w-4/5 h-3 rounded-lg" />
          </div>
        </div>

        {/* Footer de la tarjeta */}
        <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-3">
          <Skeleton className="w-1/3 h-3 rounded-lg" />
          <Skeleton className="w-24 h-6 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}