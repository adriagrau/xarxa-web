import Image from 'next/image';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full flex flex-col mt-auto">
      {/* 1. Franja blanca superior con los dos bloques de logos */}
      <div className="bg-white w-full py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo 1: Generalitat y Fondos Europeos */}
          <Image
            src="/Logos.png"
            alt="Logos institucionales Generalitat y Fondos Europeos"
            width={600}
            height={80}
            className="object-contain h-14 sm:h-16 w-auto"
          />
          
          {/* Logo 2: Gobierno de España y Agenda 2030 */}
          <Image
            src="/logos2.png"
            alt="Logos institucionales Gobierno de España y Agenda 2030"
            width={600}
            height={80}
            className="object-contain h-14 sm:h-16 w-auto"
          />
          
        </div>
      </div>

      {/* 2. Zona principal oscura del Footer */}
      <div className="bg-[#2a0a4a] text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Columna Izquierda: Sello Utilidad Pública */}
          <div className="flex justify-center md:justify-start md:pl-10">
            <Image
              src="/utilidad-publica.png"
              alt="Sello Asociación Declarada de Utilidad Pública"
              width={220}
              height={220}
              className="object-contain"
            />
          </div>

          {/* Columna Derecha: Datos de Contacto */}
          <div className="flex flex-col gap-6 md:pl-10">
            <div>
              <h3 className="text-2xl font-bold mb-2">Contacto</h3>
              {/* Pequeña línea decorativa debajo del título */}
              <div className="w-8 h-1 bg-purple-500 rounded"></div>
            </div>

            <div className="flex flex-col gap-6 text-gray-200 font-light">
              {/* Dirección */}
              <div className="flex items-start gap-4">
                <MapPin className="text-[#c084fc] mt-1 flex-shrink-0" size={22} />
                <p>
                  Calle Marques De Elche 17, 46018<br/>
                  València
                </p>
              </div>

              {/* Teléfono y Email */}
              <div className="flex items-start gap-4">
                <Phone className="text-[#c084fc] mt-1 flex-shrink-0" size={22} />
                <p>
                  Teléfono: +34 963 577 092<br/>
                  Email: Info@Asocxarxa.Org
                </p>
              </div>

              {/* Horario */}
              <div className="flex items-start gap-4">
                <Clock className="text-[#c084fc] mt-1 flex-shrink-0" size={22} />
                <p>
                  Lunes – Viernes: 9:00 – 14:00<br/>
                  Sábados y Domingos: Cerrado
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Línea divisoria y Copyright */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-purple-800 text-sm text-gray-400">
          <p>Copyright © 2025 XARXAMUJERES. Todos Los Derechos Reservados.</p>
        </div>
      </div>
    </footer>
  );
}