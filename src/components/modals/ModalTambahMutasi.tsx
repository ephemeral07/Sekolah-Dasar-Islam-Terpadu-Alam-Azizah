import React, { useState } from 'react';
import { X, UserMinus, Plus } from 'lucide-react';
import { Mutasi, Siswa } from '../../types';

interface ModalTambahMutasiProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  onAddMutasi: (mutasi: Mutasi) => void;
}

export const ModalTambahMutasi: React.FC<ModalTambahMutasiProps> = ({
  isOpen,
  onClose,
  siswaList,
  onAddMutasi,
}) => {
  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [jenis, setJenis] = useState<Mutasi['jenis']>('Keluar');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [noSurat, setNoSurat] = useState(`421.2/MUT-${Math.floor(100 + Math.random() * 900)}/AZZ/2026`);
  const [keterangan, setKeterangan] = useState('Pindah domisili orang tua ke luar kota');
  const [catatan, setCatatan] = useState('Berkas buku induk dan rapor karakter alam sudah diserahterimakan.');

  if (!isOpen) return null;

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
    const newMutasi: Mutasi = {
      id: `mut-${Date.now()}`,
      siswaId: selectedSiswaId || undefined,
      namaSiswa,
      jenis,
      tanggal,
      noSurat,
      keterangan,
      catatan,
    };
    onAddMutasi(newMutasi);
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
                Tambah Catatan Mutasi Murid
              </h3>
              <p className="text-slate-500 text-[11px]">
                Catat mutasi masuk, mutasi keluar, atau kelulusan alumni murid
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
              placeholder="Nama lengkap murid"
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
              className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold transition cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Mutasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
