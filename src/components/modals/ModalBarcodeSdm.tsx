import React, { useState, useEffect } from 'react';
import { X, QrCode, Printer, Download, Search, Check, Shield } from 'lucide-react';
import QRCode from 'qrcode';
import { SDM, SekolahConfig, UserAccount } from '../../types';

interface ModalBarcodeSdmProps {
  isOpen: boolean;
  onClose: () => void;
  sdmList: SDM[];
  userAccounts: UserAccount[];
  sekolahConfig: SekolahConfig;
}

export const ModalBarcodeSdm: React.FC<ModalBarcodeSdmProps> = ({
  isOpen,
  onClose,
  sdmList,
  userAccounts,
  sekolahConfig,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter staff + pengelola
  const combinedList = sdmList.map((sdm) => {
    const code = sdm.barcodeId || `SDM-${sdm.id.toUpperCase()}`;
    return {
      id: sdm.id,
      nama: sdm.nama,
      jabatan: sdm.jabatan,
      nip: sdm.nip,
      foto: sdm.foto,
      barcodeId: code,
      tipePresensi:
        sdm.tipePresensi ||
        (sdm.jabatan.toLowerCase().includes('kepala')
          ? 'Kepsek'
          : sdm.jabatan.toLowerCase().includes('kebersihan') ||
            sdm.jabatan.toLowerCase().includes('karyawan') ||
            sdm.jabatan.toLowerCase().includes('satpam')
          ? 'Karyawan'
          : 'Guru Biasa'),
    };
  });

  // Also include pengelola accounts who might not be in SDM list
  userAccounts
    .filter((u) => u.role === 'pengelola' && !sdmList.some((s) => s.email === u.email))
    .forEach((u) => {
      combinedList.push({
        id: u.id,
        nama: u.nama,
        jabatan: u.roleLabel,
        nip: 'PENGELOLA-OWNER',
        foto: u.avatar,
        barcodeId: `OWNER-${u.id.toUpperCase()}`,
        tipePresensi: 'Pengelola',
      });
    });

  useEffect(() => {
    if (!isOpen) return;

    // Generate QR codes for all
    const generateQrs = async () => {
      const urls: Record<string, string> = {};
      for (const item of combinedList) {
        try {
          const url = await QRCode.toDataURL(item.barcodeId, {
            width: 240,
            margin: 1,
            color: {
              dark: '#1B4332',
              light: '#FFFFFF',
            },
          });
          urls[item.id] = url;
        } catch (e) {
          console.error(e);
        }
      }
      setQrCodeUrls(urls);
    };

    generateQrs();
  }, [isOpen, sdmList, userAccounts]);

  if (!isOpen) return null;

  const filtered = combinedList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcodeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Kartu & Barcode Presensi Guru & Pengelola
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan barcode/QR code ini untuk scan presensi kedisiplinan harian
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama guru, pengelola, atau ID barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Aturan: Guru Biasa (07.00/07.05), Guru Piket (06.30/06.45), Karyawan/Kepsek/Pengelola (Bebas Batas Jam Masuk)</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase block tracking-wider">
                      {sekolahConfig.namaSekolah}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      Presensi Kedisiplinan
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      item.tipePresensi === 'Guru Piket'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : item.tipePresensi === 'Kepsek' || item.tipePresensi === 'Pengelola'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : item.tipePresensi === 'Karyawan'
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {item.tipePresensi}
                  </span>
                </div>

                <div className="flex items-center space-x-3 my-3">
                  <img
                    src={
                      item.foto ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={item.nama}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div>
                    <h4 className="font-black text-slate-900 text-xs line-clamp-1">{item.nama}</h4>
                    <p className="text-[11px] text-emerald-800 font-semibold line-clamp-1">{item.jabatan}</p>
                    <p className="text-[10px] text-slate-400 font-mono">NIP: {item.nip}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200">
                  {qrCodeUrls[item.id] ? (
                    <img
                      src={qrCodeUrls[item.id]}
                      alt={item.barcodeId}
                      className="w-32 h-32 object-contain"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-slate-100 animate-pulse rounded-xl" />
                  )}
                  <div className="mt-1.5 font-mono font-black text-xs text-slate-900 tracking-wider">
                    {item.barcodeId}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleCopy(item.barcodeId)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedId === item.barcodeId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <span>Salin Kode</span>
                  )}
                </button>

                <span className="text-slate-400 italic">Scan via kamera</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
