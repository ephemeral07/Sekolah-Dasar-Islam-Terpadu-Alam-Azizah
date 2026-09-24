import React, { useState, useRef } from 'react';
import {
  Bell,
  Settings,
  RotateCcw,
  LogOut,
  UserPlus,
  Crown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Camera,
} from 'lucide-react';
import { SekolahConfig, UserAccount, UserRole } from '../types';
import { ModalEditFotoProfil } from './modals/ModalEditFotoProfil';

interface TopNavbarProps {
  currentView: string;
  sekolahConfig: SekolahConfig;
  currentUser: UserAccount;
  currentRole: UserRole;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onUpdateProfilePhoto: (dataUrl: string) => void;
  onOpenSettings: () => void;
  onOpenManajemenUser?: () => void;
  onLogout: () => void;
  onResetData: () => void;
  onScrollToEws: () => void;
  totalAlerts: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentView,
  sekolahConfig,
  currentUser,
  currentRole,
  isSidebarOpen,
  onToggleSidebar,
  onUpdateProfilePhoto,
  onOpenSettings,
  onOpenManajemenUser,
  onLogout,
  onResetData,
  onScrollToEws,
  totalAlerts,
}) => {
  const [isModalEditFotoOpen, setIsModalEditFotoOpen] = useState(false);
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

  const getPageTitle = (view: string) => {
    switch (view) {
      case 'dashboard':
        return 'Dasbor Eksekutif';
      case 'kesiswaan':
        return 'Modul Kesiswaan & Tracking Murid';
      case 'mutabaah':
        return "Jurnal Mutaba'ah & Karakter Alam Murid";
      case 'sdm':
        return 'Modul SDM Guru & Karyawan';
      case 'ortu':
        return 'Portal Wali Murid';
      case 'laporan':
        return 'Laporan Periodik & Ekspor Dokumen';
      default:
        return 'Sistem Kesiswaan & SDM';
    }
  };

  const getRoleBadgeLabel = () => {
    switch (currentRole) {
      case 'pengelola':
        return '👑 Pengelola (Super Admin)';
      case 'kepsek':
        return '🎓 Kepala Sekolah';
      case 'guru':
        return `👨‍🏫 Guru (${currentUser.assignedRombel || 'Sentra'})`;
      case 'ortu':
        return '👨‍👩‍👧 Orang Tua / Wali Murid';
      default:
        return currentRole;
    }
  };

  return (
    <header
      id="topNavbar"
      className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs px-3 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5"
    >
      {/* Hidden file input for uploading profile photo from device storage */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Top Left: Sidebar Toggle & School Info */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
          title={isSidebarOpen ? 'Sembunyikan Menu Samping' : 'Buka Menu Samping'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 text-emerald-800" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-emerald-800" />
          )}
          <span className="text-xs font-bold hidden sm:inline">
            {isSidebarOpen ? 'Tutup Menu' : 'Buka Menu'}
          </span>
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {getPageTitle(currentView)}
            </h2>
            <span className="hidden lg:inline text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              T.A. {sekolahConfig.tahunAjaran} ({sekolahConfig.semester})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {sekolahConfig.namaSekolah} — "{sekolahConfig.semboyan}"
          </p>
        </div>
      </div>

      {/* Top Right Controls: User Profile & Actions (Mode switcher removed as requested) */}
      <div className="flex items-center flex-wrap gap-2 justify-end">
        {/* User Card with Avatar & Click-to-edit photo */}
        <div
          onClick={() => setIsModalEditFotoOpen(true)}
          className="group relative flex items-center space-x-2 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl px-2.5 py-1 text-xs cursor-pointer transition shadow-xs"
          title="Klik untuk membuka editor foto profil akun (Unggah, Pilih Avatar, atau Link URL)"
        >
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
            {currentUser.isMasterOwner && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-0.5 rounded-full shadow-xs">
                <Crown className="w-2.5 h-2.5" />
              </span>
            )}
          </div>

          <div className="overflow-hidden text-left">
            <div className="flex items-center space-x-1">
              <p className="font-extrabold text-slate-900 text-xs truncate max-w-[120px] sm:max-w-[160px]">
                {currentUser.nama}
              </p>
              <Camera className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition shrink-0" />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-emerald-700 font-bold truncate">
                {getRoleBadgeLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Pengelola Only: Manage Access / Add Emails button */}
        {currentRole === 'pengelola' && onOpenManajemenUser && (
          <button
            onClick={onOpenManajemenUser}
            className="flex items-center space-x-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
            title="Kelola Email Pengelola, Kepsek, Guru & Ortu"
          >
            <UserPlus className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Kelola Akses</span>
          </button>
        )}

        {/* Alert Bell (for staff) */}
        {currentRole !== 'ortu' && (
          <button
            onClick={onScrollToEws}
            className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
            title="Peringatan Dini (EWS)"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>
        )}

        {/* Settings button (pengelola only) */}
        {currentRole === 'pengelola' && (
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
            title="Edit Teks & Data Sekolah"
          >
            <Settings className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Pengaturan</span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
          title="Keluar dari Akun"
        >
          <LogOut className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden sm:inline">Keluar</span>
        </button>

        {/* Quick Reset prototype (pengelola only) */}
        {currentRole === 'pengelola' && (
          <button
            onClick={onResetData}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-700 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            title="Reset Data ke Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Modal Edit Foto Profil */}
      <ModalEditFotoProfil
        isOpen={isModalEditFotoOpen}
        onClose={() => setIsModalEditFotoOpen(false)}
        currentUser={currentUser}
        onSavePhoto={onUpdateProfilePhoto}
      />
    </header>
  );
};
