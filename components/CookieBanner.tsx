'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Comprobamos si el usuario ya aceptó o rechazó las cookies previamente
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const aceptarCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const rechazarCookies = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#2a0a4a] text-white p-4 shadow-2xl border-t-2 border-purple-500 flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
      <div className="text-sm max-w-4xl">
        <p>
          Utilizamos cookies propias y de terceros para fines técnicos y analíticos. Puedes obtener más información en nuestra{' '}
          <Link href="/privacidad" className="underline text-pink-300 hover:text-white font-semibold">
            Política de Privacidad
          </Link>.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={rechazarCookies}
          className="bg-transparent border border-white hover:bg-white/10 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
        >
          Rechazar
        </button>
        <button
          onClick={aceptarCookies}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm font-bold transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
