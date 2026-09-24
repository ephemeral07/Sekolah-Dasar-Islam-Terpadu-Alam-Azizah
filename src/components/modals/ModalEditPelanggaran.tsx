import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Pelanggaran, Siswa } from '../../types';

interface ModalEditPelanggaranProps {
  isOpen: boolean;
  onClose: () => void;
  pelanggaran: Pelanggaran | null;
  siswaList: Siswa[];
  onSave: (updated: Pelanggaran) => void;
}

export const ModalEditPelanggaran: React.FC<ModalEditPelanggaranProps> = ({
  isOpen,
  onClose,
  pelanggaran,
  siswaList,
  onSave,
}) => {
  const [siswaId, setSiswaId] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [kategori, setKategori] = useState<Pelanggaran['kategori']>('Ringan');
  const [bentuk, setBentuk] = useState('');
  const [poin, setPoin] = useState(5);
  const [status, setStatus] = useState<Pelanggaran['status']>('Menunggu Tindak Lanjut');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [guru, setGuru] = useState('');

  useEffect(() => {
    if (pelanggaran) {
      setSiswaId(pelanggaran.siswaId);
      setTanggal(pelanggaran.tanggal);
      setKategori(pelanggaran.kategori);
      setBentuk(pelanggaran.bentuk);
      setPoin(pelanggaran.poin);
      setStatus(pelanggaran.status);
      setTindakLanjut(pelanggaran.tindakLanjut);
      setGuru(pelanggaran.guru);
    }
  }, [pelanggaran, isOpen]);

  if (!isOpen || !pelanggaran) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...pelanggaran,
      siswaId,
      tanggal,
      kategori,
      bentuk,
      poin: Number(poin),
      status,
      tindakLanjut,
      guru,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Edit Catatan Pelanggaran Kedisiplinan
              </h3>
              <p className="text-slate-500 text-[11px]">
                Perbarui rincian poin, bentuk pelanggaran, dan tindak lanjut adab murid
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Pilih Murid
            </label>
            <select
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
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
              <label className="font-extrabold text-slate-700 block mb-1">
                Tanggal Kejadian
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Pelanggaran['kategori'])}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Ringan">Ringan (5 - 10 Poin)</option>
                <option value="Sedang">Sedang (15 - 25 Poin)</option>
                <option value="Berat">Berat (&gt; 30 Poin)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-extrabold text-slate-700 block mb-1">
                Bentuk / Deskripsi Pelanggaran
              </label>
              <input
                type="text"
                required
                value={bentuk}
                onChange={(e) => setBentuk(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Poin
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={poin}
                onChange={(e) => setPoin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Status Penanganan
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Pelanggaran['status'])}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="Menunggu Tindak Lanjut">Menunggu Tindak Lanjut</option>
              <option value="Sudah Ditindaklanjuti Wali Kelas">Sudah Ditindaklanjuti Wali Kelas</option>
              <option value="Butuh Konseling Guru BK">Butuh Konseling Guru BK</option>
              <option value="Butuh Pemanggilan Orang Tua">Butuh Pemanggilan Orang Tua</option>
              <option value="Tuntas / Pemulihan Adab">Tuntas / Pemulihan Adab</option>
            </select>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Rencana / Catatan Tindak Lanjut
            </label>
            <textarea
              rows={2}
              required
              value={tindakLanjut}
              onChange={(e) => setTindakLanjut(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Guru / Asatidz yang Mencatat
            </label>
            <input
              type="text"
              required
              value={guru}
              onChange={(e) => setGuru(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
