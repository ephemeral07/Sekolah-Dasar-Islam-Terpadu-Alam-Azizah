import React, { useState } from 'react';
import { X, Layers, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { RombelItem } from '../../types';

interface ModalKelolaRombelProps {
  isOpen: boolean;
  onClose: () => void;
  rombelList: RombelItem[];
  onSaveRombelList: (list: RombelItem[]) => void;
}

export const ModalKelolaRombel: React.FC<ModalKelolaRombelProps> = ({
  isOpen,
  onClose,
  rombelList,
  onSaveRombelList,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [tingkat, setTingkat] = useState(1);
  const [waliKelas, setWaliKelas] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleStartEdit = (r: RombelItem) => {
    setEditingId(r.id);
    setKode(r.kode);
    setNama(r.nama);
    setTingkat(r.tingkat);
    setWaliKelas(r.waliKelas || '');
    setKeterangan(r.keterangan || '');
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setKode('');
    setNama('');
    setTingkat(1);
    setWaliKelas('');
    setKeterangan('');
    setIsAdding(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim() || !nama.trim()) return;

    if (isAdding) {
      const newItem: RombelItem = {
        id: `rombel-${Date.now()}`,
        kode: kode.trim().toUpperCase(),
        nama: nama.trim(),
        tingkat: Number(tingkat),
        waliKelas: waliKelas.trim(),
        keterangan: keterangan.trim(),
      };
      onSaveRombelList([...rombelList, newItem]);
      setIsAdding(false);
    } else if (editingId) {
      const updated = rombelList.map((r) =>
        r.id === editingId
          ? {
              ...r,
              kode: kode.trim().toUpperCase(),
              nama: nama.trim(),
              tingkat: Number(tingkat),
              waliKelas: waliKelas.trim(),
              keterangan: keterangan.trim(),
            }
          : r
      );
      onSaveRombelList(updated);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, namaRombel: string) => {
    if (confirm(`Hapus rombel "${namaRombel}"? Pastikan tidak ada murid yang terhubung!`)) {
      onSaveRombelList(rombelList.filter((r) => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Kelola Nama-Nama Rombongan Belajar (Rombel)
              </h3>
              <p className="text-xs text-slate-500">
                Akses Pengelola: Tambah, ubah nama kelas/fase, kode rombel, dan wali kelas
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
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Rombel Baru</span>
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
              <span>{isAdding ? 'Tambah Rombel Baru' : 'Ubah Data Rombel'}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700">Kode Rombel (e.g. 1A, 2B)</label>
                <input
                  type="text"
                  required
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: 1A"
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700">Nama Lengkap Rombel / Kelas</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Kelas 1 - Abu Bakar Ash-Shiddiq"
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700">Tingkat Kelas (1 - 6)</label>
                <select
                  value={tingkat}
                  onChange={(e) => setTingkat(Number(e.target.value))}
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((t) => (
                    <option key={t} value={t}>
                      Tingkat / Kelas {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Wali Kelas / Asatidz Pendamping</label>
                <input
                  type="text"
                  value={waliKelas}
                  onChange={(e) => setWaliKelas(e.target.value)}
                  placeholder="Nama Ustadz / Ustadzah"
                  className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700">Fokus / Keterangan Pembelajaran</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Kemandirian Ibadah & Survival Dasar"
                className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                Simpan Rombel
              </button>
            </div>
          </form>
        )}

        {/* List of Rombel */}
        <div className="space-y-2.5">
          <span className="font-bold text-slate-700 text-xs block">
            Daftar Rombongan Belajar Aktif ({rombelList.length})
          </span>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {rombelList.map((r) => (
              <div
                key={r.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 transition text-xs"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0 border border-emerald-200">
                    {r.kode}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{r.nama}</h4>
                    <p className="text-[11px] text-slate-600">
                      Tingkat: <strong className="text-slate-800">Kelas {r.tingkat}</strong> | Wali Kelas: <strong className="text-emerald-800">{r.waliKelas || '-'}</strong>
                    </p>
                    {r.keterangan && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.keterangan}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleStartEdit(r)}
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 cursor-pointer"
                    title="Ubah Rombel"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.nama)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                    title="Hapus Rombel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
