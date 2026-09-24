import React from 'react';
import { Printer, Download, Sparkles } from 'lucide-react';
import { SekolahConfig, UserConfig, Siswa, SDM, Pelanggaran, Prestasi } from '../types';

interface LaporanViewProps {
  sekolahConfig: SekolahConfig;
  userConfig: UserConfig;
  siswaList: Siswa[];
  sdmList: SDM[];
  pelanggaranList: Pelanggaran[];
  prestasiList: Prestasi[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  sekolahConfig,
  userConfig,
  siswaList,
  sdmList,
  pelanggaranList,
  prestasiList,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate clean CSV of all students with infractions and achievements
    const headers = [
      'NIS',
      'NISN',
      'Nama Santri',
      'Rombel',
      'Jenis Kelamin',
      'Nama Ayah/Wali',
      'No WA Ortu',
      'Total Poin Pelanggaran',
      'Total Prestasi',
      'Catatan Kesehatan',
      'Pantangan Alam',
    ];

    const rows = siswaList.map((s) => {
      const totalPoints = pelanggaranList
        .filter((p) => p.siswaId === s.id)
        .reduce((sum, item) => sum + item.poin, 0);
      const totalPres = prestasiList.filter((pr) => pr.siswaId === s.id).length;

      return [
        `"${s.nis}"`,
        `"${s.nisn}"`,
        `"${s.nama.replace(/"/g, '""')}"`,
        `"${s.rombel}"`,
        `"${s.jk}"`,
        `"${s.namaAyah.replace(/"/g, '""')}"`,
        `"${s.waOrtu}"`,
        totalPoints,
        totalPres,
        `"${s.riwayatKesehatan.replace(/"/g, '""')}"`,
        `"${s.pantanganAlam.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Kesiswaan_${sekolahConfig.namaSekolah.replace(/\s+/g, '_')}_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rombelData = [
    { code: '1A', name: 'Kelas 1 - Abu Bakar', wali: 'Ustadzah Maryam Fauziyah, S.Pd' },
    { code: '2A', name: 'Kelas 2 - Umar', wali: 'Ustadzah Khadijah, S.Pd' },
    { code: '3A', name: 'Kelas 3 - Utsman', wali: 'Ustadzah Siti Fatimah, S.Pd' },
    { code: '4A', name: 'Kelas 4 - Ali', wali: 'Ustadz Ilham Pratama, S.Kom' },
    { code: '5A', name: 'Kelas 5 - Thoriq', wali: 'Ustadz Salman Al-Farisi, S.Si' },
    { code: '6A', name: 'Kelas 6 - Shalahuddin', wali: 'Ustadzah Nurul Hidayah, S.Pd.I' },
  ];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Laporan Periodik & Ekspor Dokumen
          </h2>
          <p className="text-xs text-slate-500">
            Unduh data dalam format Excel / CSV atau Cetak Laporan Resmi untuk Rapat Yayasan & Disdik
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Excel (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Official Report Card (Printable Document) */}
      <div
        id="officialReportWrapper"
        className="glass-card rounded-3xl p-8 border border-slate-200 bg-white shadow-md space-y-6"
      >
        {/* Kop Surat Resmi Yayasan & Sekolah */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-wider uppercase">
            {sekolahConfig.yayasan}
          </h1>
          <h2 className="text-lg md:text-xl font-extrabold text-emerald-800">
            {sekolahConfig.namaSekolah.toUpperCase()}
          </h2>
          <p className="text-xs text-slate-600">
            NPSN: {sekolahConfig.npsn} | Izin Operasional Disdik: 421.2/108/DISDIK/2018
          </p>
          <p className="text-[11px] text-slate-500 italic">
            Alamat: {sekolahConfig.alamat} | Telp: {sekolahConfig.telepon} | Email: {sekolahConfig.email}
          </p>
        </div>

        {/* Title */}
        <div className="text-center my-4">
          <h3 className="text-base font-extrabold text-slate-900 uppercase underline decoration-2">
            REKAPITULASI EKSEKUTIF KESISWAAN, MUTABA'AH & SDM ASATIDZ
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Periode Tahun Ajaran {sekolahConfig.tahunAjaran} - Semester {sekolahConfig.semester}
          </p>
        </div>

        {/* Section 1: Rekapitulasi Rombel */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-800 text-sm">
            I. Rekapitulasi Rombongan Belajar & Kedisiplinan Santri
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-300 text-left">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border border-slate-300 text-center w-10">No</th>
                  <th className="p-2 border border-slate-300">Rombongan Belajar</th>
                  <th className="p-2 border border-slate-300">Wali Kelas</th>
                  <th className="p-2 border border-slate-300 text-center">Jumlah Santri</th>
                  <th className="p-2 border border-slate-300 text-center">Total Pelanggaran</th>
                  <th className="p-2 border border-slate-300 text-center">Total Prestasi</th>
                </tr>
              </thead>
              <tbody>
                {rombelData.map((r, idx) => {
                  const students = siswaList.filter((s) => s.rombel === r.code);
                  const count = students.length;
                  const studentIds = students.map((s) => s.id);
                  const totalPel = pelanggaranList
                    .filter((p) => studentIds.includes(p.siswaId))
                    .reduce((sum, item) => sum + item.poin, 0);
                  const totalPres = prestasiList.filter((pr) =>
                    studentIds.includes(pr.siswaId)
                  ).length;

                  return (
                    <tr key={r.code} className="hover:bg-slate-50">
                      <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-bold">{r.name}</td>
                      <td className="p-2 border border-slate-300">{r.wali}</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        {count} Santri
                      </td>
                      <td className="p-2 border border-slate-300 text-center text-red-600 font-bold">
                        {totalPel} Poin
                      </td>
                      <td className="p-2 border border-slate-300 text-center text-emerald-800 font-bold">
                        {totalPres} Prestasi
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Early Warning Status */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-800 text-sm">
            II. Status Sistem Peringatan Dini (Early Warning System)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-300 text-left">
              <thead className="bg-red-50 text-red-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2 border border-slate-300">Kategori Alert</th>
                  <th className="p-2 border border-slate-300">Nama Subjek</th>
                  <th className="p-2 border border-slate-300">Deskripsi Peringatan</th>
                  <th className="p-2 border border-slate-300">Rekomendasi Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold text-red-700">
                    Kedisiplinan Santri
                  </td>
                  <td className="p-2 border border-slate-300 font-bold">
                    Zaid bin Tsabit Ramadhan (5A)
                  </td>
                  <td className="p-2 border border-slate-300">
                    Akumulasi 20 Poin Pelanggaran & Meninggalkan Saung Tanpa Izin
                  </td>
                  <td className="p-2 border border-slate-300">
                    Pemanggilan orang tua murid & pembinaan adab lingkungan di saung bibit
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold text-amber-700">
                    Masa Kontrak SDM
                  </td>
                  <td className="p-2 border border-slate-300 font-bold">
                    Ustadz Salman Al-Farisi, S.Si
                  </td>
                  <td className="p-2 border border-slate-300">
                    Masa kontrak berakhir 31 Oktober 2026 (Sisa &lt; 40 hari)
                  </td>
                  <td className="p-2 border border-slate-300">
                    Penerbitan SK perpanjangan kontrak 2 tahun dengan tunjangan keahlian BNSP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Signatures Block */}
        <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold text-slate-800">Ketua Yayasan Alam Azizah</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[Tertanda Digital]</span>
            </div>
            <p className="font-extrabold underline text-slate-900">
              {userConfig.nama}
            </p>
            <p className="text-[10px] text-slate-500">NIP. 201801001</p>
          </div>

          <div>
            <p>Mengesahkan,</p>
            <p className="font-bold text-slate-800">Kepala Sekolah</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[Tertanda Digital]</span>
            </div>
            <p className="font-extrabold underline text-slate-900">
              Drs. H. Syamsuddin Noor, M.Pd
            </p>
            <p className="text-[10px] text-slate-500">NIP. 201901003</p>
          </div>

          <div>
            <p>Bogor, 23 September 2026</p>
            <p className="font-bold text-slate-800">Koordinator Kesiswaan</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[Tertanda Digital]</span>
            </div>
            <p className="font-extrabold underline text-slate-900">
              Ustadzah Siti Fatimah, S.Pd
            </p>
            <p className="text-[10px] text-slate-500">NIP. 201907004</p>
          </div>
        </div>
      </div>
    </div>
  );
};
