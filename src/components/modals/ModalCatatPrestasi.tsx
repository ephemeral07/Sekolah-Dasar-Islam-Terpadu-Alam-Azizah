import React, { useState, useRef } from 'react';
import { X, Award, Upload } from 'lucide-react';
import { Siswa, Prestasi } from '../../types';

interface ModalCatatPrestasiProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  defaultSiswaId?: string;
  onSave: (prestasi: Omit<Prestasi, 'id'>) => void;
}

export const ModalCatatPrestasi: React.FC<ModalCatatPrestasiProps> = ({
  isOpen,
  onClose,
  siswaList,
  defaultSiswaId,
  onSave,
}) => {
  const [siswaId, setSiswaId] = useState(defaultSiswaId || siswaList[0]?.id || '');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<Prestasi['kategori']>('Keagamaan (Tahfidz)');
  const [tingkat, setTingkat] = useState<Prestasi['tingkat']>('Kecamatan');
  const [penyelenggara, setPenyelenggara] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [piagamUrl, setPiagamUrl] = useState(
    'https://images.unsplash.com/photo-1589330694653-dad6bc0140fa?w=600&auto=format&fit=crop&q=80'
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handlePiagamUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran berkas piagam maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPiagamUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      siswaId: siswaId || siswaList[0]?.id,
      nama,
      kategori,
      tingkat,
      penyelenggara: penyelenggara || 'Kemenag / JSIT Indonesia',
      tanggal,
      piagamUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Catat Rekam Prestasi Murid
              </h3>
              <p className="text-slate-500 text-[11px]">
                Input torehan kejuaraan, piagam, dan apresiasi bakat murid
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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

          <div>
            <label className="font-bold text-slate-700">Nama Prestasi / Kejuaraan</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Juara 1 Lomba MHQ Juz 30..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Kategori Prestasi</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Prestasi['kategori'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Keagamaan (Tahfidz)">Keagamaan (Tahfidz / MHQ)</option>
                <option value="Kegiatan Alam & Survival">Kegiatan Alam & Survival</option>
                <option value="Akademik">Akademik (Sains / Matematika)</option>
                <option value="Non-Akademik / Olahraga Sunnah">
                  Olahraga Sunnah (Panahan / Silat)
                </option>
                <option value="Seni & Budaya Islami">Seni & Budaya Islami</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700">Tingkat</label>
              <select
                value={tingkat}
                onChange={(e) => setTingkat(e.target.value as Prestasi['tingkat'])}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Sekolah">Tingkat Sekolah</option>
                <option value="Kecamatan">Tingkat Kecamatan</option>
                <option value="Kabupaten/Kota">Kabupaten / Kota</option>
                <option value="Provinsi">Tingkat Provinsi</option>
                <option value="Nasional">Tingkat Nasional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700">Penyelenggara</label>
              <input
                type="text"
                value={penyelenggara}
                onChange={(e) => setPenyelenggara(e.target.value)}
                placeholder="Kemenag / JSIT / Pramuka..."
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700">Tanggal Pencapaian</label>
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
            <label className="font-bold text-slate-700">Unggah Piagam / Sertifikat dari Penyimpanan</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePiagamUpload}
            />
            <div className="flex items-center space-x-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold flex items-center space-x-1.5 cursor-pointer text-slate-700"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Pilih Foto dari Perangkat</span>
              </button>
              {piagamUrl && (
                <span className="text-[10px] text-emerald-700 font-bold">
                  ✓ Foto piagam siap
                </span>
              )}
            </div>
            {piagamUrl && (
              <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img src={piagamUrl} alt="Piagam" className="w-full h-full object-cover" />
              </div>
            )}
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
              Simpan Prestasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
