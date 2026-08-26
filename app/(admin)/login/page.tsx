'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation'; // <-- Descomentado

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // <-- Descomentado

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Si el login es correcto, enviamos al usuario al panel
      router.push('/dashboard'); // <-- Descomentado
    } catch (err: any) {
      setError('Credenciales incorrectas o usuario no encontrado.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-[#4B0082] border-x-2 border-b-2 border-x-[#4B0082]/10 border-b-[#4B0082]/10">
        <h1 className="text-2xl font-bold text-center text-[#4B0082] mb-6">
          Acceso Privado
        </h1>
        
        {error && (
          <p className="text-red-700 font-bold text-sm mb-4 text-center bg-red-100 p-2 rounded">{error}</p>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <label className="text-black font-bold flex flex-col">
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              required
            />
          </label>
          <label className="text-black font-bold flex flex-col">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-[#4B0082] text-white p-3 rounded hover:bg-purple-900 transition-colors font-bold mt-2 text-lg"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
