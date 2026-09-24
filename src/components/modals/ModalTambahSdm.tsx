import React, { useState, useRef } from 'react';
import { X, Camera, ShieldCheck, Info } from 'lucide-react';
import { SDM, SdmTipePresensi } from '../../types';

interface ModalTambahSdmProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sdm: Omit<SDM, 'id'>) => void;
}

export const ModalTambahSdm: React.FC<ModalTambahSdmProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [status, setStatus] = useState<SDM['status']>('Kontrak');
  const [tipePresensi, setTipePresensi] = useState<SdmTipePresensi>('Guru Biasa');
  const [tmt, setTmt] = useState(new Date().toISOString().split('T')[0]);
  const [kontrakAkhir, setKontrakAkhir] = useState('2027-09-30');
  const [keahlian, setKeahlian] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran foto maksimal 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nip,
      nuptk: nuptk || '-',
      nama,
      jabatan,
      status,
      tipePresensi,
      tmt,
      kontrakAkhir,
      keahlian: keahlian || 'Pendidikan Karakter Qurani, Alam Terbuka',
      noHp: noHp || '0812xxxxxxxx',
      email: email || `${nama.toLowerCase().replace(/\s+/g, '.')}@sditalamazizah.sch.id`,
      foto:
        foto ||
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      presensiHariIni: {
        status: 'Hadir Tepat Waktu',
        jamMasuk: '06:50 WIB',
        jamPulang: '15:45 WIB',
        keterangan: 'Tugas pendampingan belajar & pembiasaan adab',
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base">Tambah Asatidz / Staf Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Photo upload from storage */}
          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
              <img
                src={
                  foto ||
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
                }
                alt="Foto SDM"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-xs">Foto Asatidz / SDM</p>
              <p className="text-[10px] text-slate-500 mb-1.5">Ambil foto profil dari penyimpanan perangkat</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Pilih Foto dari Penyimpanan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">NIP Yayasan (Wajib)</label>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="202108..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">NUPTK</label>
              <input
                type="text"
                value={nuptk}
                onChange={(e) => setNuptk(e.target.value)}
                placeholder="987654..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Nama Lengkap & Gelar</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ustadz Salman Al-Farisi, S.Pd"
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Jabatan / Amanah</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Guru Alam / Wali Kelas 3"
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Status Kepegawaian</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SDM['status'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Kontrak">Kontrak Yayasan</option>
                <option value="Tetap Yayasan">Tetap Yayasan (GTY)</option>
              </select>
            </div>
          </div>

          {/* Status Penugasan & Presensi */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-emerald-950 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Status & Peran Presensi SDM</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white text-emerald-800 border border-emerald-300">
                Kontrol Pengelola
              </span>
            </div>

            <select
              value={tipePresensi}
              onChange={(e) => setTipePresensi(e.target.value as SdmTipePresensi)}
              className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="Pengelola">👑 Pengelola (Bebas Batas Jam Masuk)</option>
              <option value="Kepsek">🎓 Kepala Sekolah (Bebas Batas Jam Masuk)</option>
              <option value="Guru Biasa">👨‍🏫 Guru Biasa (Hadir 07.00, Toleransi s.d 07.05)</option>
              <option value="Karyawan">🧹 Karyawan / Kebersihan / Satpam (Bebas Jam Masuk — Disamakan Pengelola)</option>
              <option value="Guru Piket">⏰ Guru Piket Pagi (Hadir 06.30, Toleransi s.d 06.45)</option>
            </select>

            <div className="text-[11px] text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-100 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                {tipePresensi === 'Karyawan' && (
                  <span>
                    <strong>Aturan Karyawan:</strong> Untuk staf kebersihan, perawatan taman/saung, atau satpam, jam presensi <strong>disamakan dengan Pengelola</strong> (bebas batas keterlambatan dan langsung terverifikasi Hadir Tepat Waktu).
                  </span>
                )}
                {tipePresensi === 'Pengelola' && (
                  <span>
                    <strong>Aturan Pengelola:</strong> Hak akses eksekutif yayasan dengan jam dinas fleksibel tanpa batas keterlambatan.
                  </span>
                )}
                {tipePresensi === 'Kepsek' && (
                  <span>
                    <strong>Aturan Kepala Sekolah:</strong> Tugas manajerial dan kepemimpinan sekolah dengan jam dinas fleksibel tanpa batas keterlambatan.
                  </span>
                )}
                {tipePresensi === 'Guru Biasa' && (
                  <span>
                    <strong>Aturan Guru Biasa:</strong> Jam masuk standar pukul <strong>07.00 WIB</strong> (batas toleransi <strong>07.05 WIB</strong>). Scan setelah 07.05 otomatis tercatat "Terlambat".
                  </span>
                )}
                {tipePresensi === 'Guru Piket' && (
                  <span>
                    <strong>Aturan Guru Piket:</strong> Jam masuk pagi pukul <strong>06.30 WIB</strong> (batas toleransi <strong>06.45 WIB</strong>) untuk menyambut kedatangan murid di gerbang alam.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">TMT (Awal Masuk)</label>
              <input
                type="date"
                required
                value={tmt}
                onChange={(e) => setTmt(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Batas Akhir Kontrak</label>
              <input
                type="date"
                required
                value={kontrakAkhir}
                onChange={(e) => setKontrakAkhir(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Keahlian & Lisensi Khusus</label>
            <input
              type="text"
              value={keahlian}
              onChange={(e) => setKeahlian(e.target.value)}
              placeholder="Sertifikasi Kepanduan Alam, BNSP, Tahfidz 30 Juz"
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">No. WhatsApp / HP</label>
              <input
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="0812..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Email Resmi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sditalamazizah.sch.id"
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
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
              Simpan Data Asatidz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
