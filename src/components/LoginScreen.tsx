import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { UserAccount, SekolahConfig } from '../types';

interface LoginScreenProps {
  sekolahConfig: SekolahConfig;
  userAccounts: UserAccount[];
  onLogin: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  sekolahConfig,
  userAccounts,
  onLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = userAccounts.find(
      (acc) => acc.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('Email tidak terdaftar dalam sistem. Hubungi Pemilik Aplikasi (hamzahardika07@gmail.com) untuk meminta hak akses.');
      return;
    }

    if (found.password !== password) {
      setErrorMsg('Kata sandi salah. Silakan periksa kembali kata sandi Anda.');
      return;
    }

    onLogin(found);
  };

  const handleQuickLogin = (acc: UserAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    onLogin(acc);
  };

  return (
    <div className="min-h-screen bg-[#0F291E] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-slate-800">
      {/* Background Decorative Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-emerald-800/60 bg-white z-10">
        {/* Left Side: School Info & Roles Explanation */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1B4332] via-[#163a2c] to-[#0F291E] text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-800">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 flex items-center justify-center border border-emerald-400/40 shadow-inner text-emerald-200">
                <Sparkles className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-wide uppercase text-white leading-tight">
                  {sekolahConfig.namaSekolah}
                </h1>
                <p className="text-xs text-emerald-300 font-semibold tracking-wide">
                  Sistem Kesiswaan & SDM Terpadu
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-100/80 italic mb-6">
              "{sekolahConfig.semboyan}"
            </p>

            <div className="space-y-3 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-400 block">
                Hak Akses 4 Kategori Pengguna:
              </span>

              <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                  <span>👑 Pengelola (Admin Super)</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 mt-0.5">
                  Akses penuh & wewenang tertinggi: Tambah, edit, dan hapus seluruh data kesiswaan & SDM asatidz, kontrak kerja, pengaturan teks, dan manajemen email pengguna.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <div className="flex items-center space-x-2 text-blue-300 font-bold">
                  <span>🎓 Kepala Sekolah</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 mt-0.5">
                  Akses memantau dan mengedit kesiswaan, validasi buku pelanggaran & rekapitulasi SDM harian.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <span>👨‍🏫 Wali Kelas / Guru</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 mt-0.5">
                  Menginput mutaba'ah harian, mencatat poin kedisiplinan dan prestasi santri di kelas binaannya.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <span>👨‍👩‍👧 Orang Tua / Wali Santri</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 mt-0.5">
                  Khusus melihat laporan ibadah ananda, rekap prestasi, poin karakter, serta pengumuman sekolah.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-800/60 text-[11px] text-emerald-300/80 flex items-center space-x-1.5 mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Master Owner: <strong>hamzahardika07@gmail.com</strong></span>
          </div>
        </div>

        {/* Right Side: Login Form & Demo Selector */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Masuk ke Sistem
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Silakan masukkan email terdaftar dan kata sandi Anda untuk melanjutkan.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-semibold"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-semibold"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white font-extrabold text-xs shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-600 mb-2.5">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Akses Cepat (Akun Demo & Pengujian):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {userAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className={`p-2 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
                    acc.isMasterOwner
                      ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold truncate">
                      {acc.isMasterOwner ? '👑 ' : ''}
                      {acc.nama}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{acc.email}</p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-white border border-slate-200 text-slate-600 shrink-0 ml-1">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Kata sandi bawaan seluruh akun demo: <code className="font-bold text-slate-600">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
