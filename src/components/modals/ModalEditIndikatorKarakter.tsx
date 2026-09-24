import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { IndikatorKarakterConfig, IndikatorItem } from '../../types';

interface ModalEditIndikatorKarakterProps {
  isOpen: boolean;
  onClose: () => void;
  config: IndikatorKarakterConfig;
  onSave: (config: IndikatorKarakterConfig) => void;
}

export const ModalEditIndikatorKarakter: React.FC<ModalEditIndikatorKarakterProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [judul, setJudul] = useState(config.judul);
  const [items, setItems] = useState<IndikatorItem[]>(config.items);

  useEffect(() => {
    setJudul(config.judul);
    setItems(config.items);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, field: keyof IndikatorItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddItem = () => {
    const nextNomor = String(items.length + 1);
    const newItem: IndikatorItem = {
      id: `ind-${Date.now()}`,
      nomor: nextNomor,
      judul: 'Indikator Baru',
      deskripsi: 'Deskripsi singkat karakter',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      judul: judul.trim() || 'Indikator Karakter Tarbiyah & Adab Kelestarian Alam SDIT Alam Azizah',
      items,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Indikator Karakter Tarbiyah & Kelestarian Alam
              </h3>
              <p className="text-xs text-slate-500">
                Akses Pengelola: Ubah judul panduan dan butir-butir karakter muwashofat
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Judul Panduan Indikator Karakter
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Daftar Poin Indikator Karakter</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Poin Indikator</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-20">
                      <label className="text-[10px] font-bold text-slate-500 block">Nomor / Urutan</label>
                      <input
                        type="text"
                        value={item.nomor}
                        onChange={(e) => handleItemChange(idx, 'nomor', e.target.value)}
                        className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-300 font-bold text-center focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-500 block">Nama Indikator</label>
                      <input
                        type="text"
                        value={item.judul}
                        onChange={(e) => handleItemChange(idx, 'judul', e.target.value)}
                        placeholder="Contoh: 1. Salimul Aqidah"
                        className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-300 font-bold text-emerald-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 border border-red-200 mt-3 cursor-pointer"
                        title="Hapus Indikator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Deskripsi Singkat</label>
                    <input
                      type="text"
                      value={item.deskripsi}
                      onChange={(e) => handleItemChange(idx, 'deskripsi', e.target.value)}
                      placeholder="Contoh: Aqidah yang lurus bersih dari syirik"
                      className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer shadow-xs"
            >
              Simpan Perubahan Indikator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
