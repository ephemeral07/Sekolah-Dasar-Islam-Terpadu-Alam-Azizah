import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldAlert,
  Trash2,
  KeyRound,
  CheckCircle,
  Crown,
  AlertTriangle,
  Sparkles,
  Check,
  Edit2,
} from 'lucide-react';
import { UserAccount, UserRole, Siswa, Rombel } from '../../types';

interface ModalManajemenUserProps {
  isOpen: boolean;
  onClose: () => void;
  userAccounts: UserAccount[];
  currentUser: UserAccount;
  siswaList: Siswa[];
  rombelList?: Rombel[];
  onAddUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
}

export const ModalManajemenUser: React.FC<ModalManajemenUserProps> = ({
  isOpen,
  onClose,
  userAccounts,
  currentUser,
  siswaList,
  rombelList = [],
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [nama, setNama] = useState('');
  const [role, setRole] = useState<UserRole>('guru');
  const [roleLabel, setRoleLabel] = useState('Wali Kelas / Guru');
  const [assignedRombel, setAssignedRombel] = useState(
    rombelList.length > 0 ? rombelList[0].nama : 'Kelas 1 - Abu Bakar'
  );
  const [assignedSiswaId, setAssignedSiswaId] = useState(siswaList[0]?.id || '');

  // Edit password state
  const [editPasswordValue, setEditPasswordValue] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'pengelola') {
      setRoleLabel('Pengelola (Admin Super)');
    } else if (newRole === 'kepsek') {
      setRoleLabel('Kepala Sekolah');
    } else if (newRole === 'guru') {
      setRoleLabel('Wali Kelas / Guru');
    } else if (newRole === 'ortu') {
      setRoleLabel('Orang Tua / Wali Santri');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nama) return;

    // Check email uniqueness
    if (
      userAccounts.some(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      setNotificationMsg('Email ini sudah terdaftar sebagai akun pengguna!');
      setTimeout(() => setNotificationMsg(null), 3500);
      return;
    }

    onAddUser({
      email: email.trim().toLowerCase(),
      password: password || 'password123',
      nama,
      role,
      roleLabel,
      assignedRombel: role === 'guru' ? assignedRombel : undefined,
      assignedSiswaId: role === 'ortu' ? assignedSiswaId : undefined,
      isMasterOwner: false,
      avatar:
        role === 'pengelola'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
          : role === 'kepsek'
          ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
          : role === 'guru'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    });

    setNotificationMsg(`Akun untuk ${nama} (${email}) berhasil ditambahkan.`);
    setTimeout(() => setNotificationMsg(null), 3500);

    setEmail('');
    setNama('');
    setPassword('password123');
    setShowAddForm(false);
  };

  const handleSavePassword = (user: UserAccount) => {
    if (!editPasswordValue) return;
    onUpdateUser({
      ...user,
      password: editPasswordValue,
    });
    setEditingUserId(null);
    setEditPasswordValue('');
    setNotificationMsg(`Kata sandi akun ${user.nama} berhasil diperbarui.`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const targetName = userToDelete.nama;
    onDeleteUser(userToDelete.id);
    setUserToDelete(null);
    setNotificationMsg(`Hak akses akun ${targetName} berhasil dihapus.`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Manajemen Akses & Email Pengguna
              </h3>
              <p className="text-slate-500 text-[11px]">
                Kelola hak akses untuk Pengelola, Kepala Sekolah, Wali Kelas/Guru, dan Orang Tua santri.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Owner Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <p className="font-bold">
              Hak Akses Utama Dimiliki: <span className="underline font-mono">hamzahardika07@gmail.com</span>
            </p>
            <p className="text-emerald-800 text-[10px] mt-0.5">
              Sebagai Pengelola Utama, Anda memiliki wewenang penuh menambah pengelola lain, kepsek, guru wali kelas, dan menghapus akun akses kapan saja.
            </p>
          </div>
        </div>

        {/* Notification Banner */}
        {notificationMsg && (
          <div className="p-3 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* In-app Non-blocking Delete Confirmation */}
        {userToDelete && (
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 space-y-3 animate-in fade-in">
            <div className="flex items-start space-x-2.5 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-sm text-red-950">
                  Konfirmasi Hapus Hak Akses Pengguna
                </h4>
                <p className="text-xs text-red-800 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus hak akses akun untuk:
                  <span className="block mt-1 font-bold text-slate-900 bg-white/70 p-2 rounded-xl border border-red-200">
                    👤 {userToDelete.nama} ({userToDelete.email}) — Peran: {userToDelete.roleLabel || userToDelete.role}
                    {userToDelete.assignedRombel && ` | Rombel: ${userToDelete.assignedRombel}`}
                  </span>
                </p>
                <p className="text-[11px] text-red-600 mt-1">
                  Pengguna ini tidak akan bisa lagi masuk ke dalam aplikasi sistem kesiswaan & SDM.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1 border-t border-red-200">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-white font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Akses Akun Ini</span>
              </button>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-between items-center pt-1">
          <span className="font-extrabold text-slate-800 text-sm">
            Daftar Pengguna Aktif ({userAccounts.length} Akun)
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form' : '+ Tambah Email Pengguna'}</span>
          </button>
        </div>

        {/* Form Tambah Pengguna */}
        {showAddForm && (
          <form
            onSubmit={handleCreateUser}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
          >
            <h4 className="font-black text-slate-900 text-xs flex items-center space-x-1 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Beri Akses Akun / Email Baru</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Alamat Email (Wajib)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Lengkap Pemilik Akun
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama & Gelar..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Kategori Peran (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="pengelola">👑 Pengelola (Admin Super - Akses Penuh)</option>
                  <option value="kepsek">🎓 Kepala Sekolah</option>
                  <option value="guru">👨‍🏫 Wali Kelas / Guru</option>
                  <option value="ortu">👨‍👩‍👧 Orang Tua / Wali Santri</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kata Sandi Sementara
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dynamic Rombel selection based on actual rombelList */}
            {role === 'guru' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Penugasan Rombel / Kelas Binaan (Sesuai Rombel Dasbor)
                </label>
                <select
                  value={assignedRombel}
                  onChange={(e) => setAssignedRombel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {rombelList.length > 0 ? (
                    rombelList.map((r) => (
                      <option key={r.id} value={r.nama}>
                        {r.nama} ({r.tingkat}) — Wali: {r.waliKelas}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Kelas 1 - Abu Bakar">Kelas 1 - Abu Bakar</option>
                      <option value="Kelas 2 - Umar">Kelas 2 - Umar</option>
                      <option value="Kelas 3 - Utsman">Kelas 3 - Utsman</option>
                      <option value="Kelas 4 - Ali">Kelas 4 - Ali</option>
                      <option value="Kelas 5 - Thoriq">Kelas 5 - Thoriq</option>
                      <option value="Kelas 6 - Shalahuddin">Kelas 6 - Shalahuddin</option>
                    </>
                  )}
                  <option value="Semua Rombel (Guru Sentra / Olahraga / Tahfidz)">
                    Semua Rombel (Guru Sentra / Olahraga / Tahfidz)
                  </option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 Nama-nama rombel di atas otomatis tersinkronisasi dengan perubahan di dasbor ("Kelola Rombel").
                </p>
              </div>
            )}

            {role === 'ortu' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Ananda / Santri yang Terhubung
                </label>
                <select
                  value={assignedSiswaId}
                  onChange={(e) => setAssignedSiswaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.rombel}) - NIS {s.nis}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition cursor-pointer"
              >
                Simpan & Beri Hak Akses
              </button>
            </div>
          </form>
        )}

        {/* User Accounts List */}
        <div className="space-y-2.5">
          {userAccounts.map((acc) => {
            const isSelf = acc.id === currentUser.id;
            const isEditingPassword = editingUserId === acc.id;

            return (
              <div
                key={acc.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={acc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={acc.nama}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-xs">
                        {acc.nama}
                      </span>
                      {acc.isMasterOwner && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                          <Crown className="w-2.5 h-2.5 text-amber-700" />
                          <span>Owner Utama</span>
                        </span>
                      )}
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          (Anda)
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 font-mono">{acc.email}</p>

                    <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          acc.role === 'pengelola'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : acc.role === 'kepsek'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : acc.role === 'guru'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-purple-100 text-purple-800 border border-purple-300'
                        }`}
                      >
                        {acc.role}
                      </span>

                      {/* Rombel for teacher */}
                      {acc.role === 'guru' && (
                        <div className="flex items-center space-x-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                          <span>Rombel:</span>
                          <select
                            value={acc.assignedRombel || ''}
                            onChange={(e) => {
                              onUpdateUser({
                                ...acc,
                                assignedRombel: e.target.value,
                              });
                              setNotificationMsg(`Rombel untuk ${acc.nama} diubah ke ${e.target.value}`);
                              setTimeout(() => setNotificationMsg(null), 3000);
                            }}
                            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                          >
                            {rombelList.length > 0 ? (
                              rombelList.map((r) => (
                                <option key={r.id} value={r.nama}>
                                  {r.nama}
                                </option>
                              ))
                            ) : (
                              <option value={acc.assignedRombel}>{acc.assignedRombel}</option>
                            )}
                            <option value="Semua Rombel (Guru Sentra / Olahraga / Tahfidz)">
                              Semua Rombel
                            </option>
                          </select>
                        </div>
                      )}

                      {acc.assignedSiswaId && (
                        <span className="text-[10px] text-slate-500">
                          Santri:{' '}
                          <strong>
                            {siswaList.find((s) => s.id === acc.assignedSiswaId)?.nama || acc.assignedSiswaId}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {isEditingPassword ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        placeholder="Sandi Baru"
                        value={editPasswordValue}
                        onChange={(e) => setEditPasswordValue(e.target.value)}
                        className="p-1.5 text-[11px] rounded-lg border border-slate-300 w-28 focus:outline-none font-mono"
                      />
                      <button
                        onClick={() => handleSavePassword(acc)}
                        className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 cursor-pointer"
                        title="Simpan Kata Sandi"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUserId(acc.id);
                        setEditPasswordValue(acc.password);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 flex items-center space-x-1 font-semibold cursor-pointer"
                      title="Ubah Kata Sandi Akun"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Sandi</span>
                    </button>
                  )}

                  {!acc.isMasterOwner && (
                    <button
                      onClick={() => setUserToDelete(acc)}
                      className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition cursor-pointer"
                      title="Hapus Hak Akses Akun"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
