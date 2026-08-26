'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // El "vigilante": comprobamos si Firebase reconoce al usuario
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Si no hay usuario legítimo, lo expulsamos al login
        router.push('/login');
      } else {
        // Si todo está bien, quitamos la pantalla de carga
        setCargando(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleCerrarSesion = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#4B0082] font-bold text-2xl">Verificando seguridad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Menú lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-[#4B0082] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 font-bold text-2xl border-b-2 border-purple-900">
          Panel Xarxa
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-4">
          <Link href="/dashboard" className="hover:bg-purple-700 p-3 rounded font-bold transition-colors">
            Inicio del Panel
          </Link>
          <Link href="/dashboard/noticias" className="hover:bg-purple-700 p-3 rounded font-bold transition-colors">
            Gestión de Noticias
          </Link>
          <Link href="/dashboard/documentos" className="hover:bg-purple-700 p-3 rounded font-bold transition-colors">
            Subir PDFs
          </Link>
        </nav>
        <div className="p-6 border-t-2 border-purple-900">
          <button 
            onClick={handleCerrarSesion}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal de cada pantalla */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
