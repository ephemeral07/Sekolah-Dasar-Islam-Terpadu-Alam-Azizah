import React, { useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  HeartHandshake,
  FileSpreadsheet,
  Settings,
  AlertTriangle,
  Sparkles,
  LogOut,
  UserCheck,
  X,
  Camera,
} from 'lucide-react';
import { SekolahConfig, UserAccount, UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onSelectView: (view: string) => void;
  sekolahConfig: SekolahConfig;
  currentUser: UserAccount;
  currentRole: UserRole;
  onUpdateProfilePhoto: (dataUrl: string) => void;
  onOpenSettings: () => void;
  onOpenManajemenUser?: () => void;
  onLogout: () => void;
  ewsCount: { siswa: number; guru: number };
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onSelectView,
  sekolahConfig,
  currentUser,
  currentRole,
  onUpdateProfilePhoto,
  onOpenSettings,
  onOpenManajemenUser,
  onLogout,
  ewsCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar. Silakan pilih foto di bawah 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateProfilePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const allNavItems = [
    { id: 'dashboard', label: 'Dasbor Eksekutif', icon: LayoutDashboard, roles: ['pengelola', 'kepsek', 'guru'] },
    { id: 'kesiswaan', label: 'Kesiswaan & Murid', icon: Users, roles: ['pengelola', 'kepsek', 'guru'] },
    { id: 'mutabaah', label: "Jurnal Mutaba'ah & Alam", icon: BookOpen, roles: ['pengelola', 'kepsek', 'guru'] },
    { id: 'sdm', label: 'SDM Guru & Karyawan', icon: Briefcase, roles: ['pengelola', 'kepsek'] },
    { id: 'ortu', label: 'Portal Wali Murid', icon: HeartHandshake, roles: ['pengelola', 'kepsek', 'guru', 'ortu'] },
    { id: 'laporan', label: 'Laporan & Ekspor Dokumen', icon: FileSpreadsheet, roles: ['pengelola', 'kepsek'] },
  ];

  const filteredNavItems = allNavItems.filter((item) => item.roles.includes(currentRole));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
        title="Klik di luar untuk menutup menu"
      />

      {/* Slide-in Sidebar Drawer */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#1B4332] text-white z-50 shadow-2xl flex flex-col border-r border-emerald-900/60 animate-in slide-in-from-left duration-200">
        {/* Hidden file input for photo upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />

        {/* Drawer Header */}
        <div className="p-4 border-b border-emerald-800/70 flex items-center justify-between bg-gradient-to-b from-[#143326] to-[#1B4332]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 flex items-center justify-center border border-emerald-400/30 shadow-inner text-emerald-200 shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-black text-sm tracking-wide text-white uppercase leading-tight truncate">
                {sekolahConfig.namaSekolah}
              </h1>
              <p className="text-[10px] text-emerald-300 font-semibold tracking-wide truncate">
                Sistem Terpadu Kesiswaan & SDM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition cursor-pointer"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active User Card & Photo Upload */}
        <div className="px-5 py-4 bg-[#143427] border-b border-emerald-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer shrink-0"
                title="Klik untuk ubah foto dari galeri/penyimpanan"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={currentUser.nama}
                  className="w-11 h-11 rounded-full border-2 border-emerald-400 object-cover shadow-sm"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentUser.nama}</p>
                <p className="text-[10px] text-emerald-300/80 truncate font-mono">{currentUser.email}</p>
              </div>
            </div>
            {currentRole === 'pengelola' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                title="Pengaturan Sekolah & Teks Aplikasi"
                className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition shrink-0 ml-1 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {currentUser.role === 'pengelola'
                ? '👑 Pengelola (Admin Super)'
                : currentUser.role === 'kepsek'
                ? '🎓 Kepala Sekolah'
                : currentUser.role === 'guru'
                ? `👨‍🏫 Guru (${currentUser.assignedRombel || 'Sentra'})`
                : '👨‍👩‍👧 Orang Tua / Wali Murid'}
            </span>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              title="Keluar dari Akun"
              className="text-[10px] text-red-300 hover:text-red-200 flex items-center space-x-1 font-bold cursor-pointer transition"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto text-sm">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition cursor-pointer text-left ${
                  isActive
                    ? 'bg-emerald-600/90 text-white font-black shadow-md shadow-emerald-950/40 border border-emerald-400/30'
                    : 'text-emerald-100 hover:bg-emerald-800/70 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-emerald-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Pengelola Exclusive Links: Manajemen Email & Pengaturan */}
          {currentRole === 'pengelola' && (
            <div className="pt-3 mt-3 border-t border-emerald-800/50 space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-400/80 px-3.5 block">
                Menu Khusus Pengelola
              </span>
              {onOpenManajemenUser && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenManajemenUser();
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl font-medium transition text-emerald-200 hover:bg-emerald-800/80 hover:text-white cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="text-xs">Kelola Akses Email & User</span>
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl font-medium transition text-emerald-200 hover:bg-emerald-800/80 hover:text-white cursor-pointer"
              >
                <Settings className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-xs">Edit Teks & Data Sekolah</span>
              </button>
            </div>
          )}
        </nav>

        {/* Early Warning Footer Banner (shown to pengelola, kepsek, guru) */}
        {currentRole !== 'ortu' && (
          <div
            onClick={() => {
              onSelectView('dashboard');
              onClose();
            }}
            className="p-3.5 m-3 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs cursor-pointer hover:bg-amber-950/90 transition shadow-inner"
          >
            <div className="flex items-center space-x-2 font-bold mb-1 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <span>Early Warning Alert</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-200/90">
              {ewsCount.siswa} murid butuh perhatian & {ewsCount.guru} asatidz menjelang jatuh tempo kontrak.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
