import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Siswa, Pelanggaran } from '../../types';

interface ModalCatatPelanggaranProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  defaultSiswaId?: string;
  onSave: (pel: Omit<Pelanggaran, 'id'>) => void;
}

export const ModalCatatPelanggaran: React.FC<ModalCatatPelanggaranProps> = ({
  isOpen,
  onClose,
  siswaList,
  defaultSiswaId,
  onSave,
}) => {
  const [siswaId, setSiswaId] = useState(defaultSiswaId || siswaList[0]?.id || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState<'Ringan' | 'Sedang' | 'Berat'>('Ringan');
  const [bentuk, setBentuk] = useState('');
  const [poin, setPoin] = useState(5);
  const [guru, setGuru] = useState('Ustadzah Siti Fatimah, S.Pd');
  const [status, setStatus] = useState<Pelanggaran['status']>('Menunggu Tindak Lanjut');
  const [tindakLanjut, setTindakLanjut] = useState('');

  if (!isOpen) return null;

  const handleKategoriChange = (val: 'Ringan' | 'Sedang' | 'Berat') => {
    setKategori(val);
    if (val === 'Ringan') setPoin(5);
    else if (val === 'Sedang') setPoin(15);
    else if (val === 'Berat') setPoin(40);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      siswaId: siswaId || siswaList[0]?.id,
      tanggal,
      kategori,
      bentuk,
      poin: Number(poin),
      guru,
      status,
      tindakLanjut: tindakLanjut || 'Edukasi adab Qurani dan bimbingan wali kelas.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Catat Poin Pelanggaran Kedisiplinan Murid
            </h3>
            <p className="text-slate-500 text-[11px]">
              Input pelanggaran tata tertib dan adab untuk pembinaan karakter
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700">Pilih Murid</label>
            <select
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.rombel}) - NIS {s.nis}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Tanggal Kejadian</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Kategori Pelanggaran</label>
              <select
                value={kategori}
                onChange={(e) => handleKategoriChange(e.target.value as 'Ringan' | 'Sedang' | 'Berat')}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Ringan">Ringan (5 Poin)</option>
                <option value="Sedang">Sedang (15 Poin)</option>
                <option value="Berat">Berat (40 Poin)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Bentuk Pelanggaran / Kronologi</label>
            <textarea
              required
              rows={2}
              value={bentuk}
              onChange={(e) => setBentuk(e.target.value)}
              placeholder="Contoh: Mengotori saung belajar, terlambat sholat berjamaah..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Jumlah Poin</label>
              <input
                type="number"
                min="1"
                max="100"
                value={poin}
                onChange={(e) => setPoin(Number(e.target.value))}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-black text-red-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Guru / Asatidz Pelapor</label>
              <input
                type="text"
                required
                value={guru}
                onChange={(e) => setGuru(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Status Penanganan</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Pelanggaran['status'])}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="Menunggu Tindak Lanjut">Menunggu Tindak Lanjut</option>
              <option value="Sudah Ditindaklanjuti Wali Kelas">Sudah Ditindaklanjuti Wali Kelas</option>
              <option value="Butuh Konseling Guru BK">Butuh Konseling Guru BK</option>
              <option value="Butuh Pemanggilan Orang Tua">⚠️ Butuh Pemanggilan Orang Tua</option>
              <option value="Tuntas / Pemulihan Adab">Tuntas / Pemulihan Adab</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700">
              Rencana Tindak Lanjut / Edukasi Karakter
            </label>
            <input
              type="text"
              value={tindakLanjut}
              onChange={(e) => setTindakLanjut(e.target.value)}
              placeholder="Contoh: Membersihkan bedengan tanaman sayur, setoran istighfar..."
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
              className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition cursor-pointer"
            >
              Simpan Pelanggaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
