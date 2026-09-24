import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Phone,
  Mail,
  Shield,
  Clock,
  Plus,
  Edit,
  Lock,
  Compass,
  AlertTriangle,
  Award,
  Trash2,
  QrCode,
  MapPin,
  CheckCircle2,
  Scan,
  Printer,
  Sparkles,
} from 'lucide-react';
import { SDM, SdmTipePresensi, Pembinaan, UserRole, UiTextConfig } from '../types';

interface SdmViewProps {
  currentRole: UserRole;
  sdmList: SDM[];
  pembinaanList: Pembinaan[];
  uiTextConfig?: UiTextConfig;
  onOpenTambahSdm: () => void;
  onOpenEditSdm: (sdm: SDM) => void;
  onUpdateSdm?: (sdm: SDM) => void;
  onDeleteSdm?: (sdmId: string) => void;
  onOpenTambahPembinaan: () => void;
  onOpenEditPembinaan?: (pem: Pembinaan) => void;
  onDeletePembinaan?: (pemId: string) => void;
  onOpenScanPresensi?: () => void;
  onOpenBarcodeCards?: () => void;
}

export const SdmView: React.FC<SdmViewProps> = ({
  currentRole,
  sdmList,
  pembinaanList,
  uiTextConfig,
  onOpenTambahSdm,
  onOpenEditSdm,
  onUpdateSdm,
  onDeleteSdm,
  onOpenTambahPembinaan,
  onOpenEditPembinaan,
  onDeletePembinaan,
  onOpenScanPresensi,
  onOpenBarcodeCards,
}) => {
  const [activeTab, setActiveTab] = useState<'database' | 'portofolio' | 'presensi' | 'pembinaan'>('database');

  const getContractStatusBadge = (sdm: SDM) => {
    if (sdm.status === 'Tetap Yayasan') {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Tetap Yayasan
        </span>
      );
    }
    const endDate = new Date(sdm.kontrakAkhir);
    const now = new Date('2026-09-23');
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 60) {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-red-100 text-red-700 border border-red-300 animate-pulse">
          Kontrak Berakhir {diffDays} Hari
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
        Kontrak Aktif ({diffDays} Hari)
      </span>
    );
  };

  // Presensi calculations
  const totalSdm = sdmList.length;
  const tepatWaktuCount = sdmList.filter((s) => s.presensiHariIni.status === 'Hadir Tepat Waktu').length;
  const terlambatCount = sdmList.filter((s) => s.presensiHariIni.status === 'Terlambat').length;
  const hadirCount = tepatWaktuCount + terlambatCount;
  const tingkatKehadiran = totalSdm > 0 ? Math.round((hadirCount / totalSdm) * 100) : 100;
  const tingkatKedisiplinan = hadirCount > 0 ? Math.round((tepatWaktuCount / hadirCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Modul SDM Guru & Karyawan
          </h2>
          <p className="text-xs text-slate-500">
            Database asatidz, rekam portofolio keahlian alam, presensi barcode GPS, dan buku pembinaan internal yayasan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onOpenBarcodeCards && (
            <button
              onClick={onOpenBarcodeCards}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4 text-emerald-800" />
              <span>Barcode Guru & Pengelola</span>
            </button>
          )}

          {onOpenScanPresensi && (
            <button
              onClick={onOpenScanPresensi}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Presensi GPS</span>
            </button>
          )}

          {currentRole === 'pengelola' && (
            <button
              onClick={onOpenTambahSdm}
              className="px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-emerald-800 transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{uiTextConfig?.btnTambahSdm || '+ Tambah Asatidz / Staf'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs SDM */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'database'
              ? 'text-emerald-800 border-b-2 border-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Database & Berkas Kontrak ({sdmList.length})
        </button>
        <button
          onClick={() => setActiveTab('portofolio')}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer transition ${
            activeTab === 'portofolio'
              ? 'text-emerald-800 border-b-2 border-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Portofolio Keahlian Alam
        </button>
        <button
          onClick={() => setActiveTab('presensi')}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer transition flex items-center space-x-1.5 ${
            activeTab === 'presensi'
              ? 'text-emerald-800 border-b-2 border-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Presensi & Kedisiplinan Barcode</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            GPS Sync
          </span>
        </button>
        <button
          onClick={() => setActiveTab('pembinaan')}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer transition flex items-center space-x-1.5 ${
            activeTab === 'pembinaan'
              ? 'text-emerald-800 border-b-2 border-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Buku Pembinaan Pengelola ({pembinaanList.length})</span>
          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full font-bold">
            Private
          </span>
        </button>
      </div>

      {/* SUBTAB 1: DATABASE & BERKAS KONTRAK */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sdmList.map((sdm) => (
            <div
              key={sdm.id}
              className="glass-card rounded-3xl p-5 border border-slate-200 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        sdm.foto ||
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={sdm.nama}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {sdm.nama}
                      </h3>
                      <p className="text-xs text-emerald-800 font-semibold">{sdm.jabatan}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        NIP: {sdm.nip} | {sdm.barcodeId || `SDM-${sdm.id}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status Kepegawaian:</span>
                    {getContractStatusBadge(sdm)}
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-500">Status & Presensi:</span>
                    {currentRole === 'pengelola' && onUpdateSdm ? (
                      <select
                        value={
                          sdm.tipePresensi ||
                          (sdm.jabatan.toLowerCase().includes('kepala')
                            ? 'Kepsek'
                            : sdm.jabatan.toLowerCase().includes('kebersihan') ||
                              sdm.jabatan.toLowerCase().includes('karyawan') ||
                              sdm.jabatan.toLowerCase().includes('satpam')
                            ? 'Karyawan'
                            : 'Guru Biasa')
                        }
                        onChange={(e) => {
                          const newTipe = e.target.value as SdmTipePresensi;
                          onUpdateSdm({
                            ...sdm,
                            tipePresensi: newTipe,
                          });
                        }}
                        title="Klik untuk langsung mengubah peran/status SDM (Aturan presensi otomatis menyesuaikan)"
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                          sdm.tipePresensi === 'Karyawan'
                            ? 'bg-teal-50 text-teal-900 border-teal-300'
                            : sdm.tipePresensi === 'Pengelola'
                            ? 'bg-purple-50 text-purple-900 border-purple-300'
                            : sdm.tipePresensi === 'Kepsek'
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                            : sdm.tipePresensi === 'Guru Piket'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <option value="Guru Biasa">👨‍🏫 Guru Biasa (07.00/07.05)</option>
                        <option value="Karyawan">🧹 Karyawan (Bebas Disamakan Pengelola)</option>
                        <option value="Pengelola">👑 Pengelola (Bebas Jam Dinas)</option>
                        <option value="Kepsek">🎓 Kepsek (Bebas Jam Dinas)</option>
                        <option value="Guru Piket">⏰ Guru Piket (06.30/06.45)</option>
                      </select>
                    ) : (
                      <span
                        className={`font-bold px-2 py-0.5 rounded-lg text-[10px] border ${
                          sdm.tipePresensi === 'Karyawan'
                            ? 'bg-teal-50 text-teal-900 border-teal-200'
                            : sdm.tipePresensi === 'Pengelola'
                            ? 'bg-purple-50 text-purple-900 border-purple-200'
                            : sdm.tipePresensi === 'Kepsek'
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                            : sdm.tipePresensi === 'Guru Piket'
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {sdm.tipePresensi || 'Guru Biasa'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>TMT & Akhir Kontrak:</span>
                    <span className="font-bold text-slate-800">
                      {sdm.tmt} s.d {sdm.kontrakAkhir}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600 pt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sdm.noHp}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{sdm.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pengelola */}
              {currentRole === 'pengelola' && (
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenEditSdm(sdm)}
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition cursor-pointer flex items-center space-x-1 text-xs font-bold"
                    title="Ubah Data Asatidz"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  {onDeleteSdm && (
                    <button
                      onClick={() => onDeleteSdm(sdm.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer flex items-center space-x-1 text-xs font-bold"
                      title="Hapus Asatidz"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: PORTOFOLIO KEAHLIAN ALAM */}
      {activeTab === 'portofolio' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Daftar kompetensi spesifik asatidz di bidang kepanduan, pertukangan kayu, budidaya permakultur, tahfidz bersanad, dan survival rimba.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdmList.map((sdm) => {
              const skills = sdm.keahlian.split(',').map((s) => s.trim());
              return (
                <div
                  key={sdm.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        sdm.foto ||
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={sdm.nama}
                      className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{sdm.nama}</h4>
                      <p className="text-xs text-emerald-800 font-semibold">{sdm.jabatan}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
                      >
                        <Compass className="w-3 h-3 text-emerald-600" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRESENSI & KEDISIPLINAN DENGAN BARCODE GPS */}
      {activeTab === 'presensi' && (
        <div className="space-y-4">
          {/* Rules & Realtime Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">
                Tingkat Kehadiran
              </span>
              <div className="text-2xl font-black text-emerald-900 mt-1">{tingkatKehadiran}%</div>
              <span className="text-[11px] text-slate-500">
                {hadirCount} dari {totalSdm} Asatidz hadir hari ini
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs">
              <span className="text-[10px] font-extrabold uppercase text-blue-800 block">
                Disiplin Tepat Waktu
              </span>
              <div className="text-2xl font-black text-blue-900 mt-1">{tingkatKedisiplinan}%</div>
              <span className="text-[11px] text-slate-500">
                {tepatWaktuCount} tepat waktu, {terlambatCount} terlambat
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 block">
                Aturan Guru Biasa
              </span>
              <div className="font-extrabold text-amber-950 mt-1">Hadir 07:00 (Toleransi s.d 07:05)</div>
              <span className="text-[11px] text-slate-500">
                Lewat 07:05 otomatis tercatat "Terlambat"
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs">
              <span className="text-[10px] font-extrabold uppercase text-purple-800 block">
                Pengelola, Kepsek & Karyawan
              </span>
              <div className="font-extrabold text-purple-950 mt-1">Bebas Batas Jam Masuk</div>
              <span className="text-[11px] text-slate-500">
                Karyawan & staf kebersihan jam presensinya disamakan dengan Pengelola
              </span>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">
                  Rekap Harian Presensi Barcode & GPS (Hari Ini, 23 September 2026)
                </span>
                <span className="text-[11px] text-slate-500">
                  Data tersinkronisasi otomatis saat barcode di scan di area sekolah
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {onOpenScanPresensi && (
                  <button
                    onClick={onOpenScanPresensi}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Scan Barcode Presensi</span>
                  </button>
                )}
                {onOpenBarcodeCards && (
                  <button
                    onClick={onOpenBarcodeCards}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Lihat Barcode Semua</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Nama Asatidz & Barcode</th>
                    <th className="p-3">Kategori Presensi</th>
                    <th className="p-3">Jam Masuk</th>
                    <th className="p-3">Status Kehadiran</th>
                    <th className="p-3">Keterangan / Verifikasi Lokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sdmList.map((sdm) => {
                    const isTerlambat = sdm.presensiHariIni.status === 'Terlambat';
                    return (
                      <tr key={sdm.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={
                                sdm.foto ||
                                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
                              }
                              alt={sdm.nama}
                              className="w-8 h-8 rounded-xl object-cover border border-emerald-300 shrink-0"
                            />
                            <div>
                              <span>{sdm.nama}</span>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono font-normal">
                                <span>{sdm.barcodeId || `SDM-${sdm.id}`}</span>
                                <span>• {sdm.jabatan}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              sdm.tipePresensi === 'Guru Piket'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : sdm.tipePresensi === 'Kepsek'
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                : sdm.tipePresensi === 'Pengelola'
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : sdm.tipePresensi === 'Karyawan'
                                ? 'bg-teal-100 text-teal-800 border-teal-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {sdm.tipePresensi || 'Guru Biasa'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-mono font-bold">
                          {sdm.presensiHariIni.jamMasuk}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              isTerlambat
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {sdm.presensiHariIni.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">
                          <div className="space-y-0.5">
                            <span>{sdm.presensiHariIni.keterangan}</span>
                            {sdm.presensiHariIni.jarakMeter !== undefined && (
                              <span className="block text-[10px] text-emerald-800 font-semibold flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-emerald-600" />
                                <span>Wilayah Sekolah: {sdm.presensiHariIni.jarakMeter}m dari titik sekolah</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: BUKU PEMBINAAN INTERNAL PENGELOLA */}
      {activeTab === 'pembinaan' && (
        <div className="space-y-4">
          {currentRole !== 'pengelola' ? (
            <div className="p-8 rounded-3xl bg-amber-50 border border-amber-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="font-black text-slate-900 text-lg">
                Akses Terbatas: Khusus Peran Pengelola (Super Admin)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Buku pembinaan internal berisi catatan evaluasi rahasia yayasan, pemanggilan staf, coaching teknis, serta addendum insentif dan perpanjangan kontrak.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  Silakan masuk menggunakan akun dengan peran Pengelola untuk membuka modul ini.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Catatan pembinaan rahasia, evaluasi kinerja bulanan, insentif reward, dan rekomendasi perpanjangan kontrak.
                </p>
                <button
                  onClick={onOpenTambahPembinaan}
                  className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition shadow-sm flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{uiTextConfig?.btnCatatPembinaan || '+ Catat Pembinaan Baru'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {pembinaanList.map((pem) => {
                  const sdm = sdmList.find((s) => s.id === pem.sdmId);
                  return (
                    <div
                      key={pem.id}
                      className="glass-card rounded-2xl p-5 border border-purple-100 hover:border-purple-300 transition shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                              {pem.kategori}
                            </span>
                            <span className="text-xs text-slate-500">{pem.tanggal}</span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-base mt-1">
                            {pem.topik}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-2 self-start sm:self-auto">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                            Asatidz: {sdm?.nama || 'SDM'}
                          </span>
                          {onOpenEditPembinaan && (
                            <button
                              onClick={() => onOpenEditPembinaan(pem)}
                              className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-50 border border-purple-200 cursor-pointer text-xs font-bold flex items-center space-x-1"
                              title="Edit Catatan Pembinaan"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                          {onDeletePembinaan && (
                            <button
                              onClick={() => onDeletePembinaan(pem.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer text-xs font-bold flex items-center space-x-1"
                              title="Hapus Pembinaan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <strong className="block text-slate-800 mb-1">Catatan Evaluasi Pengelola:</strong>
                        <p>{pem.catatan}</p>
                      </div>

                      <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200 text-xs text-purple-950">
                        <strong className="block font-bold mb-1">Rekomendasi Tindak Lanjut Yayasan:</strong>
                        <p>{pem.rekomendasi}</p>
                      </div>

                      <div className="text-[11px] text-slate-500 italic text-right">
                        Dicatat oleh: {pem.dicatatOleh}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
