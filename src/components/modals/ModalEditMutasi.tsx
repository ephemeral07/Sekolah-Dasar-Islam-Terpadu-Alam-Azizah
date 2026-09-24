import React, { useState, useEffect } from 'react';
import { X, UserMinus } from 'lucide-react';
import { Mutasi, Siswa } from '../../types';

interface ModalEditMutasiProps {
  isOpen: boolean;
  onClose: () => void;
  mutasi: Mutasi | null;
  siswaList: Siswa[];
  onSave: (updated: Mutasi) => void;
}

export const ModalEditMutasi: React.FC<ModalEditMutasiProps> = ({
  isOpen,
  onClose,
  mutasi,
  siswaList,
  onSave,
}) => {
  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [jenis, setJenis] = useState<Mutasi['jenis']>('Keluar');
  const [tanggal, setTanggal] = useState('');
  const [noSurat, setNoSurat] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    if (mutasi) {
      setSelectedSiswaId(mutasi.siswaId || '');
      setNamaSiswa(mutasi.namaSiswa);
      setJenis(mutasi.jenis);
      setTanggal(mutasi.tanggal);
      setNoSurat(mutasi.noSurat);
      setKeterangan(mutasi.keterangan);
      setCatatan(mutasi.catatan);
    }
  }, [mutasi, isOpen]);

  if (!isOpen || !mutasi) return null;

  const handleSelectSiswa = (id: string) => {
    setSelectedSiswaId(id);
    const found = siswaList.find((s) => s.id === id);
    if (found) {
      setNamaSiswa(found.nama);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) {
      alert('Nama murid wajib diisi.');
      return;
    }
    onSave({
      ...mutasi,
      siswaId: selectedSiswaId || undefined,
      namaSiswa,
      jenis,
      tanggal,
      noSurat,
      keterangan,
      catatan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Edit Catatan Mutasi Murid
              </h3>
              <p className="text-slate-500 text-[11px]">
                Perbarui data surat mutasi atau kelulusan alumni
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Pilih dari Murid Terdaftar (Opsional)
            </label>
            <select
              value={selectedSiswaId}
              onChange={(e) => handleSelectSiswa(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="">-- Ketik Manual atau Pilih Murid --</option>
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.rombel}) - NIS: {s.nis}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Nama Lengkap Murid *
            </label>
            <input
              type="text"
              required
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Jenis Mutasi
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value as Mutasi['jenis'])}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Keluar">Mutasi Keluar</option>
                <option value="Masuk">Mutasi Masuk</option>
                <option value="Lulus Alumni">Lulus Alumni</option>
              </select>
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Tanggal Mutasi
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Nomor Surat Keterangan Mutasi
            </label>
            <input
              type="text"
              required
              value={noSurat}
              onChange={(e) => setNoSurat(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Keterangan Alasan Mutasi
            </label>
            <input
              type="text"
              required
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Catatan Administrasi & Rapor
            </label>
            <textarea
              rows={2}
              required
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold transition cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
