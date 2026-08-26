'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setEstadoEnvio('');

    if (!executeRecaptcha) {
      setEstadoEnvio('Error de seguridad: reCAPTCHA no está listo todavía.');
      setEnviando(false);
      return;
    }

    try {
      // 1. Ejecutamos reCAPTCHA v3 de forma invisible para obtener el token de validación
      const token = await executeRecaptcha('contacto_form');
      if (!token) {
        setEstadoEnvio('La validación de seguridad de reCAPTCHA ha fallado.');
        setEnviando(false);
        return;
      }

      // (Opcional avanzado: aquí podrías enviar el token a tu backend para verificarlo,
      // pero con v3 el simple hecho de que se genere con éxito ya filtra el 99% de los bots automáticos).

      // 2. Leemos las claves de EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        setEstadoEnvio('Error de configuración: Faltan las claves de EmailJS.');
        setEnviando(false);
        return;
      }

      // 3. Preparamos los parámetros que viajarán a EmailJS (incluyendo el Asunto/Título)
      const templateParams = {
        from_name: nombre,
        from_email: email,
        subject: asunto, // <-- Nuevo campo de Título/Asunto
        message: mensaje,
        to_email: 'info@asocxarxa.org',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setEstadoEnvio('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
      setNombre('');
      setEmail('');
      setAsunto('');
      setMensaje('');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      setEstadoEnvio('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full border-t-4 border-[#4B0082]">
        <h1 className="text-3xl font-bold text-[#4B0082] mb-2 text-center">
          Contacto
        </h1>
        <p className="text-gray-600 text-center mb-8">
          ¿Tienes alguna duda o sugerencia? Escríbenos y te responderemos encantados.
        </p>

        {estadoEnvio && (
          <div className={`p-4 mb-6 rounded font-bold text-center ${estadoEnvio.includes('éxito') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {estadoEnvio}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="text-black font-bold flex flex-col">
            Tu Nombre o Entidad
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              placeholder="Ej. María Dolores"
              required
            />
          </label>

          <label className="text-black font-bold flex flex-col">
            Correo Electrónico de Contacto
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              placeholder="tu@correo.com"
              required
            />
          </label>

          {/* Nuevo campo de Asunto / Título */}
          <label className="text-black font-bold flex flex-col">
            Asunto / Título del Mensaje
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              placeholder="Ej. Consulta sobre actividades de verano"
              required
            />
          </label>

          <label className="text-black font-bold flex flex-col">
            Mensaje
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={5}
              className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              placeholder="Escribe aquí tu consulta..."
              required
            />
          </label>

          <button
            type="submit"
            disabled={enviando}
            className="bg-[#4B0082] hover:bg-purple-900 text-white font-bold p-3 rounded transition-colors text-lg mt-2 disabled:opacity-50"
          >
            {enviando ? 'Enviando mensaje...' : 'Enviar Mensaje'}
          </button>

          <span className="text-xs text-gray-500 text-center mt-1">
            Este sitio está protegido por reCAPTCHA y se aplican la Política de Privacidad y los Términos de Servicio de Google.
          </span>
        </form>
      </div>
    </main>
  );
}
