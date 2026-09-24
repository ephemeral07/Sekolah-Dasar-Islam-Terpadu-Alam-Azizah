import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { Pembinaan, SDM } from '../../types';

interface ModalEditPembinaanProps {
  isOpen: boolean;
  onClose: () => void;
  pembinaan: Pembinaan | null;
  sdmList: SDM[];
  onSave: (pembinaan: Pembinaan) => void;
  onDelete?: (pemId: string) => void;
}

export const ModalEditPembinaan: React.FC<ModalEditPembinaanProps> = ({
  isOpen,
  onClose,
  pembinaan,
  sdmList,
  onSave,
  onDelete,
}) => {
  const [sdmId, setSdmId] = useState('');
  const [kategori, setKategori] = useState<Pembinaan['kategori']>('Coaching & Bimbingan Teknis');
  const [tanggal, setTanggal] = useState('');
  const [topik, setTopik] = useState('');
  const [catatan, setCatatan] = useState('');
  const [rekomendasi, setRekomendasi] = useState('');
  const [dicatatOleh, setDicatatOleh] = useState('');

  useEffect(() => {
    if (pembinaan) {
      setSdmId(pembinaan.sdmId);
      setKategori(pembinaan.kategori);
      setTanggal(pembinaan.tanggal);
      setTopik(pembinaan.topik);
      setCatatan(pembinaan.catatan);
      setRekomendasi(pembinaan.rekomendasi);
      setDicatatOleh(pembinaan.dicatatOleh);
    }
  }, [pembinaan, isOpen]);

  if (!isOpen || !pembinaan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...pembinaan,
      sdmId,
      kategori,
      tanggal,
      topik,
      catatan,
      rekomendasi,
      dicatatOleh,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Catatan Pembinaan Asatidz
              </h3>
              <p className="text-xs text-slate-500">
                Akses Pengelola Yayasan: Perbarui evaluasi & rekomendasi resmi
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700">Nama Guru / Staf Yang Dibina</label>
            <select
              value={sdmId}
              onChange={(e) => setSdmId(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              {sdmList.map((sdm) => (
                <option key={sdm.id} value={sdm.id}>
                  {sdm.nama} - {sdm.jabatan}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Kategori Pembinaan</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Pembinaan['kategori'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="Coaching & Bimbingan Teknis">Coaching & Bimbingan Teknis</option>
                <option value="Apresiasi / Penghargaan Kinerja">Apresiasi / Penghargaan Kinerja</option>
                <option value="Rapat Rencana Perpanjangan Kontrak">Rencana Perpanjangan Kontrak</option>
                <option value="Teguran & Pembinaan Kedisiplinan">Teguran & Kedisiplinan</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700">Tanggal Pertemuan</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Topik / Agenda Pembahasan</label>
            <input
              type="text"
              required
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Catatan Evaluasi Pengelola (Rahasia)</label>
            <textarea
              rows={3}
              required
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Rekomendasi Tindak Lanjut Yayasan</label>
            <textarea
              rows={3}
              required
              value={rekomendasi}
              onChange={(e) => setRekomendasi(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Penanggung Jawab / Pencatat</label>
            <input
              type="text"
              required
              value={dicatatOleh}
              onChange={(e) => setDicatatOleh(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {onDelete && pembinaan ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus catatan pembinaan ini secara permanen?')) {
                    onDelete(pembinaan.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold cursor-pointer text-xs transition border border-red-200"
              >
                Hapus Catatan
              </button>
            ) : <div />}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
