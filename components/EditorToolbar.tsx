'use client';

import { type Editor } from '@tiptap/react';

type Props = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 border-2 border-b-0 border-[#4B0082] rounded-t p-2 bg-purple-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded font-bold text-sm ${editor.isActive('bold') ? 'bg-[#4B0082] text-white' : 'bg-white text-[#4B0082] border border-[#4B0082]'}`}
      >
        Negrita
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded font-bold text-sm ${editor.isActive('italic') ? 'bg-[#4B0082] text-white' : 'bg-white text-[#4B0082] border border-[#4B0082]'}`}
      >
        Cursiva
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded font-bold text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-[#4B0082] text-white' : 'bg-white text-[#4B0082] border border-[#4B0082]'}`}
      >
        Título
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded font-bold text-sm ${editor.isActive('bulletList') ? 'bg-[#4B0082] text-white' : 'bg-white text-[#4B0082] border border-[#4B0082]'}`}
      >
        Lista
      </button>
    </div>
  );
}
