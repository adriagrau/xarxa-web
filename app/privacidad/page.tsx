export default function PrivacidadPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 sm:p-12 border-t-4 border-[#4B0082]">
        <h1 className="text-3xl font-bold text-[#4B0082] mb-6">
          Política de Privacidad y Protección de Datos
        </h1>

        <div className="flex flex-col gap-6 text-black font-normal leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#4B0082] mb-2">1. Responsable del Tratamiento</h2>
            <p>
              Asociación Xarxa Mujeres con Discapacidad<br />
              Calle Marqués de Elxe 17, 46018, València<br />
              Correo electrónico de contacto: info@asocxarxa.org
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#4B0082] mb-2">2. Finalidad del tratamiento de datos</h2>
            <p>
              Los datos personales facilitados a través de los formularios de contacto o subida de documentación serán tratados con la única finalidad de gestionar las consultas recibidas, la relación institucional y el acceso a los servicios de la asociación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#4B0082] mb-2">3. Legitimación</h2>
            <p>
              El tratamiento de tus datos se realiza en base al consentimiento explícito del usuario al enviar sus consultas o aceptar las condiciones de navegación de la web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#4B0082] mb-2">4. Derechos de los usuarios</h2>
            <p>
              Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando datos que les conciernan, así como a acceder, rectificar o solicitar su supresión dirigiéndose a info@asocxarxa.org.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
