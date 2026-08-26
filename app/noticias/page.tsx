'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';

interface NoticiaPublica {
  id: string;
  titulo: string;
  cuerpo: string;
  imagenUrl: string;
  fecha: any;
}

export default function NoticiasPublicasPage() {
  const [noticias, setNoticias] = useState<NoticiaPublica[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNoticiasWeb = async () => {
      try {
        const q = query(collection(db, 'noticias'), orderBy('fecha', 'desc'));
        const snapshot = await getDocs(q);
        const lista: NoticiaPublica[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            titulo: data.titulo,
            cuerpo: data.cuerpo,
            imagenUrl: data.imagenUrl,
            fecha: data.fecha ? data.fecha.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Reciente',
          });
        });
        setNoticias(lista);
      } catch (error) {
        console.error('Error al cargar noticias públicas:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarNoticiasWeb();
  }, []);

  return (
    <main className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#4B0082] mb-2 text-center">
          Noticias y Actualidad
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Entérate de todas las novedades, eventos y actividades de la asociación.
        </p>

        {cargando ? (
          <p className="text-center text-gray-500">Cargando noticias...</p>
        ) : noticias.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-black font-medium">No hay noticias publicadas en este momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {noticias.map((noticia) => (
              <article key={noticia.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <img 
                    src={noticia.imagenUrl} 
                    alt={noticia.titulo} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {noticia.fecha}
                    </span>
                    <h2 className="text-2xl font-bold text-[#4B0082] mt-3 mb-4">
                      {noticia.titulo}
                    </h2>
                    {/* Renderizamos el cuerpo interpretando etiquetas HTML básicas como negritas o párrafos */}
                    <div 
                      className="text-black font-normal leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{ __html: noticia.cuerpo }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
