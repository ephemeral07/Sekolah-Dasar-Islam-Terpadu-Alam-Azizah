import React from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertOctagon,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Info,
  Clock,
  Edit3,
  QrCode,
  Scan,
  Layers,
} from 'lucide-react';
import {
  Siswa,
  SDM,
  Pelanggaran,
  Prestasi,
  UserRole,
  SekolahConfig,
  DashboardConfig,
  RombelItem,
  Pengumuman,
} from '../types';

interface DashboardViewProps {
  currentRole: UserRole;
  sekolahConfig: SekolahConfig;
  dashboardConfig: DashboardConfig;
  siswaList: Siswa[];
  sdmList: SDM[];
  pelanggaranList: Pelanggaran[];
  prestasiList: Prestasi[];
  rombelList?: RombelItem[];
  pengumumanList?: Pengumuman[];
  onOpenKelolaPengumuman?: () => void;
  onOpenEditDashboardText?: () => void;
  onOpenTambahPelanggaran: () => void;
  onOpenTambahPrestasi: () => void;
  onOpenInputMutabaah: () => void;
  onNavigateToLaporan: () => void;
  onSelectSiswaForDetail: (siswa: Siswa) => void;
  onOpenEditSdm: (sdm: SDM) => void;
  onOpenScanPresensi?: () => void;
  onOpenBarcodeCards?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  sekolahConfig,
  dashboardConfig,
  siswaList,
  sdmList,
  pelanggaranList,
  prestasiList,
  rombelList = [],
  pengumumanList = [],
  onOpenKelolaPengumuman,
  onOpenEditDashboardText,
  onOpenTambahPelanggaran,
  onOpenTambahPrestasi,
  onOpenInputMutabaah,
  onNavigateToLaporan,
  onSelectSiswaForDetail,
  onOpenEditSdm,
  onOpenScanPresensi,
  onOpenBarcodeCards,
}) => {
  // Compute EWS for Murid: violations >= 15 points or status with "Butuh Pemanggilan Orang Tua"
  const studentAlerts = siswaList
    .map((s) => {
      const studentPels = pelanggaranList.filter((p) => p.siswaId === s.id);
      const totalPoints = studentPels.reduce((acc, curr) => acc + curr.poin, 0);
      const urgentStatus = studentPels.some(
        (p) => p.status === 'Butuh Pemanggilan Orang Tua' || p.status === 'Butuh Konseling Guru BK'
      );
      return {
        siswa: s,
        totalPoints,
        urgentStatus,
        recentPel: studentPels[0],
      };
    })
    .filter((item) => item.totalPoints >= 15 || item.urgentStatus);

  // Compute EWS for SDM: contract ending before 2026-12-31 or in 2026
  const sdmAlerts = sdmList.filter((sdm) => {
    if (sdm.status !== 'Kontrak') return false;
    const endDate = new Date(sdm.kontrakAkhir);
    const now = new Date('2026-09-23');
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60; // Expiring in <= 60 days
  });

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'pengelola':
        return {
          title: 'Hak Akses Penuh: Pengelola Yayasan (Super Admin)',
          desc: 'Akses tak terbatas untuk mengelola data sekolah, kurikulum alam, keuangan, catatan pembinaan rahasia SDM, perpanjangan kontrak, serta manajemen murid & email pengguna.',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'kepsek':
        return {
          title: 'Hak Akses: Kepala Sekolah',
          desc: 'Memantau performa asatidz, supervisi kurikulum dan jurnal mutabaah, validasi poin kedisiplinan kesiswaan, serta penerbitan surat resmi murid.',
          badge: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'guru':
        return {
          title: 'Hak Akses: Wali Kelas / Guru Fasilitator',
          desc: 'Mencatat mutabaah harian murid, menginput poin pelanggaran & rekam prestasi rombel binaan, serta mengisi laporan adab lingkungan.',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'ortu':
        return {
          title: 'Hak Akses: Orang Tua / Wali Murid',
          desc: 'Akses terbatas untuk memantau rekam jejak ananda, progres sholat & Al-Quran harian, riwayat poin kedisiplinan, serta piagam prestasi ananda.',
          badge: 'bg-purple-100 text-purple-900 border-purple-300',
        };
    }
  };

  const roleInfo = getRoleDescription(currentRole);

  // Dynamic Rombel Counts
  const rombelCounts: Record<string, number> = {};
  rombelList.forEach((r) => {
    rombelCounts[r.kode] = 0;
  });
  siswaList.forEach((s) => {
    if (rombelCounts[s.rombel] !== undefined) {
      rombelCounts[s.rombel]++;
    } else {
      rombelCounts[s.rombel] = (rombelCounts[s.rombel] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner with Edit Text Capability for Pengelola */}
      <div className="rounded-3xl gradient-forest text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Ekosistem Pendidikan Alam & Karakter Qur'ani</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2 leading-tight">
              {dashboardConfig.welcomeTitle || `Ahlan Wa Sahlan di ${sekolahConfig.namaSekolah}`}
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 font-normal leading-relaxed">
              {dashboardConfig.welcomeSubtitle ||
                "Pantau rekam jejak murid, jurnal mutaba'ah ibadah, portofolio eksplorasi alam, dan tata kelola SDM asatidz secara terpadu, akurat, dan transparan."}
            </p>
          </div>

          {currentRole === 'pengelola' && onOpenEditDashboardText && (
            <button
              onClick={onOpenEditDashboardText}
              className="self-start px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white border border-white/30 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer shrink-0"
              title="Edit Tulisan Sambutan & Kebijakan Dasbor Ini"
            >
              <Edit3 className="w-4 h-4 text-emerald-200" />
              <span>Edit Tulisan Dasbor</span>
            </button>
          )}
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Strategic Announcements / Warta Sekolah */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-emerald-700" />
            <span>Warta & Pengumuman Resmi Sekolah</span>
          </h3>
          {currentRole === 'pengelola' && onOpenKelolaPengumuman && (
            <button
              onClick={onOpenKelolaPengumuman}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kelola Warta & Pengumuman</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pengumumanList.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
                p.penting
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      p.penting
                        ? 'bg-amber-200 text-amber-900 border border-amber-300'
                        : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {p.kategori}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">{p.tanggal}</span>
                </div>
                <h4 className="font-extrabold text-sm">{p.judul}</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{p.isi}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 italic">
                Penerbit: {p.penulis} • Sasaran: {p.targetRole ? p.targetRole.toUpperCase() : 'SEMUA WARGA SEKOLAH'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Access Notice */}
      <div className={`p-4 rounded-2xl border ${roleInfo.badge} flex items-start space-x-3 transition shadow-xs`}>
        <div className="p-2 rounded-xl bg-white/80 shrink-0 shadow-xs">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm">{roleInfo.title}</h4>
          <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{roleInfo.desc}</p>
        </div>
      </div>

      {/* Executive Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-300 transition shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Murid</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{siswaList.length} Murid</div>
            <span className="text-xs text-emerald-700 font-medium">Aktif Tahun Ajaran 2026</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-teal-300 transition shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guru & Staf</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{sdmList.length} Asatidz</div>
            <span className="text-xs text-teal-700 font-medium">100% Bersertifikasi SIT</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 transition shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presensi Barcode</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {sdmList.filter((s) => s.presensiHariIni.status === 'Hadir Tepat Waktu').length} / {sdmList.length}
            </div>
            <span className="text-xs text-blue-700 font-medium">Tepat Waktu Hari Ini</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-amber-300 transition shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mutaba'ah Sholat</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">96.8%</div>
            <span className="text-xs text-amber-700 font-medium">Sholat Tepat Waktu</span>
          </div>
        </div>
      </div>

      {/* ================= EARLY WARNING SYSTEM (EWS) ================= */}
      <div id="ewsSection" className="glass-card rounded-3xl p-6 border-2 border-red-200 bg-red-50/40 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base md:text-lg">
                Sistem Peringatan Dini (Early Warning System)
              </h3>
              <p className="text-xs text-slate-600">
                {dashboardConfig.highlightNote ||
                  'Notifikasi otomatis untuk tindakan preventif kedisiplinan murid dan masa perpanjangan kontrak SDM.'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-300 inline-flex items-center self-start sm:self-auto">
            {studentAlerts.length + sdmAlerts.length} Perlu Tindak Lanjut
          </span>
        </div>

        {/* Alert Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Alerts */}
          {studentAlerts.map((alert) => (
            <div
              key={alert.siswa.id}
              className="p-4 rounded-2xl bg-white border border-red-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                    Kedisiplinan Murid
                  </span>
                  <span className="text-xs font-bold text-red-600">
                    Akumulasi Poin: {alert.totalPoints}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {alert.siswa.nama} ({alert.siswa.rombel})
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {alert.recentPel?.bentuk || 'Pelanggaran membutuhkan konseling dan pemanggilan wali murid.'}
                </p>
                <div className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  Status: {alert.recentPel?.status}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Wali: {alert.siswa.namaAyah} ({alert.siswa.waOrtu})
                </span>
                <button
                  onClick={() => onSelectSiswaForDetail(alert.siswa)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Lihat Berkas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* SDM Alerts */}
          {sdmAlerts.map((sdm) => {
            const endDate = new Date(sdm.kontrakAkhir);
            const now = new Date('2026-09-23');
            const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={sdm.id}
                className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Masa Kontrak Kerja
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {diffDays > 0 ? `Sisa ${diffDays} Hari` : 'Jatuh Tempo'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {sdm.nama}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {sdm.jabatan} (NIP. {sdm.nip})
                  </p>
                  <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800">Batas Kontrak:</span> {sdm.kontrakAkhir}
                    <br />
                    <span className="text-slate-500">Rekomendasi: Agendakan rapat perpanjangan kontrak yayasan.</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{sdm.noHp}</span>
                  <button
                    onClick={() => onOpenEditSdm(sdm)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Perpanjang / Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {studentAlerts.length === 0 && sdmAlerts.length === 0 && (
            <div className="col-span-2 p-6 rounded-2xl bg-white border border-emerald-200 text-center text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
              <p className="font-bold text-sm">Alhamdulillah, Tidak Ada Peringatan Kritis Aktif</p>
              <p className="text-xs text-slate-500 mt-0.5">Seluruh murid dalam ambang poin aman dan kontrak asatidz tertata rapi.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= VISUAL CHARTS & SEBARAN ROMBEL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tren Prestasi vs Pelanggaran */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Tren Prestasi vs Pelanggaran Murid
              </h3>
              <p className="text-xs text-slate-500">
                Grafik evaluasi kedisiplinan dan torehan prestasi murid per bulan (2026)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span className="text-slate-600 font-medium">Prestasi</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 font-medium">Pelanggaran</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-64 flex flex-col justify-end pt-4 pb-2">
            <div className="grid grid-cols-6 gap-3 h-48 items-end px-2 border-b border-slate-200">
              {[
                { month: 'Apr', prestasi: 2, pelanggaran: 4 },
                { month: 'Mei', prestasi: 4, pelanggaran: 3 },
                { month: 'Jun', prestasi: 5, pelanggaran: 1 },
                { month: 'Jul', prestasi: 3, pelanggaran: 2 },
                { month: 'Agu', prestasi: 6, pelanggaran: 2 },
                { month: 'Sep', prestasi: 4, pelanggaran: 3 },
              ].map((data, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="flex items-end space-x-1.5 w-full justify-center h-full">
                    <div
                      style={{ height: `${data.prestasi * 15}%` }}
                      className="w-5 bg-emerald-600 hover:bg-emerald-500 rounded-t-md transition-all relative flex justify-center group-hover:scale-105"
                    >
                      <span className="absolute -top-6 text-[10px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition">
                        {data.prestasi}
                      </span>
                    </div>
                    <div
                      style={{ height: `${data.pelanggaran * 15}%` }}
                      className="w-5 bg-amber-500 hover:bg-amber-400 rounded-t-md transition-all relative flex justify-center group-hover:scale-105"
                    >
                      <span className="absolute -top-6 text-[10px] font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition">
                        {data.pelanggaran}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-2 pt-2">
              <span>Semester Genap 2025/2026</span>
              <span className="text-emerald-700 font-bold">Rasio Prestasi Meningkat +40%</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Sebaran Murid per Rombel */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Sebaran Rombel</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {rombelList.length} Rombel
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Rombongan belajar terbagi rata per tingkat dengan daya tampung ideal sekolah alam.
            </p>

            <div className="space-y-3">
              {rombelList.map((r, idx) => {
                const count = rombelCounts[r.kode] || 0;
                const colors = [
                  'bg-emerald-500',
                  'bg-teal-500',
                  'bg-green-600',
                  'bg-blue-500',
                  'bg-indigo-500',
                  'bg-purple-500',
                ];
                const color = colors[idx % colors.length];
                return (
                  <div key={r.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">{r.nama}</span>
                      <span className="text-slate-500 font-semibold">{count} Murid</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full`}
                        style={{ width: `${Math.min(100, (count / (r.kapasitas || 20)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Kapasitas Maks Saung:</span>
            <span className="font-extrabold text-emerald-800">20 Murid / Kelas</span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-3">Aksi Cepat Manajemen</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {onOpenScanPresensi && (
            <button
              onClick={onOpenScanPresensi}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 transition cursor-pointer"
            >
              <Scan className="w-6 h-6 text-emerald-700 mb-1.5" />
              <span className="text-xs font-bold">Scan Presensi GPS</span>
            </button>
          )}

          {onOpenBarcodeCards && (
            <button
              onClick={onOpenBarcodeCards}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-950 transition cursor-pointer"
            >
              <QrCode className="w-6 h-6 text-teal-700 mb-1.5" />
              <span className="text-xs font-bold">Barcode Asatidz</span>
            </button>
          )}

          <button
            onClick={onOpenTambahPelanggaran}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 transition cursor-pointer"
          >
            <AlertTriangle className="w-6 h-6 text-amber-700 mb-1.5" />
            <span className="text-xs font-bold">+ Catat Pelanggaran</span>
          </button>

          <button
            onClick={onOpenInputMutabaah}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition cursor-pointer"
          >
            <ShieldCheck className="w-6 h-6 text-blue-700 mb-1.5" />
            <span className="text-xs font-bold">+ Input Mutaba'ah</span>
          </button>
        </div>
      </div>
    </div>
  );
};
