import React from 'react';
import {
  X,
  Heart,
  Compass,
  Award,
  AlertTriangle,
  BookOpen,
  Phone,
} from 'lucide-react';
import { Siswa, Pelanggaran, Prestasi, Mutabaah } from '../../types';

interface ModalDetailSiswaProps {
  isOpen: boolean;
  onClose: () => void;
  siswa: Siswa | null;
  pelanggaranList: Pelanggaran[];
  prestasiList: Prestasi[];
  mutabaahList: Mutabaah[];
  onOpenPiagamModal: (prestasi: Prestasi) => void;
}

export const ModalDetailSiswa: React.FC<ModalDetailSiswaProps> = ({
  isOpen,
  onClose,
  siswa,
  pelanggaranList,
  prestasiList,
  mutabaahList,
  onOpenPiagamModal,
}) => {
  if (!isOpen || !siswa) return null;

  const studentPelanggarans = pelanggaranList.filter((p) => p.siswaId === siswa.id);
  const studentPrestasis = prestasiList.filter((pr) => pr.siswaId === siswa.id);
  const studentMutabaahs = mutabaahList.filter((m) => m.siswaId === siswa.id);
  const totalPoints = studentPelanggarans.reduce((a, b) => a + b.poin, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={
                siswa.foto ||
                'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
              }
              alt={siswa.nama}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-300 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Rombel {siswa.rombel}
                </span>
                <span className="text-xs text-slate-500">NIS: {siswa.nis}</span>
              </div>
              <h3 className="font-black text-lg text-slate-900 mt-0.5">{siswa.nama}</h3>
              <p className="text-xs text-slate-500">
                Panggilan: "{siswa.panggilan}" | TTL: {siswa.tempatLahir}, {siswa.tanggalLahir}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wali & Health Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-extrabold text-slate-700 block">Wali Murid & Kontak:</span>
            <p className="text-slate-600">Ayah / Wali: {siswa.namaAyah}</p>
            <p className="text-slate-600 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>WhatsApp: {siswa.waOrtu}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAFDF9] border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-1 text-emerald-800 font-extrabold">
              <Compass className="w-3.5 h-3.5" />
              <span>Karakteristik & Pantangan Alam:</span>
            </div>
            <p className="text-slate-600 text-[11px]">{siswa.pantanganAlam}</p>
            <div className="flex items-center space-x-1 text-rose-700 font-extrabold pt-1">
              <Heart className="w-3.5 h-3.5" />
              <span>Riwayat Kesehatan:</span>
            </div>
            <p className="text-slate-600 text-[11px]">{siswa.riwayatKesehatan}</p>
          </div>
        </div>

        {/* 2 Key Summary Chips */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-red-50/60 border border-red-200">
            <span className="text-[10px] font-bold text-red-600 uppercase block">
              Poin Kedisiplinan Murid
            </span>
            <span className="text-xl font-black text-red-700">{totalPoints} Poin</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">
              Torehan Prestasi
            </span>
            <span className="text-xl font-black text-emerald-800">
              {studentPrestasis.length} Penghargaan
            </span>
          </div>
        </div>

        {/* Prestasi List */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Prestasi & Piagam Murid</span>
          </h4>
          {studentPrestasis.length > 0 ? (
            <div className="space-y-2">
              {studentPrestasis.map((pr) => (
                <div
                  key={pr.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{pr.nama}</span>
                    <p className="text-[11px] text-slate-500">
                      Tingkat {pr.tingkat} | {pr.tanggal}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenPiagamModal(pr)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                  >
                    Lihat Piagam
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Belum ada torehan piagam tercatat.</p>
          )}
        </div>

        {/* Pelanggaran List */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Catatan Pelanggaran Kedisiplinan</span>
          </h4>
          {studentPelanggarans.length > 0 ? (
            <div className="space-y-2">
              {studentPelanggarans.map((pel) => (
                <div
                  key={pel.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-900">{pel.bentuk}</span>
                    <span className="text-red-600">+{pel.poin} Poin</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Status: <strong className="text-slate-800">{pel.status}</strong> | Pencatat: {pel.guru} ({pel.tanggal})
                  </p>
                  <p className="text-slate-700 text-[11px] bg-white p-2 rounded-lg border border-amber-100">
                    <strong>Tindak Lanjut:</strong> {pel.tindakLanjut}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-700 font-medium">
              Alhamdulillah, murid belum pernah tercatat melanggar kedisiplinan.
            </p>
          )}
        </div>

        {/* Mutaba'ah Summary */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Catatan Jurnal Mutaba'ah Terbaru</span>
          </h4>
          {studentMutabaahs.slice(0, 2).map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
            >
              <div className="flex justify-between text-slate-700 font-bold">
                <span>Tanggal: {m.tanggal}</span>
                <span>Subuh: {m.sholatSubuh}</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>Tilawah:</strong> {m.tilawah}
              </p>
              <p className="text-slate-600 text-[11px]">
                <strong>Adab Alam:</strong> {m.adabAlam}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
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
