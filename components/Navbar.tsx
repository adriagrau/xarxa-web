'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Menu, X, ChevronDown, FileText } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface DocumentoInfo {
  id: string;
  titulo: string;
  url: string;
}

interface SubmenuInfo {
  orden: number;
  documentos: DocumentoInfo[];
}

interface MenuInfo {
  orden: number;
  submenus: { [nombreSubmenu: string]: SubmenuInfo };
}

export default function Navbar() {
  const [menuEstructurado, setMenuEstructurado] = useState<{ [nombreMenu: string]: MenuInfo }>({});
  const [menuAbiertoDesktop, setMenuAbiertoDesktop] = useState<string | null>(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    const cargarMenusOrdenados = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'documentos'));
        const menusTemp: { [menu: string]: MenuInfo } = {};

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const nombreMenu = data.menu || 'General';
          const ordenMenu = data.ordenMenu ?? 1;
          const nombreSub = data.submenu || 'General';
          const ordenSub = data.ordenSubmenu ?? 1;

          if (!menusTemp[nombreMenu]) {
            menusTemp[nombreMenu] = { orden: ordenMenu, submenus: {} };
          }

          if (!menusTemp[nombreMenu].submenus[nombreSub]) {
            menusTemp[nombreMenu].submenus[nombreSub] = { orden: ordenSub, documentos: [] };
          }

          menusTemp[nombreMenu].submenus[nombreSub].documentos.push({
            id: docSnap.id,
            titulo: data.titulo,
            url: data.url,
          });
        });

        setMenuEstructurado(menusTemp);
      } catch (error) {
        console.error('Error ordenando menús:', error);
      }
    };

    cargarMenusOrdenados();
  }, []);

  const menusOrdenados = Object.keys(menuEstructurado).sort(
    (a, b) => menuEstructurado[a].orden - menuEstructurado[b].orden
  );

  return (
    <header className="sticky top-0 z-50 flex flex-col">
      {/* 1. Barra Superior Oscura */}
      <div className="bg-[#2a0a4a] text-white text-sm py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-pink-500" />
              <span>Calle Marqués de Elxe 17, 46018, València</span>
            </div>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <a href="mailto:info@asocxarxa.org" className="flex items-center gap-2 hover:text-pink-300 transition-colors">
              <Mail size={16} className="text-pink-500" />
              <span>info@asocxarxa.org</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/contacto" className="hover:text-pink-300 transition-colors font-semibold">
              Contacto
            </Link>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-3">
              <span className="mr-1">Síguenos</span>
              <a href="https://facebook.com/xarxadones" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com/xarxamujeres" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://linkedin.com/company/asociación-de-mujeres-con-discapacidad-xarxa" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Menú Principal */}
      <div className="bg-white shadow-md border-b-2 border-[#4B0082]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image 
              src="/logo.png" 
              alt="Logo Xarxa Mujeres" 
              width={200} 
              height={80} 
              className="object-contain h-14 w-auto"
              priority
            />
          </Link>

          {/* MENÚ ORDENADOR (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#4B0082] font-bold hover:text-purple-900 transition-colors">
              Inicio
            </Link>

            <Link href="/noticias" className="text-[#4B0082] font-bold hover:text-purple-900 transition-colors">
              Noticias
            </Link>

            {menusOrdenados.map((nombreMenu) => {
              const menuInfo = menuEstructurado[nombreMenu];
              const submenusOrdenados = Object.keys(menuInfo.submenus).sort(
                (a, b) => menuInfo.submenus[a].orden - menuInfo.submenus[b].orden
              );

              return (
                <div 
                  key={nombreMenu} 
                  className="relative group"
                  onMouseEnter={() => setMenuAbiertoDesktop(nombreMenu)}
                  onMouseLeave={() => setMenuAbiertoDesktop(null)}
                >
                  <button className="flex items-center gap-1 text-[#4B0082] font-bold hover:text-purple-900 py-2">
                    {nombreMenu}
                    <ChevronDown size={16} />
                  </button>

                  {menuAbiertoDesktop === nombreMenu && (
                    <div className="absolute left-0 mt-0 w-64 bg-white border-2 border-[#4B0082] rounded-md shadow-xl py-2 z-50">
                      {submenusOrdenados.map((nombreSub) => {
                        const submenuInfo = menuInfo.submenus[nombreSub];
                        return (
                          <div key={nombreSub} className="px-4 py-2">
                            {nombreSub !== 'General' && (
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                {nombreSub}
                              </p>
                            )}
                            <div className="flex flex-col gap-1">
                              {submenuInfo.documentos.map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-black hover:bg-purple-50 hover:text-[#4B0082] p-2 rounded flex items-center gap-2 transition-colors font-medium"
                                >
                                  <FileText size={14} className="text-[#4B0082] flex-shrink-0" />
                                  <span className="truncate">{doc.titulo}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* BOTÓN HAMBURGUESA MÓVIL */}
            <button 
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden text-[#4B0082] hover:bg-purple-100 p-2 rounded-md transition-colors"
              aria-label="Abrir menú"
            >
              {menuMovilAbierto ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. MENÚ DESPLEGABLE MÓVIL (Sin Acceso Admin visible) */}
      {menuMovilAbierto && (
        <div className="md:hidden bg-white border-b-2 border-[#4B0082] px-6 py-4 flex flex-col gap-4 shadow-xl">
          <Link 
            href="/" 
            onClick={() => setMenuMovilAbierto(false)}
            className="text-[#4B0082] font-bold text-lg py-1 border-b border-gray-100"
          >
            Inicio
          </Link>

          <Link 
            href="/noticias" 
            onClick={() => setMenuMovilAbierto(false)}
            className="text-[#4B0082] font-bold text-lg py-1 border-b border-gray-100"
          >
            Noticias
          </Link>

          {menusOrdenados.map((nombreMenu) => {
            const menuInfo = menuEstructurado[nombreMenu];
            const submenusOrdenados = Object.keys(menuInfo.submenus).sort(
              (a, b) => menuInfo.submenus[a].orden - menuInfo.submenus[b].orden
            );

            return (
              <div key={nombreMenu} className="flex flex-col gap-2 py-1 border-b border-gray-100">
                <span className="text-[#4B0082] font-bold text-lg">{nombreMenu}</span>
                <div className="pl-4 flex flex-col gap-2">
                  {submenusOrdenados.map((nombreSub) => {
                    const submenuInfo = menuInfo.submenus[nombreSub];
                    return (
                      <div key={nombreSub} className="flex flex-col gap-1">
                        {nombreSub !== 'General' && (
                          <span className="text-xs font-bold text-gray-400 uppercase">{nombreSub}</span>
                        )}
                        {submenuInfo.documentos.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuMovilAbierto(false)}
                            className="text-sm text-black hover:text-[#4B0082] py-1 flex items-center gap-2 font-medium"
                          >
                            <FileText size={14} className="text-[#4B0082]" />
                            <span>{doc.titulo}</span>
                          </a>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <Link 
            href="/contacto" 
            onClick={() => setMenuMovilAbierto(false)}
            className="text-[#4B0082] font-bold text-lg py-1 border-b border-gray-100"
          >
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
}
