export type UserRole = 'pengelola' | 'kepsek' | 'guru' | 'ortu';

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  nama: string;
  role: UserRole;
  roleLabel: string;
  assignedRombel?: string; // For guru, e.g. "1A", "3A", "5A", or "ALL"
  assignedSiswaId?: string; // For ortu, which child
  isMasterOwner?: boolean; // true for hamzahardika07@gmail.com
  createdAt: string;
  avatar?: string;
  hp?: string;
}

export interface RombelItem {
  id: string;
  kode: string; // e.g. "1A", "2A"
  nama: string; // e.g. "Kelas 1 - Abu Bakar"
  tingkat: number; // 1 to 6
  waliKelas: string;
  keterangan?: string;
  kapasitas?: number;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  panggilan: string;
  jk: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  rombel: string; // refers to RombelItem.kode, e.g. "1A"
  namaAyah: string;
  waOrtu: string;
  riwayatKesehatan: string;
  pantanganAlam: string;
  foto?: string;
  status: 'Aktif' | 'Mutasi Keluar' | 'Alumni';
}

export interface Pelanggaran {
  id: string;
  siswaId: string;
  tanggal: string;
  kategori: 'Ringan' | 'Sedang' | 'Berat';
  bentuk: string;
  poin: number;
  guru: string;
  status:
    | 'Menunggu Tindak Lanjut'
    | 'Sudah Ditindaklanjuti Wali Kelas'
    | 'Butuh Konseling Guru BK'
    | 'Butuh Pemanggilan Orang Tua'
    | 'Tuntas / Pemulihan Adab';
  tindakLanjut: string;
}

export interface Prestasi {
  id: string;
  siswaId: string;
  nama: string;
  kategori:
    | 'Keagamaan (Tahfidz)'
    | 'Kegiatan Alam & Survival'
    | 'Akademik'
    | 'Non-Akademik / Olahraga Sunnah'
    | 'Seni & Budaya Islami';
  tingkat: 'Sekolah' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional';
  penyelenggara: string;
  tanggal: string;
  piagamUrl?: string;
}

export interface Mutasi {
  id: string;
  siswaId?: string;
  namaSiswa: string;
  jenis: 'Masuk' | 'Keluar' | 'Lulus Alumni';
  tanggal: string;
  noSurat: string;
  keterangan: string;
  catatan: string;
}

export interface HafalanQuranIqro {
  kategori: 'Al-Qur\'an' | 'Iqro';
  // Jika Al-Quran:
  juz?: string; // misal "Juz 30 (Juz 'Amma)", "Juz 29", "Juz 1", dsb.
  totalJuzTuntas?: string; // misal "1 Juz (Juz 30)", "2 Juz", "Proses Juz 30"
  suratDanAyat?: string; // misal "An-Naba' 1 - 40"
  // Jika Iqro:
  jilidIqro?: string; // misal "Iqro 1", "Iqro 2", "Iqro 3", "Iqro 4", "Iqro 5", "Iqro 6"
  halamanIqro?: string; // misal "Halaman 18"
  // Penilaian & kelancaran:
  predikat?: 'Mutqin (Sangat Lancar)' | 'Lancar' | 'Muraja\'ah (Perlu Diulang)' | 'Tahsin / Perbaikan Tajwid';
  catatanMuhaffizh?: string;
}

export interface Mutabaah {
  id: string;
  siswaId: string;
  tanggal: string;
  sholatDhuha: boolean;
  sholatSubuh: 'Berjamaah di Masjid' | 'Tepat Waktu (Rumah)' | 'Terlambat';
  sholatDzuhurAshar: 'Berjamaah di Saung Sekolah' | 'Sendiri';
  alMatsuratPagi: boolean;
  tilawah: string;
  adabAlam: string;
  catatanGuru: string;
  hafalanQuranIqro?: HafalanQuranIqro;
}

export type SdmTipePresensi = 'Pengelola' | 'Kepsek' | 'Guru Biasa' | 'Guru Piket' | 'Karyawan';

export interface SDM {
  id: string;
  nip: string;
  nuptk: string;
  nama: string;
  jabatan: string;
  status: 'Kontrak' | 'Tetap Yayasan';
  tmt: string;
  kontrakAkhir: string;
  keahlian: string;
  noHp: string;
  email: string;
  foto?: string;
  barcodeId?: string; // e.g. "SDM-AZIZAH-001"
  tipePresensi?: SdmTipePresensi; // Pengelola (bebas), Kepsek (bebas), Karyawan (bebas disamakan pengelola), Guru Biasa (07.00 tol 07.05), Guru Piket (06.30 tol 06.45)
  presensiHariIni: {
    status: 'Hadir Tepat Waktu' | 'Terlambat' | 'Izin Lapangan' | 'Dinas Luar' | 'Sakit';
    jamMasuk: string;
    jamPulang: string;
    keterangan: string;
    metodeScan?: string;
    waktuScan?: string;
    jarakMeter?: number;
  };
}

export interface Pembinaan {
  id: string;
  sdmId: string;
  kategori:
    | 'Apresiasi / Penghargaan Kinerja'
    | 'Coaching & Bimbingan Teknis'
    | 'Rapat Rencana Perpanjangan Kontrak'
    | 'Teguran & Pembinaan Kedisiplinan';
  tanggal: string;
  topik: string;
  catatan: string;
  rekomendasi: string;
  dicatatOleh: string;
}

export interface SekolahConfig {
  namaSekolah: string;
  yayasan: string;
  npsn: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  semboyan: string;
  alamat: string;
  telepon: string;
  email: string;
  // Geolocation & School Territory for Barcode Attendance
  gmapsUrl: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
}

export interface UserConfig {
  nama: string;
  email: string;
  hp: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  kategori: 'Penting' | 'Kegiatan Alam' | 'Akademik' | 'Umum';
  penulis: string;
  penting?: boolean;
  targetRole?: string;
}

export interface DashboardConfig {
  welcomeTitle: string;
  welcomeSubtitle: string;
  announcementTitle: string;
  announcementText: string;
  highlightNote: string;
}

export interface IndikatorItem {
  id: string;
  nomor: string;
  judul: string;
  deskripsi: string;
}

export interface IndikatorKarakterConfig {
  judul: string;
  items: IndikatorItem[];
}

export interface UiTextConfig {
  btnInputMutabaah: string;
  btnTambahMurid: string;
  btnCatatPelanggaran: string;
  btnCatatPrestasi: string;
  btnCatatMutasi: string;
  btnTambahSdm: string;
  btnCatatPembinaan: string;
}
