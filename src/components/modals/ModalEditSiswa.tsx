import React, { useState, useEffect, useRef } from 'react';
import { X, UserCog, Camera } from 'lucide-react';
import { Siswa } from '../../types';

interface ModalEditSiswaProps {
  isOpen: boolean;
  onClose: () => void;
  siswa: Siswa | null;
  onSave: (updated: Siswa) => void;
}

export const ModalEditSiswa: React.FC<ModalEditSiswaProps> = ({
  isOpen,
  onClose,
  siswa,
  onSave,
}) => {
  const [nis, setNis] = useState('');
  const [nisn, setNisn] = useState('');
  const [nama, setNama] = useState('');
  const [panggilan, setPanggilan] = useState('');
  const [jk, setJk] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [rombel, setRombel] = useState('1A');
  const [namaAyah, setNamaAyah] = useState('');
  const [waOrtu, setWaOrtu] = useState('');
  const [riwayatKesehatan, setRiwayatKesehatan] = useState('');
  const [pantanganAlam, setPantanganAlam] = useState('');
  const [status, setStatus] = useState<Siswa['status']>('Aktif');
  const [foto, setFoto] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (siswa) {
      setNis(siswa.nis);
      setNisn(siswa.nisn);
      setNama(siswa.nama);
      setPanggilan(siswa.panggilan);
      setJk(siswa.jk);
      setTempatLahir(siswa.tempatLahir);
      setTanggalLahir(siswa.tanggalLahir);
      setRombel(siswa.rombel);
      setNamaAyah(siswa.namaAyah);
      setWaOrtu(siswa.waOrtu);
      setRiwayatKesehatan(siswa.riwayatKesehatan);
      setPantanganAlam(siswa.pantanganAlam);
      setStatus(siswa.status);
      setFoto(siswa.foto || '');
    }
  }, [siswa, isOpen]);

  if (!isOpen || !siswa) return null;

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
      ...siswa,
      nis,
      nisn,
      nama,
      panggilan,
      jk,
      tempatLahir,
      tanggalLahir,
      rombel,
      namaAyah,
      waOrtu,
      riwayatKesehatan,
      pantanganAlam,
      status,
      foto:
        foto ||
        (jk === 'Laki-laki'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Data Lengkap Murid
              </h3>
              <p className="text-xs text-slate-500">
                Wewenang Khusus Pengelola (Admin Super)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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
                  (jk === 'Laki-laki'
                    ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')
                }
                alt={nama}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-xs">Ubah Foto Murid</p>
              <p className="text-[10px] text-slate-500 mb-1.5">Ambil foto baru dari penyimpanan komputer atau ponsel</p>
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
              <label className="font-bold text-slate-700">NIS (Nomor Induk Murid)</label>
              <input
                type="text"
                required
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">NISN</label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Nama Lengkap Murid</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Nama Panggilan</label>
              <input
                type="text"
                value={panggilan}
                onChange={(e) => setPanggilan(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Status Keberadaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Siswa['status'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Aktif">Aktif Belajar</option>
                <option value="Mutasi Keluar">Mutasi Keluar</option>
                <option value="Alumni">Lulus Alumni</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Rombel (Kelas)</label>
              <select
                value={rombel}
                onChange={(e) => setRombel(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="1A">Kelas 1 - Abu Bakar</option>
                <option value="2A">Kelas 2 - Umar</option>
                <option value="3A">Kelas 3 - Utsman</option>
                <option value="4A">Kelas 4 - Ali</option>
                <option value="5A">Kelas 5 - Thoriq</option>
                <option value="6A">Kelas 6 - Shalahuddin</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700">Jenis Kelamin</label>
              <select
                value={jk}
                onChange={(e) => setJk(e.target.value as 'Laki-laki' | 'Perempuan')}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Tempat Lahir</label>
              <input
                type="text"
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Tanggal Lahir</label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={namaAyah}
                onChange={(e) => setNamaAyah(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">WhatsApp Orang Tua</label>
              <input
                type="text"
                value={waOrtu}
                onChange={(e) => setWaOrtu(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Riwayat Medis / Alergi</label>
            <input
              type="text"
              value={riwayatKesehatan}
              onChange={(e) => setRiwayatKesehatan(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Pantangan Khusus di Alam Terbuka</label>
            <input
              type="text"
              value={pantanganAlam}
              onChange={(e) => setPantanganAlam(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
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
              Simpan Perubahan Murid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
