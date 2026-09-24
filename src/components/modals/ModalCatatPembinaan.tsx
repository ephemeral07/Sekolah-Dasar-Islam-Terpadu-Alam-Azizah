import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { SDM, Pembinaan, UserConfig } from '../../types';

interface ModalCatatPembinaanProps {
  isOpen: boolean;
  onClose: () => void;
  sdmList: SDM[];
  userConfig: UserConfig;
  onSave: (pem: Omit<Pembinaan, 'id'>) => void;
}

export const ModalCatatPembinaan: React.FC<ModalCatatPembinaanProps> = ({
  isOpen,
  onClose,
  sdmList,
  userConfig,
  onSave,
}) => {
  const [sdmId, setSdmId] = useState(sdmList[0]?.id || '');
  const [kategori, setKategori] = useState<Pembinaan['kategori']>(
    'Rapat Rencana Perpanjangan Kontrak'
  );
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [topik, setTopik] = useState('');
  const [catatan, setCatatan] = useState('');
  const [rekomendasi, setRekomendasi] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      sdmId: sdmId || sdmList[0]?.id,
      kategori,
      tanggal,
      topik,
      catatan,
      rekomendasi,
      dicatatOleh: `${userConfig.nama} (Pengelola)`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-purple-700" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Buku Pembinaan Internal (Private Pengelola)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700">Pilih Asatidz / Staf</label>
            <select
              value={sdmId}
              onChange={(e) => setSdmId(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              {sdmList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} - {s.jabatan}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Kategori Catatan</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Pembinaan['kategori'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Apresiasi / Penghargaan Kinerja">Apresiasi / Reward Kinerja</option>
                <option value="Coaching & Bimbingan Teknis">Coaching & Bimbingan</option>
                <option value="Rapat Rencana Perpanjangan Kontrak">Perpanjangan Kontrak</option>
                <option value="Teguran & Pembinaan Kedisiplinan">Teguran Kedisiplinan</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700">Tanggal</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700">Topik / Agenda Pembinaan</label>
            <input
              type="text"
              required
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Evaluasi tahun ke-3 & usulan kenaikan insentif..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Catatan Rahasia Pengelola</label>
            <textarea
              required
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan hasil rapat pengurus harian yayasan..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700">Rekomendasi Tindak Lanjut</label>
            <input
              type="text"
              value={rekomendasi}
              onChange={(e) => setRekomendasi(e.target.value)}
              placeholder="Contoh: Penerbitan SK perpanjangan kontrak 2 tahun..."
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
              className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-800 transition cursor-pointer"
            >
              Simpan Catatan Pengelola
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
