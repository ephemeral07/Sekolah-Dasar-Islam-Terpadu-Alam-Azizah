import React, { useState } from 'react';
import { X, Megaphone, Plus, Edit2, Trash2 } from 'lucide-react';
import { Pengumuman } from '../../types';

interface ModalKelolaPengumumanProps {
  isOpen: boolean;
  onClose: () => void;
  pengumumanList: Pengumuman[];
  onSavePengumumanList: (list: Pengumuman[]) => void;
}

export const ModalKelolaPengumuman: React.FC<ModalKelolaPengumumanProps> = ({
  isOpen,
  onClose,
  pengumumanList,
  onSavePengumumanList,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState<Pengumuman['kategori']>('Kegiatan Alam');
  const [penulis, setPenulis] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingId(null);
    setJudul('');
    setIsi('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setKategori('Kegiatan Alam');
    setPenulis('Pengelola SDIT Alam Azizah');
    setIsAdding(true);
  };

  const handleStartEdit = (p: Pengumuman) => {
    setEditingId(p.id);
    setJudul(p.judul);
    setIsi(p.isi);
    setTanggal(p.tanggal);
    setKategori(p.kategori);
    setPenulis(p.penulis);
    setIsAdding(false);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;

    if (isAdding) {
      const newItem: Pengumuman = {
        id: `peng-${Date.now()}`,
        judul: judul.trim(),
        isi: isi.trim(),
        tanggal,
        kategori,
        penulis: penulis.trim() || 'Pengelola Yayasan',
      };
      onSavePengumumanList([newItem, ...pengumumanList]);
      setIsAdding(false);
    } else if (editingId) {
      const updated = pengumumanList.map((p) =>
        p.id === editingId
          ? {
              ...p,
              judul: judul.trim(),
              isi: isi.trim(),
              tanggal,
              kategori,
              penulis: penulis.trim(),
            }
          : p
      );
      onSavePengumumanList(updated);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, judulPengumuman: string) => {
    if (confirm(`Hapus warta/pengumuman "${judulPengumuman}"?`)) {
      onSavePengumumanList(pengumumanList.filter((p) => p.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Kelola Warta & Pengumuman Sekolah
              </h3>
              <p className="text-xs text-slate-500">
                Akses Pengelola: Buat, edit, dan hapus pengumuman untuk orang tua dan dasbor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        {!isAdding && !editingId && (
          <div className="flex justify-end">
            <button
              onClick={handleStartAdd}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Warta Baru</span>
            </button>
          </div>
        )}

        {/* Form Add / Edit */}
        {(isAdding || editingId) && (
          <form
            onSubmit={handleSaveItem}
            className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span>{isAdding ? 'Buat Warta Baru' : 'Ubah Data Warta'}</span>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div>
              <label className="font-bold text-slate-700">Judul Pengumuman</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Agenda Survival Camp & Jelajah Rimba 2026"
                className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as Pengumuman['kategori'])}
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Kegiatan Alam">Kegiatan Alam</option>
                  <option value="Penting">Penting</option>
                  <option value="Akademik">Akademik</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Tanggal Tayang</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Penulis / Unit</label>
                <input
                  type="text"
                  required
                  value={penulis}
                  onChange={(e) => setPenulis(e.target.value)}
                  placeholder="Contoh: Koordinator Alam"
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700">Isi Lengkap Warta</label>
              <textarea
                rows={4}
                required
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                placeholder="Tuliskan isi pengumuman secara rinci..."
                className="w-full mt-1 p-2.5 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer shadow-xs"
              >
                Simpan Warta
              </button>
            </div>
          </form>
        )}

        {/* List of Announcements */}
        <div className="space-y-2.5">
          <span className="font-bold text-slate-700 text-xs block">
            Daftar Warta & Pengumuman Aktif ({pengumumanList.length})
          </span>
          <div className="space-y-2.5">
            {pengumumanList.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {p.kategori}
                      </span>
                      <span className="text-[11px] text-slate-500">{p.tanggal}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1">{p.judul}</h4>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 cursor-pointer"
                      title="Ubah Warta"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.judul)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                      title="Hapus Warta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-[11px] line-clamp-3">{p.isi}</p>
                <p className="text-[10px] text-slate-400 font-semibold italic text-right">
                  Ditulis oleh: {p.penulis}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
