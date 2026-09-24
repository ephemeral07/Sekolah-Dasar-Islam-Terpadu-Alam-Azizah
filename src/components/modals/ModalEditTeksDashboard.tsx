import React, { useState, useEffect } from 'react';
import { X, Edit3, Sparkles } from 'lucide-react';
import { DashboardConfig } from '../../types';

interface ModalEditTeksDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardConfig: DashboardConfig;
  onSave: (config: DashboardConfig) => void;
}

export const ModalEditTeksDashboard: React.FC<ModalEditTeksDashboardProps> = ({
  isOpen,
  onClose,
  dashboardConfig,
  onSave,
}) => {
  const [welcomeTitle, setWelcomeTitle] = useState('');
  const [welcomeSubtitle, setWelcomeSubtitle] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [highlightNote, setHighlightNote] = useState('');

  useEffect(() => {
    if (dashboardConfig) {
      setWelcomeTitle(dashboardConfig.welcomeTitle);
      setWelcomeSubtitle(dashboardConfig.welcomeSubtitle);
      setAnnouncementTitle(dashboardConfig.announcementTitle);
      setAnnouncementText(dashboardConfig.announcementText);
      setHighlightNote(dashboardConfig.highlightNote);
    }
  }, [dashboardConfig, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      welcomeTitle,
      welcomeSubtitle,
      announcementTitle,
      announcementText,
      highlightNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Edit Tulisan Dasbor Eksekutif
              </h3>
              <p className="text-slate-500 text-[11px]">
                Ubah judul selamat datang, pengumuman arahan, dan catatan kebijakan sekolah
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Judul Sambutan Banner Utama
            </label>
            <input
              type="text"
              required
              value={welcomeTitle}
              onChange={(e) => setWelcomeTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Deskripsi / Sub-judul Sambutan
            </label>
            <textarea
              rows={2}
              required
              value={welcomeSubtitle}
              onChange={(e) => setWelcomeSubtitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Judul Warta & Rencana Strategis
            </label>
            <input
              type="text"
              required
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Isi Teks Arahan & Kebijakan Strategis
            </label>
            <textarea
              rows={3}
              required
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Catatan Khusus Peringatan EWS (Early Warning System)
            </label>
            <textarea
              rows={2}
              required
              value={highlightNote}
              onChange={(e) => setHighlightNote(e.target.value)}
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
              className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition cursor-pointer flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Simpan Perubahan Teks</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
