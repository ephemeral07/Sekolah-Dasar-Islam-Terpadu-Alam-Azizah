import React, { useState } from 'react';
import {
  Search,
  Plus,
  Heart,
  Compass,
  Award,
  AlertTriangle,
  FileText,
  Trash2,
  Eye,
  CheckCircle,
  Pencil,
  UserMinus,
  Layers,
} from 'lucide-react';
import { Siswa, Pelanggaran, Prestasi, Mutasi, UserRole, RombelItem, UiTextConfig } from '../types';

interface KesiswaanViewProps {
  currentRole: UserRole;
  siswaList: Siswa[];
  pelanggaranList: Pelanggaran[];
  prestasiList: Prestasi[];
  mutasiList: Mutasi[];
  rombelList?: RombelItem[];
  uiTextConfig?: UiTextConfig;
  onOpenKelolaRombel?: () => void;
  onOpenTambahSiswa: () => void;
  onOpenEditSiswa?: (siswa: Siswa) => void;
  onDeleteSiswa?: (siswaId: string) => void;
  onOpenTambahPelanggaran: (siswaId?: string) => void;
  onOpenEditPelanggaran: (pelanggaran: Pelanggaran) => void;
  onDeletePelanggaran: (id: string) => void;
  onOpenTambahPrestasi: (siswaId?: string) => void;
  onOpenEditPrestasi: (prestasi: Prestasi) => void;
  onDeletePrestasi: (id: string) => void;
  onOpenTambahMutasi: () => void;
  onOpenEditMutasi: (mutasi: Mutasi) => void;
  onDeleteMutasi: (id: string) => void;
  onSelectSiswaForDetail: (siswa: Siswa) => void;
  onOpenPiagamModal: (prestasi: Prestasi) => void;
}

