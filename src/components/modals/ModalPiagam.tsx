import React from 'react';
import { X, Award, CheckCircle } from 'lucide-react';
import { Prestasi, Siswa } from '../../types';

interface ModalPiagamProps {
  isOpen: boolean;
  onClose: () => void;
  prestasi: Prestasi | null;
  siswa: Siswa | null;
}

export const ModalPiagam: React.FC<ModalPiagamProps> = ({
  isOpen,
  onClose,
  prestasi,
  siswa,
}) => {
  if (!isOpen || !prestasi) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-300" />
            <h3 className="font-extrabold text-sm">Piagam Penghargaan Santri</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white text-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-center">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
            <img
              src={
                prestasi.piagamUrl ||
                'https://images.unsplash.com/photo-1589330694653-dad6bc0140fa?w=600&auto=format&fit=crop&q=80'
              }
              alt={prestasi.nama}
              className="max-h-72 w-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-emerald-800/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-300" />
              <span>Sertifikat Terverifikasi</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {prestasi.kategori}
            </span>
            <h4 className="font-extrabold text-slate-900 text-base mt-2">
              {prestasi.nama}
            </h4>
            <p className="text-xs font-semibold text-emerald-700 mt-1">
              Santri: {siswa?.nama} ({siswa?.rombel})
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 grid grid-cols-2 gap-2 text-left">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">TINGKAT</span>
              <span className="font-bold text-slate-800">{prestasi.tingkat}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">PENYELENGGARA</span>
              <span className="font-bold text-slate-800">{prestasi.penyelenggara}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">TANGGAL</span>
              <span className="font-bold text-slate-800">{prestasi.tanggal}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">STATUS ARSIP</span>
              <span className="font-bold text-emerald-700">Tersimpan Digital</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
