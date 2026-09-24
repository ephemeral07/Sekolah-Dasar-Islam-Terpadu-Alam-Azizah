import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  User,
  ShieldCheck,
} from 'lucide-react';
import { UserAccount } from '../../types';

interface ModalEditFotoProfilProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSavePhoto: (photoUrl: string) => void;
}

// Preset high quality educational and friendly avatars
const PRESET_AVATARS = [
  {
    label: 'Ustadz / Guru Ikhwan 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Ustadz / Guru Ikhwan 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Ustadzah / Guru Akhwat 1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Ustadzah / Guru Akhwat 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Pengelola / Eksekutif 1',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Pengelola / Eksekutif 2',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Wali Murid / Santun 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: 'Wali Murid / Santun 2',
    url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=240&auto=format&fit=crop&q=80',
  },
];

export const ModalEditFotoProfil: React.FC<ModalEditFotoProfilProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSavePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'preset'>('upload');
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    currentUser.avatar || PRESET_AVATARS[0].url
  );
  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa file gambar (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setUploadError(null);
    setPreviewPhoto(urlInput.trim());
  };

  const handleSave = () => {
    if (!previewPhoto) return;
    onSavePhoto(previewPhoto);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Ubah Foto Profil Akun
              </h3>
              <p className="text-slate-500 text-[11px]">
                {currentUser.nama} ({currentUser.roleLabel || currentUser.role})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Preview */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-slate-50 border border-emerald-100">
          <div className="relative group">
            <img
              src={previewPhoto}
              alt={currentUser.nama}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-emerald-500"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-emerald-700 text-white rounded-full shadow-md hover:bg-emerald-800 transition cursor-pointer"
              title="Pilih foto dari galeri"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <span className="font-extrabold text-slate-800 mt-2.5 text-xs">{currentUser.nama}</span>
          <span className="text-[10px] text-slate-500 font-mono">{currentUser.email}</span>
        </div>

        {/* Tab switchers */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Dari Perangkat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition cursor-pointer ${
              activeTab === 'preset'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koleksi Avatar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link URL</span>
          </button>
        </div>

        {/* Tab Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-xs">
                  Pilih Foto dari Galeri / Memori HP
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Format JPG, PNG atau WEBP (Maksimal 3 MB)
                </p>
              </div>
            </div>

            {uploadError && (
              <p className="text-[11px] text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
                ⚠️ {uploadError}
              </p>
            )}
          </div>
        )}

        {/* Tab Preset Avatars */}
        {activeTab === 'preset' && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500 font-semibold">
              Pilih karakter avatar islami / pendidik yang serasi:
            </p>
            <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
              {PRESET_AVATARS.map((avatar, idx) => {
                const isSelected = previewPhoto === avatar.url;
                return (
                  <div
                    key={idx}
                    onClick={() => setPreviewPhoto(avatar.url)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-400/50 scale-105'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.label}
                      className="w-full h-16 object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-800/40 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 drop-shadow-md" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab URL */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tautkan Link / URL Foto Gambar
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Otomatis tersimpan di akun Anda</span>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Foto Profil</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
