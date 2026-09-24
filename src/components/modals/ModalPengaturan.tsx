import React, { useState, useEffect } from 'react';
import { X, Settings, User, Building } from 'lucide-react';
import { SekolahConfig, UserConfig } from '../../types';

interface ModalPengaturanProps {
  isOpen: boolean;
  onClose: () => void;
  sekolahConfig: SekolahConfig;
  userConfig: UserConfig;
  onSaveSekolah: (config: SekolahConfig) => void;
  onSaveUser: (config: UserConfig) => void;
}

export const ModalPengaturan: React.FC<ModalPengaturanProps> = ({
  isOpen,
  onClose,
  sekolahConfig,
  userConfig,
  onSaveSekolah,
  onSaveUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'sekolah'>('profil');

  // User form state
  const [userNama, setUserNama] = useState(userConfig.nama);
  const [userEmail, setUserEmail] = useState(userConfig.email);
  const [userHp, setUserHp] = useState(userConfig.hp);
  const [userRoleLabel, setUserRoleLabel] = useState(userConfig.roleLabel);
  const [userAvatar, setUserAvatar] = useState(userConfig.avatar);

  // School form state
  const [sekolahNama, setSekolahNama] = useState(sekolahConfig.namaSekolah);
  const [sekolahYayasan, setSekolahYayasan] = useState(sekolahConfig.yayasan);
  const [sekolahNpsn, setSekolahNpsn] = useState(sekolahConfig.npsn);
  const [sekolahTahunAjaran, setSekolahTahunAjaran] = useState(sekolahConfig.tahunAjaran);
  const [sekolahSemester, setSekolahSemester] = useState<SekolahConfig['semester']>(
    sekolahConfig.semester
  );
  const [sekolahSemboyan, setSekolahSemboyan] = useState(sekolahConfig.semboyan);
  const [sekolahAlamat, setSekolahAlamat] = useState(sekolahConfig.alamat);
  const [sekolahTelepon, setSekolahTelepon] = useState(sekolahConfig.telepon);
  const [sekolahEmail, setSekolahEmail] = useState(sekolahConfig.email);

  useEffect(() => {
    setUserNama(userConfig.nama);
    setUserEmail(userConfig.email);
    setUserHp(userConfig.hp);
    setUserRoleLabel(userConfig.roleLabel);
    setUserAvatar(userConfig.avatar);

    setSekolahNama(sekolahConfig.namaSekolah);
    setSekolahYayasan(sekolahConfig.yayasan);
    setSekolahNpsn(sekolahConfig.npsn);
    setSekolahTahunAjaran(sekolahConfig.tahunAjaran);
    setSekolahSemester(sekolahConfig.semester);
    setSekolahSemboyan(sekolahConfig.semboyan);
    setSekolahAlamat(sekolahConfig.alamat);
    setSekolahTelepon(sekolahConfig.telepon);
    setSekolahEmail(sekolahConfig.email);
  }, [userConfig, sekolahConfig, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...userConfig,
      nama: userNama,
      email: userEmail,
      hp: userHp,
      roleLabel: userRoleLabel,
      avatar: userAvatar,
    });

    onSaveSekolah({
      ...sekolahConfig,
      namaSekolah: sekolahNama,
      yayasan: sekolahYayasan,
      npsn: sekolahNpsn,
      tahunAjaran: sekolahTahunAjaran,
      semester: sekolahSemester,
      semboyan: sekolahSemboyan,
      alamat: sekolahAlamat,
      telepon: sekolahTelepon,
      email: sekolahEmail,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Pengaturan Sekolah & Akun Pengelola
              </h3>
              <p className="text-xs text-slate-500">
                Ubah data identitas sekolah, yayasan, dan profil pengguna aktif
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons Inside Settings Modal */}
        <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`pb-2 px-3 transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'profil'
                ? 'text-emerald-800 border-b-2 border-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Pengelola (User Aktif)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sekolah')}
            className={`pb-2 px-3 transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'sekolah'
                ? 'text-emerald-800 border-b-2 border-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Identitas Sekolah & Lembaga</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* TAB 1: PROFIL PENGELOLA */}
          {activeTab === 'profil' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs">
                Data ini ditampilkan pada sidebar, navbar, pencatat buku pembinaan internal, dan penandatangan berkas resmi yayasan.
              </div>

              <div>
                <label className="font-bold text-slate-700">Nama Lengkap & Gelar Pengelola</label>
                <input
                  type="text"
                  required
                  value={userNama}
                  onChange={(e) => setUserNama(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Email Pengelola</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={userHp}
                    onChange={(e) => setUserHp(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Label Peran di Tampilan</label>
                <input
                  type="text"
                  required
                  value={userRoleLabel}
                  onChange={(e) => setUserRoleLabel(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Foto Profil Pengelola</label>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <img
                    src={userAvatar}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="file"
                      id="uploadPengaturanAvatar"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 3 * 1024 * 1024) {
                            alert('Ukuran foto maksimal 3MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setUserAvatar(ev.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="uploadPengaturanAvatar"
                      className="inline-block px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Pilih Foto dari Galeri / Penyimpanan
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">Dukung format JPG, PNG, WEBP hingga 3MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITAS SEKOLAH */}
          {activeTab === 'sekolah' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                Data ini digunakan untuk header aplikasi, kop laporan resmi yayasan, dan administrasi kesiswaan.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Nama Sekolah</label>
                  <input
                    type="text"
                    required
                    value={sekolahNama}
                    onChange={(e) => setSekolahNama(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Nama Yayasan Penyelenggara</label>
                  <input
                    type="text"
                    required
                    value={sekolahYayasan}
                    onChange={(e) => setSekolahYayasan(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">NPSN</label>
                  <input
                    type="text"
                    required
                    value={sekolahNpsn}
                    onChange={(e) => setSekolahNpsn(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Tahun Ajaran</label>
                  <input
                    type="text"
                    required
                    value={sekolahTahunAjaran}
                    onChange={(e) => setSekolahTahunAjaran(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Semester</label>
                  <select
                    value={sekolahSemester}
                    onChange={(e) =>
                      setSekolahSemester(e.target.value as SekolahConfig['semester'])
                    }
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Semboyan / Motto Sekolah</label>
                <input
                  type="text"
                  required
                  value={sekolahSemboyan}
                  onChange={(e) => setSekolahSemboyan(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 italic focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Alamat Lengkap Sekolah</label>
                <textarea
                  rows={2}
                  required
                  value={sekolahAlamat}
                  onChange={(e) => setSekolahAlamat(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Telepon Resmi</label>
                  <input
                    type="text"
                    value={sekolahTelepon}
                    onChange={(e) => setSekolahTelepon(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Email Resmi</label>
                  <input
                    type="email"
                    value={sekolahEmail}
                    onChange={(e) => setSekolahEmail(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
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
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
