'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DocumentoItem {
  id: string;
  titulo: string;
  menu: string;
  ordenMenu: number;
  submenu: string;
  ordenSubmenu: number;
  url: string;
}

export default function SubirDocumentosPage() {
  const [titulo, setTitulo] = useState('');
  const [menu, setMenu] = useState('');
  const [ordenMenu, setOrdenMenu] = useState('1');
  const [submenu, setSubsubmenu] = useState('');
  const [ordenSubmenu, setOrdenSubmenu] = useState('1');
  const [archivo, setArchivo] = useState<File | null>(null);
  
  // Estados para controlar si estamos editando un documento existente
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [urlExistente, setUrlExistente] = useState<string>('');

  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [documentos, setDocumentos] = useState<DocumentoItem[]>([]);

  const cargarDocumentos = async () => {
    try {
      const q = query(collection(db, 'documentos'), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      const lista: DocumentoItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          titulo: data.titulo,
          menu: data.menu,
          ordenMenu: data.ordenMenu ?? 1,
          submenu: data.submenu || 'General',
          ordenSubmenu: data.ordenSubmenu ?? 1,
          url: data.url,
        });
      });
      setDocumentos(lista);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu.trim()) {
      alert('Debes indicar un Menú Principal.');
      return;
    }

    setSubiendo(true);
    setMensaje('');

    try {
      let finalUrl = urlExistente;

      // Si el usuario ha seleccionado un NUEVO archivo PDF para reemplazar el anterior
      if (archivo) {
        const storageRef = ref(storage, `pdfs/${Date.now()}_${archivo.name}`);
        const snapshot = await uploadBytes(storageRef, archivo);
        finalUrl = await getDownloadURL(snapshot.ref);
      }

      if (editandoId) {
        // MODO EDICIÓN: Actualizamos el documento existente en Firestore
        const docRef = doc(db, 'documentos', editandoId);
        await updateDoc(docRef, {
          titulo,
          menu: menu.trim(),
          ordenMenu: parseInt(ordenMenu) || 1,
          submenu: submenu.trim() !== '' ? submenu.trim() : 'General',
          ordenSubmenu: parseInt(ordenSubmenu) || 1,
          url: finalUrl,
        });
        setMensaje('¡Documento actualizado correctamente!');
      } else {
        // MODO CREACIÓN: Obligatorio que haya un archivo nuevo
        if (!archivo) {
          alert('Por favor, selecciona un archivo PDF para subir.');
          setSubiendo(false);
          return;
        }
        const storageRef = ref(storage, `pdfs/${Date.now()}_${archivo.name}`);
        const snapshot = await uploadBytes(storageRef, archivo);
        finalUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, 'documentos'), {
          titulo,
          menu: menu.trim(),
          ordenMenu: parseInt(ordenMenu) || 1,
          submenu: submenu.trim() !== '' ? submenu.trim() : 'General',
          ordenSubmenu: parseInt(ordenSubmenu) || 1,
          url: finalUrl,
          fecha: serverTimestamp(),
        });
        setMensaje('¡PDF subido y ordenado con éxito!');
      }

      // Limpiar formulario y salir del modo edición
      limpiarFormulario();
      cargarDocumentos();
    } catch (error: any) {
      console.error('Error al guardar:', error);
      setMensaje('Hubo un error al procesar el archivo: ' + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleEditarClick = (docItem: DocumentoItem) => {
    setEditandoId(docItem.id);
    setTitulo(docItem.titulo);
    setMenu(docItem.menu);
    setOrdenMenu(docItem.ordenMenu.toString());
    setSubsubmenu(docItem.submenu);
    setOrdenSubmenu(docItem.ordenSubmenu.toString());
    setUrlExistente(docItem.url);
    setArchivo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Subir arriba para ver el formulario
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setTitulo('');
    setMenu('');
    setOrdenMenu('1');
    setSubsubmenu('');
    setOrdenSubmenu('1');
    setArchivo(null);
    setUrlExistente('');
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;
    try {
      await deleteDoc(doc(db, 'documentos', id));
      cargarDocumentos();
      setMensaje('Documento eliminado correctamente.');
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-[#4B0082]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#4B0082]">
            {editandoId ? '✏️ Editando Documento' : '📂 Subir Nuevo PDF'}
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
          <div className={`p-4 mb-6 rounded font-bold ${mensaje.includes('éxito') || mensaje.includes('actualizado') || mensaje.includes('eliminado') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-2xl">
          
          <label className="text-black font-bold flex flex-col">
            Título del Documento / PDF
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none"
              placeholder="Ej. Memoria 2025"
              required
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-black font-bold flex flex-col">
              Menú Principal
              <input
                type="text"
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
                className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none"
                placeholder="Ej. Transparencia"
                required
              />
            </label>
            <label className="text-black font-bold flex flex-col">
              Orden Menú (Prioridad numérica)
              <input
                type="number"
                value={ordenMenu}
                onChange={(e) => setOrdenMenu(e.target.value)}
                className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none"
                placeholder="1, 2, 3..."
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-black font-bold flex flex-col">
              Submenú / Categoría interna
              <input
                type="text"
                value={submenu}
                onChange={(e) => setSubsubmenu(e.target.value)}
                className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none"
                placeholder="Ej. Informes Anuales"
              />
            </label>
            <label className="text-black font-bold flex flex-col">
              Orden Submenú (Prioridad numérica)
              <input
                type="number"
                value={ordenSubmenu}
                onChange={(e) => setOrdenSubmenu(e.target.value)}
                className="mt-1 p-3 border-2 border-[#4B0082] rounded text-black font-normal focus:outline-none"
                placeholder="1, 2, 3..."
              />
            </label>
          </div>

          <label className="text-black font-bold flex flex-col">
            {editandoId ? 'Reemplazar archivo PDF (Opcional)' : 'Archivo PDF'}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setArchivo(e.target.files[0]);
                }
              }}
              className="mt-1 p-2 border-2 border-dashed border-[#4B0082] rounded text-black font-normal bg-gray-50 cursor-pointer"
              required={!editandoId}
            />
            {editandoId && <span className="text-xs text-gray-500 mt-1">Si no seleccionas ningún archivo nuevo, se mantendrá el PDF que ya tenía asociado.</span>}
          </label>

          <button
            type="submit"
            disabled={subiendo}
            className="bg-[#4B0082] hover:bg-purple-900 text-white font-bold p-3 rounded transition-colors text-lg mt-2 disabled:opacity-50"
          >
            {subiendo ? 'Guardando en la nube...' : (editandoId ? 'Guardar Cambios' : 'Subir y Publicar PDF')}
          </button>

        </form>
      </div>

      {/* Listado con botón de Editar */}
      <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-[#4B0082]">
        <h2 className="text-2xl font-bold text-[#4B0082] mb-4">Documentos Publicados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#4B0082] text-[#4B0082]">
                <th className="p-3">Título</th>
                <th className="p-3">Menú (Prioridad)</th>
                <th className="p-3">Submenú (Prioridad)</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((docItem) => (
                <tr key={docItem.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-black font-medium">{docItem.titulo}</td>
                  <td className="p-3 text-black font-bold">{docItem.menu} <span className="text-xs text-purple-600">({docItem.ordenMenu})</span></td>
                  <td className="p-3 text-black">{docItem.submenu} <span className="text-xs text-purple-600">({docItem.ordenSubmenu})</span></td>
                  <td className="p-3 flex gap-4 items-center">
                    <a href={docItem.url} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-bold">Ver</a>
                    <button 
                      onClick={() => handleEditarClick(docItem)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleEliminar(docItem.id)} 
                      className="text-red-600 hover:text-red-800 font-bold text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}