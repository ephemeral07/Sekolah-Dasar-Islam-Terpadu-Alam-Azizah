import React, { useState } from 'react';
import {
  Heart,
  Award,
  AlertTriangle,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  Phone,
  Compass,
  Sparkles,
  Bell,
  Calendar,
} from 'lucide-react';
import { Siswa, Mutabaah, Pelanggaran, Prestasi, SDM, Pengumuman } from '../types';

interface PortalOrtuViewProps {
  siswaList: Siswa[];
  mutabaahList: Mutabaah[];
  pelanggaranList: Pelanggaran[];
  prestasiList: Prestasi[];
  sdmList: SDM[];
  pengumumanList?: Pengumuman[];
  onOpenPiagamModal: (prestasi: Prestasi) => void;
}

export const PortalOrtuView: React.FC<PortalOrtuViewProps> = ({
  siswaList,
  mutabaahList,
  pelanggaranList,
  prestasiList,
  sdmList,
  pengumumanList = [],
  onOpenPiagamModal,
}) => {
  const [selectedSiswaId, setSelectedSiswaId] = useState<string>(siswaList[0]?.id || '');

  const selectedSiswa = siswaList.find((s) => s.id === selectedSiswaId) || siswaList[0];

  const studentMutabaah = mutabaahList.filter((m) => m.siswaId === selectedSiswa?.id);
  const studentPelanggarans = pelanggaranList.filter((p) => p.siswaId === selectedSiswa?.id);
  const studentPrestasis = prestasiList.filter((pr) => pr.siswaId === selectedSiswa?.id);
  const totalPoints = studentPelanggarans.reduce((acc, curr) => acc + curr.poin, 0);

  // Find wali kelas based on rombel
  const getWaliKelas = (rombel: string) => {
    switch (rombel) {
      case '1A':
        return sdmList.find((s) => s.jabatan.includes('Kelas 1')) || sdmList[5];
      case '3A':
        return sdmList.find((s) => s.jabatan.includes('Kelas 3')) || sdmList[1];
      case '5A':
        return sdmList.find((s) => s.jabatan.includes('Kelas 5')) || sdmList[2];
      case '6A':
        return sdmList.find((s) => s.jabatan.includes('Kelas 6')) || sdmList[3];
      default:
        return sdmList[1];
    }
  };

  const waliKelas = selectedSiswa ? getWaliKelas(selectedSiswa.rombel) : sdmList[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl gradient-nature-card text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
            Portal Orang Tua / Wali Murid
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-1">
            Laporan Perkembangan & Karakter Ananda
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Memantau pembiasaan ibadah harian, catatan adab dari asatidz, dan perkembangan ananda di lingkungan sekolah alam.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Student Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-700">Pilih Data Ananda:</span>
          <select
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="text-xs font-extrabold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
          >
            {siswaList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.rombel}) - NIS {s.nis}
              </option>
            ))}
          </select>
        </div>

        {waliKelas && (
          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="font-semibold text-emerald-800">Wali Kelas:</span>
            <span className="font-bold">{waliKelas.nama}</span>
            <a
              href={`https://wa.me/${waliKelas.noHp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-1 flex items-center space-x-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi WA</span>
            </a>
          </div>
        )}
      </div>

      {selectedSiswa && (
        <div className="space-y-6">
          {/* Ananda Summary Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    selectedSiswa.foto ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={selectedSiswa.nama}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Rombel {selectedSiswa.rombel}
                    </span>
                    <span className="text-xs text-slate-500">
                      NIS: {selectedSiswa.nis}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedSiswa.nama}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Panggilan: "{selectedSiswa.panggilan}" | Wali: {selectedSiswa.namaAyah}
                  </p>
                </div>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-2 gap-3 text-center min-w-48">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Poin Pelanggaran
                  </span>
                  <span
                    className={`text-base font-black ${
                      totalPoints >= 15 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {totalPoints} Poin
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                    Prestasi Diraih
                  </span>
                  <span className="text-base font-black text-emerald-900">
                    {studentPrestasis.length} Penghargaan
                  </span>
                </div>
              </div>
            </div>

            {/* Health & Nature Notes */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-950 flex items-start space-x-2">
                <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Catatan Kesehatan & Alergi:</strong>
                  <p className="text-slate-700 mt-0.5">{selectedSiswa.riwayatKesehatan}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex items-start space-x-2">
                <Compass className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Panduan Aktivitas di Alam:</strong>
                  <p className="text-slate-700 mt-0.5">{selectedSiswa.pantanganAlam}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mutaba'ah Section */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>Jurnal Mutaba'ah Ibadah Harian Ananda</span>
              </h4>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Terverifikasi Asatidz
              </span>
            </div>

            {studentMutabaah.length > 0 ? (
              studentMutabaah.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Tanggal: {m.tanggal}</span>
                    <span className="text-slate-500 font-semibold">Tercatat di Sistem Sekolah</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                      {m.sholatDhuha ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Dhuha</span>
                        <span className="font-bold text-slate-800">
                          {m.sholatDhuha ? 'Lengkap' : 'Belum'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">Subuh</span>
                      <span className="font-bold text-slate-800">{m.sholatSubuh}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">Dzuhur & Ashar</span>
                      <span className="font-bold text-slate-800">{m.sholatDzuhurAshar}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                      {m.alMatsuratPagi ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Al-Ma'tsurat</span>
                        <span className="font-bold text-slate-800">
                          {m.alMatsuratPagi ? 'Tuntas' : 'Belum'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capaian Tahfidz & Iqro untuk Orang Tua */}
                  {m.hafalanQuranIqro && (
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-extrabold text-emerald-950 flex items-center space-x-1">
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            Tahfidz: {m.hafalanQuranIqro.kategori === 'Al-Qur\'an' ? (m.hafalanQuranIqro.juz || 'Al-Qur\'an') : (m.hafalanQuranIqro.jilidIqro || 'Iqro')}
                          </span>
                        </span>
                        {m.hafalanQuranIqro.totalJuzTuntas && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            ⭐ {m.hafalanQuranIqro.totalJuzTuntas}
                          </span>
                        )}
                        {m.hafalanQuranIqro.predikat && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {m.hafalanQuranIqro.predikat}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-700">
                        <strong className="text-slate-900">
                          {m.hafalanQuranIqro.kategori === 'Al-Qur\'an' ? 'Setoran Surat & Ayat:' : 'Materi / Halaman:'}
                        </strong>{' '}
                        <span className="text-emerald-900 font-semibold">
                          {m.hafalanQuranIqro.kategori === 'Al-Qur\'an'
                            ? (m.hafalanQuranIqro.suratDanAyat || m.tilawah)
                            : (m.hafalanQuranIqro.halamanIqro || m.tilawah)}
                        </span>
                      </p>
                      {m.hafalanQuranIqro.catatanMuhaffizh && (
                        <p className="text-[10px] italic text-slate-600 bg-white/70 p-1.5 rounded-lg border border-emerald-100">
                          "{m.hafalanQuranIqro.catatanMuhaffizh}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="bg-[#FAFDF9] p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                    <p>
                      <strong className="text-slate-800">Tilawah:</strong> {m.tilawah}
                    </p>
                    <p>
                      <strong className="text-slate-800">Adab Alam:</strong> {m.adabAlam}
                    </p>
                    {m.catatanGuru && (
                      <p className="italic text-emerald-900 pt-1 border-t border-emerald-100">
                        "{m.catatanGuru}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                Belum ada entri mutaba'ah hari ini untuk ananda.
              </p>
            )}
          </div>

          {/* Prestasi Ananda */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span>Rekam Prestasi & Piagam Ananda</span>
            </h4>

            {studentPrestasis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studentPrestasis.map((pres) => (
                  <div
                    key={pres.id}
                    className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {pres.kategori}
                      </span>
                      <h5 className="font-extrabold text-slate-900 text-xs mt-1">
                        {pres.nama}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Tingkat {pres.tingkat} | {pres.tanggal}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenPiagamModal(pres)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 cursor-pointer"
                    >
                      Lihat Piagam
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                Belum ada rekam piagam yang tercatat. Terus dukung ananda bertumbuh!
              </p>
            )}
          </div>

          {/* Riwayat Pelanggaran & Catatan Adab */}
          {studentPelanggarans.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-amber-200 bg-amber-50/30 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Catatan Kedisiplinan & Edukasi Karakter</span>
              </h4>
              <p className="text-xs text-slate-600">
                Pencatatan dilakukan secara transparan sebagai sarana evaluasi dan pembiasaan adab Qur'ani bersama antara rumah dan sekolah.
              </p>

              <div className="space-y-2">
                {studentPelanggarans.map((pel) => (
                  <div
                    key={pel.id}
                    className="p-3.5 rounded-2xl bg-white border border-amber-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-amber-900">{pel.bentuk}</span>
                      <span className="font-bold text-red-600">+{pel.poin} Poin</span>
                    </div>
                    <p className="text-slate-600">
                      <strong>Tanggal:</strong> {pel.tanggal} | <strong>Guru:</strong> {pel.guru}
                    </p>
                    <p className="text-slate-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <strong>Tindak Lanjut Pemulihan Adab:</strong> {pel.tindakLanjut}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pengumuman & Agenda Sekolah untuk Wali Santri */}
          {pengumumanList.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-emerald-700" />
                <h4 className="font-extrabold text-slate-900 text-base">
                  Warta & Pengumuman Sekolah
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pengumumanList.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          p.kategori === 'Penting'
                            ? 'bg-rose-100 text-rose-800'
                            : p.kategori === 'Kegiatan Alam'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {p.kategori}
                      </span>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{p.tanggal}</span>
                      </div>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs">{p.judul}</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{p.isi}</p>
                    <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                      Oleh: {p.penulis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
