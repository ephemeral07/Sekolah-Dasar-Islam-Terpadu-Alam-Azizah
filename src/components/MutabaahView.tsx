import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  Leaf,
  Clock,
  Heart,
  Plus,
  Edit2,
  Type,
  BookmarkCheck,
  Award,
} from 'lucide-react';
import { Mutabaah, Siswa, UserRole, IndikatorKarakterConfig, UiTextConfig } from '../types';

interface MutabaahViewProps {
  currentRole: UserRole;
  mutabaahList: Mutabaah[];
  siswaList: Siswa[];
  indikatorConfig: IndikatorKarakterConfig;
  uiTextConfig: UiTextConfig;
  onOpenInputMutabaah: (siswaId?: string) => void;
  onOpenEditIndikator?: () => void;
  onOpenEditTombol?: () => void;
}

export const MutabaahView: React.FC<MutabaahViewProps> = ({
  currentRole,
  mutabaahList,
  siswaList,
  indikatorConfig,
  uiTextConfig,
  onOpenInputMutabaah,
  onOpenEditIndikator,
  onOpenEditTombol,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Jurnal Mutaba'ah & Karakter Muslim Alam
          </h2>
          <p className="text-xs text-slate-500">
            Modul khusus Islam Terpadu & Sekolah Alam: Ibadah yaumiyah, Al-Ma'tsurat, dan adab cinta lingkungan
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {currentRole === 'pengelola' && onOpenEditTombol && (
            <button
              onClick={onOpenEditTombol}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              title="Edit Teks Tombol Aksi"
            >
              <Type className="w-4 h-4 text-slate-600" />
              <span>Edit Tulisan Tombol</span>
            </button>
          )}
          {currentRole !== 'ortu' && (
            <button
              onClick={() => onOpenInputMutabaah()}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{uiTextConfig?.btnInputMutabaah || "+ Input Mutaba'ah Hari Ini"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 10 Muwashofat & Green Character Indicator Cards (Editable by Pengelola) */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-100 bg-emerald-50/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{indikatorConfig.judul}</span>
          </h3>
          {currentRole === 'pengelola' && onOpenEditIndikator && (
            <button
              onClick={onOpenEditIndikator}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Judul & Indikator</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
          {indikatorConfig.items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-xs text-center flex flex-col justify-between"
            >
              <span className="text-emerald-800 font-extrabold block text-xs">
                {item.nomor}. {item.judul.replace(/^\d+\.\s*/, '')}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">{item.deskripsi}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mutaba'ah Daily Cards */}
      <div className="space-y-4">
        {mutabaahList.map((m) => {
          const student = siswaList.find((s) => s.id === m.siswaId);
          return (
            <div
              key={m.id}
              className="glass-card rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {student ? student.panggilan[0] : 'M'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {student?.nama || 'Murid'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rombel {student?.rombel} | Tanggal: {m.tanggal}
                    </p>
                  </div>
                </div>
                {currentRole !== 'ortu' && (
                  <button
                    onClick={() => onOpenInputMutabaah(m.siswaId)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto cursor-pointer"
                  >
                    Perbarui Jurnal
                  </button>
                )}
              </div>

              {/* Status Check items */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-xs">
                {/* Sholat Dhuha */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                  {m.sholatDhuha ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Sholat Dhuha</span>
                    <span className="font-extrabold text-slate-800">
                      {m.sholatDhuha ? 'Melaksanakan' : 'Belum'}
                    </span>
                  </div>
                </div>

                {/* Sholat Subuh */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Sholat Subuh</span>
                    <span className="font-extrabold text-slate-800">{m.sholatSubuh}</span>
                  </div>
                </div>

                {/* Sholat Dzuhur & Ashar */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Dzuhur & Ashar</span>
                    <span className="font-extrabold text-slate-800">{m.sholatDzuhurAshar}</span>
                  </div>
                </div>

                {/* Al-Ma'tsurat Pagi */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                  {m.alMatsuratPagi ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Al-Ma'tsurat</span>
                    <span className="font-extrabold text-slate-800">
                      {m.alMatsuratPagi ? 'Tuntas Pagi' : 'Belum'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hafalan Qur'an & Iqro Highlight */}
              {m.hafalanQuranIqro && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200 text-xs mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/70 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 rounded-lg bg-emerald-700 text-white">
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-extrabold text-emerald-950 text-xs">
                        Capaian Tahfidz: {m.hafalanQuranIqro.kategori === 'Al-Qur\'an' ? (m.hafalanQuranIqro.juz || 'Al-Qur\'an') : (m.hafalanQuranIqro.jilidIqro || 'Iqro')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {m.hafalanQuranIqro.totalJuzTuntas && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                          ⭐ {m.hafalanQuranIqro.totalJuzTuntas}
                        </span>
                      )}
                      {m.hafalanQuranIqro.predikat && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {m.hafalanQuranIqro.predikat}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-slate-700">
                    <div>
                      <strong className="text-slate-900 block font-bold">
                        {m.hafalanQuranIqro.kategori === 'Al-Qur\'an' ? 'Surat & Ayat yang Disetor:' : 'Materi / Halaman Iqro:'}
                      </strong>
                      <span className="text-emerald-900 font-semibold">
                        {m.hafalanQuranIqro.kategori === 'Al-Qur\'an'
                          ? (m.hafalanQuranIqro.suratDanAyat || m.tilawah)
                          : (m.hafalanQuranIqro.halamanIqro || m.tilawah)}
                      </span>
                    </div>
                    {m.hafalanQuranIqro.catatanMuhaffizh && (
                      <div>
                        <strong className="text-slate-900 block font-bold">Catatan Muhaffizh:</strong>
                        <span className="italic text-slate-600">"{m.hafalanQuranIqro.catatanMuhaffizh}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tilawah & Adab Alam Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-1.5 font-extrabold text-emerald-900 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Capaian Tilawah & Tahfidz:</span>
                  </div>
                  <p className="text-slate-700">{m.tilawah}</p>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-1.5 font-extrabold text-emerald-900 mb-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Adab Kelestarian Alam & Zero-Waste:</span>
                  </div>
                  <p className="text-slate-700">{m.adabAlam}</p>
                </div>
              </div>

              {m.catatanGuru && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900 block mb-0.5">Catatan Muaddib / Wali Kelas:</strong>
                  <p className="italic">"{m.catatanGuru}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