export const KesiswaanView: React.FC<KesiswaanViewProps> = ({
  currentRole,
  siswaList,
  pelanggaranList,
  prestasiList,
  mutasiList,
  rombelList = [],
  uiTextConfig,
  onOpenKelolaRombel,
  onOpenTambahSiswa,
  onOpenEditSiswa,
  onDeleteSiswa,
  onOpenTambahPelanggaran,
  onOpenEditPelanggaran,
  onDeletePelanggaran,
  onOpenTambahPrestasi,
  onOpenEditPrestasi,
  onDeletePrestasi,
  onOpenTambahMutasi,
  onOpenEditMutasi,
  onDeleteMutasi,
  onSelectSiswaForDetail,
  onOpenPiagamModal,
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'pelanggaran' | 'prestasi' | 'mutasi'>('biodata');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRombel, setSelectedRombel] = useState('ALL');

  // Filter students
  const filteredSiswa = siswaList.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery) ||
      s.panggilan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRombel = selectedRombel === 'ALL' || s.rombel === selectedRombel;
    return matchesSearch && matchesRombel;
  });

  const getRombelLabel = (code: string) => {
    const found = rombelList.find((r) => r.kode === code);
    if (found) return found.nama;
    switch (code) {
      case '1A':
        return 'Kelas 1 - Abu Bakar';
      case '2A':
        return 'Kelas 2 - Umar';
      case '3A':
        return 'Kelas 3 - Utsman';
      case '4A':
        return 'Kelas 4 - Ali';
      case '5A':
        return 'Kelas 5 - Thoriq';
      case '6A':
        return 'Kelas 6 - Shalahuddin';
      default:
        return code;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Modul Kesiswaan & Tracking Perkembangan Murid
          </h2>
          <p className="text-xs text-slate-500">
            Mencatat rekam jejak murid secara utuh selama menempuh studi di SDIT Alam Azizah
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {currentRole === 'pengelola' && onOpenKelolaRombel && (
            <button
              onClick={onOpenKelolaRombel}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 text-emerald-800" />
              <span>Kelola Nama Rombel</span>
            </button>
          )}

          {currentRole !== 'ortu' && (
            <button
              onClick={onOpenTambahSiswa}
              className="px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-emerald-800 transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{uiTextConfig?.btnTambahMurid || '+ Tambah Murid Baru'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('biodata')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'biodata'
              ? 'bg-[#1B4332] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Buku Induk & Biodata ({siswaList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pelanggaran')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'pelanggaran'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Pelanggaran & Kedisiplinan ({pelanggaranList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('prestasi')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'prestasi'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rekam Prestasi & Piagam ({prestasiList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('mutasi')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'mutasi'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserMinus className="w-4 h-4" />
          <span>Buku Mutasi & Alumni ({mutasiList.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: BUKU INDUK BIODATA MURID */}
      {activeTab === 'biodata' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari murid via nama lengkap, panggilan, atau NIS..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Rombel:</span>
              <select
                value={selectedRombel}
                onChange={(e) => setSelectedRombel(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">Semua Rombel ({rombelList.length})</option>
                {rombelList.map((r) => (
                  <option key={r.id} value={r.kode}>
                    {r.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSiswa.map((siswa) => {
              const studentPels = pelanggaranList.filter((p) => p.siswaId === siswa.id);
              const totalPoin = studentPels.reduce((acc, curr) => acc + curr.poin, 0);
              const studentPres = prestasiList.filter((p) => p.siswaId === siswa.id);

              return (
                <div
                  key={siswa.id}
                  className="glass-card rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 transition shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo, Name, NIS */}
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={
                          siswa.foto ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={siswa.nama}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 shrink-0 shadow-xs"
                      />
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-emerald-800">
                            {getRombelLabel(siswa.rombel)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">NIS: {siswa.nis}</span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm mt-1 truncate">
                          {siswa.nama}
                        </h3>
                        <p className="text-xs text-slate-500">Panggilan: {siswa.panggilan}</p>
                      </div>
                    </div>

                    {/* Stats Pill */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          Poin Disiplin
                        </span>
                        <span
                          className={`font-black text-xs ${
                            totalPoin > 10 ? 'text-red-600' : 'text-slate-800'
                          }`}
                        >
                          {totalPoin} Poin
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-semibold block">Prestasi</span>
                        <span className="font-black text-xs text-emerald-700">
                          {studentPres.length} Penghargaan
                        </span>
                      </div>
                    </div>

                    {/* Detail Khusus Sekolah Alam */}
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-start space-x-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="truncate">
                          <strong className="text-slate-700">Kesehatan:</strong> {siswa.riwayatKesehatan}
                        </span>
                      </div>
                      <div className="flex items-start space-x-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="truncate">
                          <strong className="text-slate-700">Pantangan Alam:</strong> {siswa.pantanganAlam}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectSiswaForDetail(siswa)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Rapor Karakter</span>
                    </button>

                    {currentRole !== 'ortu' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onOpenTambahPelanggaran(siswa.id)}
                          title="Catat Pelanggaran Murid"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenTambahPrestasi(siswa.id)}
                          title="Input Piagam Prestasi"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        {/* Pengelola Exclusive: Edit & Delete */}
                        {currentRole === 'pengelola' && onOpenEditSiswa && (
                          <button
                            onClick={() => onOpenEditSiswa(siswa)}
                            title="Edit Data Murid Ini (Pengelola)"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {currentRole === 'pengelola' && onDeleteSiswa && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Yakin ingin menghapus murid "${siswa.nama}" (NIS: ${siswa.nis}) secara permanen?`
                                )
                              ) {
                                onDeleteSiswa(siswa.id);
                              }
                            }}
                            title="Hapus Data Murid Ini (Pengelola)"
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: POIN PELANGGARAN */}
      {activeTab === 'pelanggaran' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Pencatatan pelanggaran, poin kedisiplinan, dan tindak lanjut wali kelas / pemanggilan orang tua.
            </p>
            {currentRole !== 'ortu' && (
              <button
                onClick={() => onOpenTambahPelanggaran()}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{uiTextConfig?.btnCatatPelanggaran || '+ Catat Pelanggaran'}</span>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Murid</th>
                    <th className="p-3">Bentuk Pelanggaran</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Poin</th>
                    <th className="p-3">Guru Pencatat</th>
                    <th className="p-3">Status Penanganan</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pelanggaranList.map((pel) => {
                    const student = siswaList.find((s) => s.id === pel.siswaId);
                    return (
                      <tr key={pel.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 text-slate-500 whitespace-nowrap">{pel.tanggal}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {student?.nama || 'Murid'}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            {student ? getRombelLabel(student.rombel) : ''}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs text-slate-700 leading-relaxed">{pel.bentuk}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                              pel.kategori === 'Berat'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : pel.kategori === 'Sedang'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {pel.kategori}
                          </span>
                        </td>
                        <td className="p-3 font-black text-red-600">+{pel.poin}</td>
                        <td className="p-3 text-slate-600">{pel.guru}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg inline-block ${
                              pel.status.includes('Pemanggilan')
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : pel.status.includes('Tuntas')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {pel.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {currentRole !== 'ortu' && (
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => onOpenEditPelanggaran(pel)}
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                                title="Edit Catatan Pelanggaran"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus catatan pelanggaran "${pel.bentuk}"?`)) {
                                    onDeletePelanggaran(pel.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                title="Hapus Catatan Pelanggaran"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {pelanggaranList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        Belum ada catatan pelanggaran murid.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: BUKU REKAM PRESTASI */}
      {activeTab === 'prestasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Pencatatan prestasi akademik, keagamaan (tahfidz), non-akademik, dan kegiatan alam (survival camp).
            </p>
            {currentRole !== 'ortu' && (
              <button
                onClick={() => onOpenTambahPrestasi()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{uiTextConfig?.btnCatatPrestasi || '+ Catat Prestasi'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prestasiList.map((pres) => {
              const student = siswaList.find((s) => s.id === pres.siswaId);
              return (
                <div
                  key={pres.id}
                  className="glass-card rounded-2xl p-5 border border-emerald-100 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {pres.kategori}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{pres.tanggal}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {pres.nama}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">
                      Murid: {student?.nama} ({student ? getRombelLabel(student.rombel) : ''})
                    </p>
                    <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                      <p>
                        <span className="font-bold text-slate-700">Tingkat:</span> {pres.tingkat}
                      </p>
                      <p>
                        <span className="font-bold text-slate-700">Penyelenggara:</span> {pres.penyelenggara}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Terverifikasi Kesiswaan</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenPiagamModal(pres)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Lihat Piagam</span>
                      </button>

                      {currentRole !== 'ortu' && (
                        <>
                          <button
                            onClick={() => onOpenEditPrestasi(pres)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                            title="Edit Data Prestasi"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus prestasi "${pres.nama}"?`)) {
                                onDeletePrestasi(pres.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                            title="Hapus Data Prestasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: BUKU MUTASI & ALUMNI */}
      {activeTab === 'mutasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Riwayat mutasi masuk, keluar, dan basis data alumni murid SDIT Alam Azizah.
            </p>
            {currentRole !== 'ortu' && (
              <button
                onClick={onOpenTambahMutasi}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 transition cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{uiTextConfig?.btnCatatMutasi || '+ Catat Mutasi'}</span>
              </button>
            )}
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Nama Murid</th>
                    <th className="p-3">Jenis Mutasi</th>
                    <th className="p-3">No. Surat Resmi</th>
                    <th className="p-3">Keterangan / Sekolah Lanjutan</th>
                    <th className="p-3">Catatan</th>
                    {currentRole !== 'ortu' && <th className="p-3 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mutasiList.map((mut) => (
                    <tr key={mut.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-slate-500 whitespace-nowrap">{mut.tanggal}</td>
                      <td className="p-3 font-bold text-slate-900">{mut.namaSiswa}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                            mut.jenis === 'Masuk'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : mut.jenis === 'Keluar'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {mut.jenis}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 text-[11px]">{mut.noSurat}</td>
                      <td className="p-3 text-slate-700">{mut.keterangan}</td>
                      <td className="p-3 text-slate-500 italic">{mut.catatan}</td>
                      {currentRole !== 'ortu' && (
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => onOpenEditMutasi(mut)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                              title="Edit Data Mutasi"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus catatan mutasi murid "${mut.namaSiswa}"?`)) {
                                  onDeleteMutasi(mut.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="Hapus Catatan Mutasi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {mutasiList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        Belum ada catatan mutasi murid.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
