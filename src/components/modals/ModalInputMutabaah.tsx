import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Award, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { Siswa, Mutabaah, HafalanQuranIqro } from '../../types';

interface ModalInputMutabaahProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  defaultSiswaId?: string;
  onSave: (mutabaah: Omit<Mutabaah, 'id'>) => void;
}

const DAFTAR_JUZ = [
  'Juz 30 (Juz \'Amma)',
  'Juz 29 (Tabarak)',
  'Juz 28 (Qad Sami\'a)',
  'Juz 1 (Al-Baqarah)',
  'Juz 2',
  'Juz 3',
  'Juz 4',
  'Juz 5',
  'Juz 6',
  'Juz 7',
  'Juz 8',
  'Juz 9',
  'Juz 10',
  'Juz 11',
  'Juz 12',
  'Juz 13',
  'Juz 14',
  'Juz 15',
  'Juz 16',
  'Juz 17',
  'Juz 18',
  'Juz 19',
  'Juz 20',
  'Juz 21',
  'Juz 22',
  'Juz 23',
  'Juz 24',
  'Juz 25',
  'Juz 26',
  'Juz 27',
];

const OPSI_TOTAL_JUZ = [
  'Proses Juz 30 (Belum 1 Juz)',
  '1 Juz Tuntas (Juz 30)',
  '2 Juz Tuntas (Juz 30 & 29)',
  '3 Juz Tuntas (Juz 30, 29, 28)',
  '4 Juz Tuntas',
  '5 Juz Tuntas',
  '6 - 10 Juz',
  '11 - 20 Juz',
  '30 Juz (Hafizh / Khatam)',
];

