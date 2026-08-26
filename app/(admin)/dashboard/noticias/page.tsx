'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from '@/components/EditorToolbar';

interface NoticiaItem {
  id: string;
  titulo: string;
  cuerpo: string;
  imagenUrl: string;
  fecha: any;
}

export default function GestionNoticiasPage() {
  const [titulo, setTitulo] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  
  // Estados para el modo edición
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [imagenUrlExistente, setImagenUrlExistente] = useState<string>('');

  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [noticias, setNoticias] = useState<NoticiaItem[]>([]);

  // Configuración del Editor Visual TipTap
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[180px] p-4 border-2 border-[#4B0082] rounded-b focus:outline-none text-black bg-white',
      },
    },
  });

  const cargarNoticias = async () => {
    try {
      const q = query(collection(db, 'noticias'), orderBy('fecha', 'desc'));
      const snapshot = await getDocs(q);
      const lista: NoticiaItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          titulo: data.titulo,
          cuerpo: data.cuerpo,
          imagenUrl: data.imagenUrl,
          fecha: data.fecha,
        });
      });
      setNoticias(lista);
    } catch (error) {
      console.error('Error cargando noticias:', error);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleGuardarNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contenidoHtml = editor ? editor.getHTML() : '';
    if (!contenidoHtml.trim() || contenidoHtml === '<p></p>') {
      alert('El cuerpo de la noticia no puede estar vacío.');
      return;
    }

    setSubiendo(true);
    setMensaje('');

    try {
      let finalImagenUrl = imagenUrlExistente;

      // Si el usuario seleccionó una NUEVA imagen para reemplazar la portada
      if (imagen) {
        const storageRef = ref(storage, `noticias/${Date.now()}_${imagen.name}`);
        const snapshot = await uploadBytes(storageRef, imagen);
        finalImagenUrl = await getDownloadURL(snapshot.ref);
      }

      if (editandoId) {
        // MODO EDICIÓN
        const docRef = doc(db, 'noticias', editandoId);
        await updateDoc(docRef, {
          titulo,
          cuerpo: contenidoHtml,
          imagenUrl: finalImagenUrl,
        });
        setMensaje('¡Noticia actualizada correctamente!');
      } else {
        // MODO CREACIÓN: Es obligatorio que haya imagen nueva
        if (!imagen) {
          alert('Por favor, selecciona una imagen de portada para la nueva noticia.');
          setSubiendo(false);
          return;
        }
        const storageRef = ref(storage, `noticias/${Date.now()}_${imagen.name}`);
        const snapshot = await uploadBytes(storageRef, imagen);
        finalImagenUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, 'noticias'), {
          titulo,
          cuerpo: contenidoHtml,
          imagenUrl: finalImagenUrl,
          fecha: serverTimestamp(),
        });
        setMensaje('¡Noticia publicada con éxito!');
      }

      limpiarFormulario();
      cargarNoticias();
    } catch (error: any) {
      console.error('Error al guardar noticia:', error);
      setMensaje('Error: ' + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleEditarClick = (n: NoticiaItem) => {
    setEditandoId(n.id);
    setTitulo(n.titulo);
    setImagenUrlExistente(n.imagenUrl);
    setImagen(null);
    if (editor) {
      editor.commands.setContent(n.cuerpo);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setTitulo('');
    setImagen(null);
    setImagenUrlExistente('');
    if (editor) editor.commands.clearContent();
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    try {
      await deleteDoc(doc(db, 'noticias', id));
      cargarNoticias();
      setMensaje('Noticia eliminada correctamente.');
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-[#4B0082]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#4B0082]">
            {editandoId ? '✏️ Editando Noticia' : '📰 Publicar Nueva Noticia'}
          </h1>
          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Cancelar Edición
            </button>
          )}
        </div>

        {mensaje && (
          <div className={`p-4 mb-6 rounded font-bold ${mensaje.includes('éxito') || mensaje.includes('actualizada') || mensaje.includes('eliminado') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleGuardarNoticia} className="flex flex-col gap-6 max-w-2xl">
          <label className="text-black font-bold flex flex-col">
            Título de la Noticia
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none"
              placeholder="Ej. Jornada de puertas abiertas en Xarxa"
              required
            />
          </label>

          <label className="text-black font-bold flex flex-col">
            {editandoId ? 'Reemplazar imagen de portada (Opcional)' : 'Imagen de Portada'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImagen(e.target.files[0]);
                }
              }}
              className="mt-1 p-2 border-2 border-dashed border-[#4B0082] rounded text-black font-normal bg-gray-50 cursor-pointer"
              required={!editandoId}
            />
            {editandoId && <span className="text-xs text-gray-500 mt-1">Si no seleccionas ninguna imagen nueva, se mantendrá la portada actual.</span>}
          </label>

          <div className="flex flex-col">
            <label className="text-black font-bold mb-1">Cuerpo de la Noticia</label>
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>

          <button
            type="submit"
            disabled={subiendo}
            className="bg-[#4B0082] hover:bg-purple-900 text-white font-bold p-3 rounded transition-colors text-lg mt-2 disabled:opacity-50"
          >
            {subiendo ? 'Guardando...' : (editandoId ? 'Guardar Cambios' : 'Publicar Noticia')}
          </button>
        </form>
      </div>

      {/* Listado con opciones de Editar y Eliminar */}
      <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-[#4B0082]">
        <h2 className="text-2xl font-bold text-[#4B0082] mb-4">Noticias Publicadas</h2>
        {noticias.length === 0 ? (
          <p className="text-black">No hay noticias registradas.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {noticias.map((n) => (
              <div key={n.id} className="flex justify-between items-center border-b pb-4 gap-4">
                <div className="flex items-center gap-4">
                  <img src={n.imagenUrl} alt={n.titulo} className="w-16 h-16 object-cover rounded shadow" />
                  <div>
                    <h3 className="font-bold text-black text-lg">{n.titulo}</h3>
                    <p className="text-xs text-gray-500">ID: {n.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEditarClick(n)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-3 py-1 rounded text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(n.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1 rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
