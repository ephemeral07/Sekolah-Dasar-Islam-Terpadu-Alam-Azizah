import React, { useState, useEffect, useRef } from 'react';
import { X, Award, Upload } from 'lucide-react';
import { Prestasi, Siswa } from '../../types';

interface ModalEditPrestasiProps {
  isOpen: boolean;
  onClose: () => void;
  prestasi: Prestasi | null;
  siswaList: Siswa[];
  onSave: (updated: Prestasi) => void;
}

export const ModalEditPrestasi: React.FC<ModalEditPrestasiProps> = ({
  isOpen,
  onClose,
  prestasi,
  siswaList,
  onSave,
}) => {
  const [siswaId, setSiswaId] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<Prestasi['kategori']>('Keagamaan (Tahfidz)');
  const [tingkat, setTingkat] = useState<Prestasi['tingkat']>('Kecamatan');
  const [penyelenggara, setPenyelenggara] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [piagamUrl, setPiagamUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (prestasi) {
      setSiswaId(prestasi.siswaId);
      setNama(prestasi.nama);
      setKategori(prestasi.kategori);
      setTingkat(prestasi.tingkat);
      setPenyelenggara(prestasi.penyelenggara);
      setTanggal(prestasi.tanggal);
      setPiagamUrl(prestasi.piagamUrl || '');
    }
  }, [prestasi, isOpen]);

  if (!isOpen || !prestasi) return null;

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
      ...prestasi,
      siswaId,
      nama,
      kategori,
      tingkat,
      penyelenggara,
      tanggal,
      piagamUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Edit Data Prestasi & Piagam
              </h3>
              <p className="text-slate-500 text-[11px]">
                Perbarui torehan piala, sertifikat, atau piagam kejuaraan murid
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

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Nama Prestasi / Juara
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Juara 1 MHQ 3 Juz"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Kategori Prestasi
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Prestasi['kategori'])}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Keagamaan (Tahfidz)">Keagamaan (Tahfidz)</option>
                <option value="Kegiatan Alam & Survival">Kegiatan Alam & Survival</option>
                <option value="Akademik">Akademik</option>
                <option value="Non-Akademik / Olahraga Sunnah">Non-Akademik / Olahraga Sunnah</option>
                <option value="Seni & Budaya Islami">Seni & Budaya Islami</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Tingkat Kejuaraan
              </label>
              <select
                value={tingkat}
                onChange={(e) => setTingkat(e.target.value as Prestasi['tingkat'])}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Sekolah">Tingkat Sekolah</option>
                <option value="Kecamatan">Tingkat Kecamatan</option>
                <option value="Kabupaten/Kota">Tingkat Kabupaten/Kota</option>
                <option value="Provinsi">Tingkat Provinsi</option>
                <option value="Nasional">Tingkat Nasional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Instansi Penyelenggara
              </label>
              <input
                type="text"
                required
                value={penyelenggara}
                onChange={(e) => setPenyelenggara(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Tanggal Perolehan
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Unggah Foto / Berkas Piagam dari Penyimpanan
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePiagamUpload}
            />
            <div className="flex items-center space-x-2">
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
                  ✓ Foto piagam terlampir
                </span>
              )}
            </div>
            {piagamUrl && (
              <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img src={piagamUrl} alt="Piagam" className="w-full h-full object-cover" />
              </div>
            )}
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
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition cursor-pointer"
            >
              Simpan Prestasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
