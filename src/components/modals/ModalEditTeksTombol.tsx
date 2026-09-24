import React, { useState, useEffect } from 'react';
import { X, Type, CheckCircle } from 'lucide-react';
import { UiTextConfig } from '../../types';

interface ModalEditTeksTombolProps {
  isOpen: boolean;
  onClose: () => void;
  config: UiTextConfig;
  onSave: (config: UiTextConfig) => void;
}

export const ModalEditTeksTombol: React.FC<ModalEditTeksTombolProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [btnInputMutabaah, setBtnInputMutabaah] = useState(config.btnInputMutabaah);
  const [btnTambahMurid, setBtnTambahMurid] = useState(config.btnTambahMurid);
  const [btnCatatPelanggaran, setBtnCatatPelanggaran] = useState(config.btnCatatPelanggaran);
  const [btnCatatPrestasi, setBtnCatatPrestasi] = useState(config.btnCatatPrestasi);
  const [btnCatatMutasi, setBtnCatatMutasi] = useState(config.btnCatatMutasi);
  const [btnTambahSdm, setBtnTambahSdm] = useState(config.btnTambahSdm);
  const [btnCatatPembinaan, setBtnCatatPembinaan] = useState(config.btnCatatPembinaan);

  useEffect(() => {
    setBtnInputMutabaah(config.btnInputMutabaah);
    setBtnTambahMurid(config.btnTambahMurid);
    setBtnCatatPelanggaran(config.btnCatatPelanggaran);
    setBtnCatatPrestasi(config.btnCatatPrestasi);
    setBtnCatatMutasi(config.btnCatatMutasi);
    setBtnTambahSdm(config.btnTambahSdm);
    setBtnCatatPembinaan(config.btnCatatPembinaan);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      btnInputMutabaah: btnInputMutabaah.trim() || "+ Input Mutaba'ah Hari Ini",
      btnTambahMurid: btnTambahMurid.trim() || '+ Tambah Murid Baru',
      btnCatatPelanggaran: btnCatatPelanggaran.trim() || '+ Catat Pelanggaran',
      btnCatatPrestasi: btnCatatPrestasi.trim() || '+ Catat Prestasi',
      btnCatatMutasi: btnCatatMutasi.trim() || '+ Catat Mutasi',
      btnTambahSdm: btnTambahSdm.trim() || '+ Tambah Asatidz / Staf',
      btnCatatPembinaan: btnCatatPembinaan.trim() || '+ Catat Pembinaan Baru',
    });
    onClose();
  };

  const handleResetDefault = () => {
    setBtnInputMutabaah("+ Input Mutaba'ah Hari Ini");
    setBtnTambahMurid('+ Tambah Murid Baru');
    setBtnCatatPelanggaran('+ Catat Pelanggaran');
    setBtnCatatPrestasi('+ Catat Prestasi');
    setBtnCatatMutasi('+ Catat Mutasi');
    setBtnTambahSdm('+ Tambah Asatidz / Staf');
    setBtnCatatPembinaan('+ Catat Pembinaan Baru');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Type className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Kustomisasi Tulisan Tombol & Aksi
              </h3>
              <p className="text-xs text-slate-500">
                Akses Pengelola: Sesuaikan label tombol input mutaba'ah dan tombol aksi lainnya
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tulisan Tombol Mutaba'ah
            </label>
            <input
              type="text"
              required
              value={btnInputMutabaah}
              onChange={(e) => setBtnInputMutabaah(e.target.value)}
              placeholder="+ Input Mutaba'ah Hari Ini"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tulisan Tombol Tambah Murid
            </label>
            <input
              type="text"
              required
              value={btnTambahMurid}
              onChange={(e) => setBtnTambahMurid(e.target.value)}
              placeholder="+ Tambah Murid Baru"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tulisan Tombol Pelanggaran
              </label>
              <input
                type="text"
                required
                value={btnCatatPelanggaran}
                onChange={(e) => setBtnCatatPelanggaran(e.target.value)}
                placeholder="+ Catat Pelanggaran"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tulisan Tombol Prestasi
              </label>
              <input
                type="text"
                required
                value={btnCatatPrestasi}
                onChange={(e) => setBtnCatatPrestasi(e.target.value)}
                placeholder="+ Catat Prestasi"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tulisan Tombol Mutasi
              </label>
              <input
                type="text"
                required
                value={btnCatatMutasi}
                onChange={(e) => setBtnCatatMutasi(e.target.value)}
                placeholder="+ Catat Mutasi"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tulisan Tombol Tambah SDM
              </label>
              <input
                type="text"
                required
                value={btnTambahSdm}
                onChange={(e) => setBtnTambahSdm(e.target.value)}
                placeholder="+ Tambah Guru / Staf"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tulisan Tombol Pembinaan SDM
            </label>
            <input
              type="text"
              required
              value={btnCatatPembinaan}
              onChange={(e) => setBtnCatatPembinaan(e.target.value)}
              placeholder="+ Catat Pembinaan Baru"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
            >
              Reset ke Default
            </button>
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
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer shadow-xs"
              >
                Simpan Tulisan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
