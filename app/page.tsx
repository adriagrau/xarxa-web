import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center p-4 sm:p-8 bg-gray-50">
      
      {/* Contenedor del cartel con sombra y bordes redondeados */}
      <div className="w-full max-w-5xl mx-auto flex justify-center shadow-2xl rounded-xl overflow-hidden bg-white">
        <Image 
          src="/cartel.png" 
          alt="Cartel informativo de Xarxa Mujeres"
          width={1200}
          height={800}
          className="w-full h-auto object-contain"
          priority // Le dice a Next.js que cargue esta imagen lo más rápido posible
        />
      </div>

    </main>
  );
}