export const ModalInputMutabaah: React.FC<ModalInputMutabaahProps> = ({
  isOpen,
  onClose,
  siswaList,
  defaultSiswaId,
  onSave,
}) => {
  const [siswaId, setSiswaId] = useState(defaultSiswaId || siswaList[0]?.id || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [sholatDhuha, setSholatDhuha] = useState<boolean>(true);
  const [sholatSubuh, setSholatSubuh] = useState<Mutabaah['sholatSubuh']>('Berjamaah di Masjid');
  const [sholatDzuhurAshar, setSholatDzuhurAshar] = useState<Mutabaah['sholatDzuhurAshar']>(
    'Berjamaah di Saung Sekolah'
  );
  const [alMatsuratPagi, setAlMatsuratPagi] = useState<boolean>(true);
  const [tilawah, setTilawah] = useState('Surat An-Nur ayat 35 - 42');
  const [adabAlam, setAdabAlam] = useState('Membawa tumbler & merawat tanaman saung');
  const [catatanGuru, setCatatanGuru] = useState('');

  // Fitur Hafalan Qur'an & Iqro
  const [kategoriHafalan, setKategoriHafalan] = useState<'Al-Qur\'an' | 'Iqro'>('Al-Qur\'an');
  const [juzHafalan, setJuzHafalan] = useState('Juz 30 (Juz \'Amma)');
  const [totalJuzTuntas, setTotalJuzTuntas] = useState('1 Juz Tuntas (Juz 30)');
  const [suratAyatHafalan, setSuratAyatHafalan] = useState('Surat An-Naba\' ayat 1 - 40');
  const [jilidIqro, setJilidIqro] = useState('Iqro 3');
  const [halamanIqro, setHalamanIqro] = useState('Halaman 15 (Makhraj Huruf)');
  const [predikatHafalan, setPredikatHafalan] = useState<NonNullable<HafalanQuranIqro['predikat']>>(
    'Mutqin (Sangat Lancar)'
  );
  const [catatanMuhaffizh, setCatatanMuhaffizh] = useState(
    'Alhamdulillah hafalan lancar, tartil, dan makhraj huruf sangat baik.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      siswaId: siswaId || siswaList[0]?.id,
      tanggal,
      sholatDhuha,
      sholatSubuh,
      sholatDzuhurAshar,
      alMatsuratPagi,
      tilawah,
      adabAlam,
      catatanGuru: catatanGuru || 'Alhamdulillah tertib dan bersemangat mengikuti pembiasaan ibadah.',
      hafalanQuranIqro: {
        kategori: kategoriHafalan,
        juz: kategoriHafalan === 'Al-Qur\'an' ? juzHafalan : undefined,
        totalJuzTuntas: kategoriHafalan === 'Al-Qur\'an' ? totalJuzTuntas : undefined,
        suratDanAyat: kategoriHafalan === 'Al-Qur\'an' ? suratAyatHafalan : undefined,
        jilidIqro: kategoriHafalan === 'Iqro' ? jilidIqro : undefined,
        halamanIqro: kategoriHafalan === 'Iqro' ? halamanIqro : undefined,
        predikat: predikatHafalan,
        catatanMuhaffizh,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Input Jurnal Mutaba'ah & Hafalan Santri
              </h3>
              <p className="text-slate-500 text-[11px]">
                Diisi oleh Muaddib / Wali Kelas untuk pencatatan harian & evaluasi berkala
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Identitas Santri */}
          <div>
            <label className="font-bold text-slate-700">Pilih Santri</label>
            <select
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.rombel}) - NIS: {s.nis}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Tanggal Pengisian</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Sholat Dhuha</label>
              <select
                value={sholatDhuha ? 'true' : 'false'}
                onChange={(e) => setSholatDhuha(e.target.value === 'true')}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="true">✅ Melaksanakan</option>
                <option value="false">❌ Belum</option>
              </select>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FITUR HAFALAN AL-QUR'AN (JUZ) & IQRO (JILID) */}
          {/* ======================================================== */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 border-2 border-emerald-300/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <div className="flex items-center space-x-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-black text-emerald-950 text-xs uppercase tracking-wide">
                  Capaian Hafalan Tahfidz (Al-Qur'an & Iqro)
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                Fitur Wali Kelas
              </span>
            </div>

            {/* Toggle Kategori: Quran vs Iqro */}
            <div className="flex p-1 bg-white rounded-xl border border-emerald-200">
              <button
                type="button"
                onClick={() => setKategoriHafalan('Al-Qur\'an')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                  kategoriHafalan === 'Al-Qur\'an'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📖 Al-Qur'an (Berapa Juz)</span>
              </button>
              <button
                type="button"
                onClick={() => setKategoriHafalan('Iqro')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                  kategoriHafalan === 'Iqro'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📗 Iqro (Jilid 1 - 6)</span>
              </button>
            </div>

            {/* Section Al-Qur'an */}
            {kategoriHafalan === 'Al-Qur\'an' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">
                      Target / Juz yang Sedang Dihafal
                    </label>
                    <select
                      value={juzHafalan}
                      onChange={(e) => setJuzHafalan(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {DAFTAR_JUZ.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">
                      Berapa Juz Total Hafalan Tuntas
                    </label>
                    <select
                      value={totalJuzTuntas}
                      onChange={(e) => setTotalJuzTuntas(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {OPSI_TOTAL_JUZ.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-emerald-950 block mb-1">
                    Surat & Ayat Terakhir yang Disetorkan
                  </label>
                  <input
                    type="text"
                    value={suratAyatHafalan}
                    onChange={(e) => setSuratAyatHafalan(e.target.value)}
                    placeholder="Contoh: Surat An-Naba' ayat 1 - 40, atau Al-Muthaffifin 1-20"
                    className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Section Iqro */}
            {kategoriHafalan === 'Iqro' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-teal-950 block mb-1">
                      Capaian Jilid Iqro
                    </label>
                    <select
                      value={jilidIqro}
                      onChange={(e) => setJilidIqro(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-teal-300 bg-white font-bold text-teal-900 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Iqro 1">Iqro 1 (Huruf Tunggal Hijaiyah)</option>
                      <option value="Iqro 2">Iqro 2 (Huruf Sambung & Mad)</option>
                      <option value="Iqro 3">Iqro 3 (Kasrah, Dhammah, Sukun)</option>
                      <option value="Iqro 4">Iqro 4 (Tanwin, Tasydid, Qalqalah)</option>
                      <option value="Iqro 5">Iqro 5 (Alif Lam, Waqaf, Ikhfa)</option>
                      <option value="Iqro 6">Iqro 6 (Hukum Nun Mati & Mim)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-teal-950 block mb-1">
                      Halaman / Pokok Bahasan
                    </label>
                    <input
                      type="text"
                      value={halamanIqro}
                      onChange={(e) => setHalamanIqro(e.target.value)}
                      placeholder="Contoh: Halaman 15 (Makhraj Huruf Bersambung)"
                      className="w-full p-2.5 rounded-xl border border-teal-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Penilaian Kelancaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Mutu / Kelancaran Hafalan
                </label>
                <select
                  value={predikatHafalan}
                  onChange={(e) =>
                    setPredikatHafalan(
                      e.target.value as NonNullable<HafalanQuranIqro['predikat']>
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Mutqin (Sangat Lancar)">🌟 Mutqin (Sangat Lancar)</option>
                  <option value="Lancar">✅ Lancar</option>
                  <option value="Muraja'ah (Perlu Diulang)">🔄 Muraja'ah (Perlu Diulang)</option>
                  <option value="Tahsin / Perbaikan Tajwid">📖 Tahsin / Perbaikan Tajwid</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Catatan Guru Muhaffizh / Wali
                </label>
                <input
                  type="text"
                  value={catatanMuhaffizh}
                  onChange={(e) => setCatatanMuhaffizh(e.target.value)}
                  placeholder="Catatan makhraj, tajwid, atau penguatan..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ibadah Sholat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Sholat Subuh</label>
              <select
                value={sholatSubuh}
                onChange={(e) => setSholatSubuh(e.target.value as Mutabaah['sholatSubuh'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Berjamaah di Masjid">Berjamaah di Masjid</option>
                <option value="Tepat Waktu (Rumah)">Tepat Waktu (Rumah)</option>
                <option value="Terlambat">Terlambat</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700">Dzuhur & Ashar</label>
              <select
                value={sholatDzuhurAshar}
                onChange={(e) =>
                  setSholatDzuhurAshar(e.target.value as Mutabaah['sholatDzuhurAshar'])
                }
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Berjamaah di Saung Sekolah">Berjamaah di Saung Sekolah</option>
                <option value="Sendiri">Sendiri</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Al-Ma'tsurat Pagi</label>
              <select
                value={alMatsuratPagi ? 'true' : 'false'}
                onChange={(e) => setAlMatsuratPagi(e.target.value === 'true')}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="true">✅ Tuntas Dibaca</option>
                <option value="false">❌ Belum</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700">Tilawah & Ziyadah Surah</label>
              <input
                type="text"
                value={tilawah}
                onChange={(e) => setTilawah(e.target.value)}
                placeholder="Contoh: An-Nur ayat 35 - 42..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Adab Alam & Zero-Waste Hari Ini</label>
            <input
              type="text"
              value={adabAlam}
              onChange={(e) => setAdabAlam(e.target.value)}
              placeholder="Bawa tumbler, rawat tanaman, dll."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Catatan Pembinaan Karakter & Adab</label>
            <input
              type="text"
              value={catatanGuru}
              onChange={(e) => setCatatanGuru(e.target.value)}
              placeholder="Apresiasi atau nasihat santun..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition cursor-pointer"
            >
              Simpan Mutaba'ah & Hafalan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
