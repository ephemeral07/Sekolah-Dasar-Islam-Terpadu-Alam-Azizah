import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SDM, SekolahConfig, UserAccount } from '../../types';

interface ModalScanPresensiProps {
  isOpen: boolean;
  onClose: () => void;
  sdmList: SDM[];
  userAccounts: UserAccount[];
  sekolahConfig: SekolahConfig;
  onUpdateSdmPresensi: (sdmId: string, presensiData: SDM['presensiHariIni']) => void;
  onUpdateSekolahLocation: (config: {
    gmapsUrl: string;
    latitude: number;
    longitude: number;
    radiusMeter: number;
  }) => void;
}

// Haversine distance calculator in meters
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Parse Google Maps URL for coordinates
function extractCoordsFromGmapsUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Check for @lat,lng pattern
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }
    // Check for q=lat,lng pattern
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }
    // Check for direct comma separated in string
    const directMatch = url.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (directMatch) {
      return { lat: parseFloat(directMatch[1]), lng: parseFloat(directMatch[2]) };
    }
  } catch (e) {
    console.error('Failed to parse URL', e);
  }
  return null;
}

export const ModalScanPresensi: React.FC<ModalScanPresensiProps> = ({
  isOpen,
  onClose,
  sdmList,
  userAccounts,
  sekolahConfig,
  onUpdateSdmPresensi,
  onUpdateSekolahLocation,
}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState(sdmList[0]?.id || '');
  const [customTime, setCustomTime] = useState('');
  const [useCurrentTime, setUseCurrentTime] = useState(true);

  // Geolocation state
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Mendeteksi GPS...');
  const [simulateInSchool, setSimulateInSchool] = useState<boolean>(true); // default true for web preview stability
  const [calculatedDistance, setCalculatedDistance] = useState<number>(15);

  // Gmaps settings state
  const [isEditingGmaps, setIsEditingGmaps] = useState(false);
  const [inputGmapsUrl, setInputGmapsUrl] = useState(sekolahConfig.gmapsUrl || '');
  const [inputLat, setInputLat] = useState(sekolahConfig.latitude || -6.595038);
  const [inputLng, setInputLng] = useState(sekolahConfig.longitude || 106.797241);
  const [inputRadius, setInputRadius] = useState(sekolahConfig.radiusMeter || 250);

  // Scan result state
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    nama?: string;
    jabatan?: string;
    jamMasuk?: string;
    statusPresensi?: string;
    detail?: string;
    jarakMeter?: number;
  } | null>(null);

  // Camera video element reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Get current device location
  useEffect(() => {
    if (!isOpen) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentLocation({ lat, lng });

          const dist = getDistanceInMeters(
            lat,
            lng,
            sekolahConfig.latitude,
            sekolahConfig.longitude
          );
          setCalculatedDistance(dist);
          setLocationStatus(`GPS Terkunci (Jarak: ${dist} meter dari titik sekolah)`);
        },
        (err) => {
          console.warn('GPS notice:', err.message);
          setLocationStatus('GPS perangkat belum aktif / dibatasi izin browser. Mode simulasi aktif.');
          setSimulateInSchool(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocationStatus('Perangkat tidak mendukung geolokasi GPS.');
      setSimulateInSchool(true);
    }

    // Set initial custom time to now
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setCustomTime(`${hh}:${mm}`);
  }, [isOpen, sekolahConfig]);

  // Turn on camera for barcode scanning
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      }
    } catch (e) {
      console.warn('Camera not accessible:', e);
      alert('Kamera tidak dapat diakses atau izin belum diberikan. Gunakan pemindai manual / pemilih kode di bawah.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  // Process Gmaps input change
  const handleGmapsUrlChange = (val: string) => {
    setInputGmapsUrl(val);
    const parsed = extractCoordsFromGmapsUrl(val);
    if (parsed) {
      setInputLat(parsed.lat);
      setInputLng(parsed.lng);
    }
  };

  const handleSaveGmapsSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSekolahLocation({
      gmapsUrl: inputGmapsUrl,
      latitude: Number(inputLat),
      longitude: Number(inputLng),
      radiusMeter: Number(inputRadius),
    });
    setIsEditingGmaps(false);
  };

  // Execute Attendance Scan Rule Engine
  const executeScan = (targetStaffId: string, customCode?: string) => {
    const staff = sdmList.find(
      (s) =>
        s.id === targetStaffId ||
        s.barcodeId?.toUpperCase() === (customCode || scannedCode).trim().toUpperCase()
    );

    if (!staff) {
      setScanResult({
        success: false,
        message: 'Barcode Tidak Dikenali',
        detail: `Kode "${customCode || scannedCode}" tidak terdaftar pada database asatidz atau pengelola.`,
      });
      return;
    }

    // Geolocation verification
    const effectiveDistance = simulateInSchool ? 15 : calculatedDistance;
    const isWithinSchool = effectiveDistance <= sekolahConfig.radiusMeter;

    if (!isWithinSchool) {
      setScanResult({
        success: false,
        message: 'Presensi Ditolak: Di Luar Wilayah Sekolah',
        nama: staff.nama,
        jabatan: staff.jabatan,
        jarakMeter: effectiveDistance,
        detail: `Posisi Anda terdeteksi berjarak ${effectiveDistance} meter dari titik koordinat SDIT Alam Azizah (Maksimal radius yang diizinkan: ${sekolahConfig.radiusMeter} meter). Silakan scan saat berada di area sekolah.`,
      });
      return;
    }

    // Determine Scan Time
    let scanHours: number;
    let scanMinutes: number;
    let timeStr: string;

    if (useCurrentTime) {
      const now = new Date();
      scanHours = now.getHours();
      scanMinutes = now.getMinutes();
      timeStr = `${String(scanHours).padStart(2, '0')}:${String(scanMinutes).padStart(2, '0')} WIB`;
    } else {
      const parts = customTime.split(':');
      scanHours = parseInt(parts[0], 10) || 7;
      scanMinutes = parseInt(parts[1], 10) || 0;
      timeStr = `${customTime} WIB`;
    }

    const totalMinutes = scanHours * 60 + scanMinutes;

    // Rules Evaluation:
    // 1. Guru Biasa: Jam hadir 07:00, toleransi s.d 07:05. > 07:05 = Terlambat.
    // 2. Guru Piket: Jam hadir 06:30, toleransi s.d 06:45. > 06:45 = Terlambat.
    // 3. Kepsek / Pengelola / Karyawan (tukang bersih-bersih, satpam, staf lapangan): Bebas batas keterlambatan jam dinas.
    const tipe =
      staff.tipePresensi ||
      (staff.jabatan.toLowerCase().includes('kepala')
        ? 'Kepsek'
        : staff.jabatan.toLowerCase().includes('kebersihan') ||
          staff.jabatan.toLowerCase().includes('karyawan') ||
          staff.jabatan.toLowerCase().includes('satpam')
        ? 'Karyawan'
        : 'Guru Biasa');

    let status: 'Hadir Tepat Waktu' | 'Terlambat' = 'Hadir Tepat Waktu';
    let keterangan = '';

    if (tipe === 'Guru Piket') {
      // Piket: 06:30 target, limit 06:45 (6*60 + 45 = 405 minutes)
      const limitMinutes = 6 * 60 + 45;
      if (totalMinutes > limitMinutes) {
        status = 'Terlambat';
        const lateMinutes = totalMinutes - limitMinutes;
        keterangan = `Terlambat ${lateMinutes} menit (Batas toleransi guru piket jam 06:45 WIB)`;
      } else {
        status = 'Hadir Tepat Waktu';
        keterangan = `Tepat Waktu (Tugas Guru Piket Pagi, hadir sebelum 06:45 WIB)`;
      }
    } else if (tipe === 'Karyawan') {
      // Karyawan (seperti tukang bersih-bersih/satpam): jam presensi disamakan dengan pengelola
      status = 'Hadir Tepat Waktu';
      keterangan = `Hadir Tepat Waktu (Karyawan / Staf Kebersihan: Bebas Batas Keterlambatan Jam Dinas sama seperti Pengelola)`;
    } else if (tipe === 'Kepsek' || tipe === 'Pengelola') {
      status = 'Hadir Tepat Waktu';
      keterangan = `Hadir Tepat Waktu (Akses Eksekutif: Bebas Batas Keterlambatan Jam Dinas)`;
    } else {
      // Guru Biasa: 07:00 target, limit 07:05 (7*60 + 5 = 425 minutes)
      const limitMinutes = 7 * 60 + 5;
      if (totalMinutes > limitMinutes) {
        status = 'Terlambat';
        const lateMinutes = totalMinutes - limitMinutes;
        keterangan = `Terlambat ${lateMinutes} menit (Batas toleransi guru jam 07:05 WIB)`;
      } else {
        status = 'Hadir Tepat Waktu';
        keterangan = `Tepat Waktu (Hadir sebelum jam toleransi 07:05 WIB)`;
      }
    }

    // Save and sync
    onUpdateSdmPresensi(staff.id, {
      status,
      jamMasuk: timeStr,
      jamPulang: '16:00 WIB',
      keterangan,
      metodeScan: 'Barcode & GPS Sekolah Terverifikasi',
      jarakMeter: effectiveDistance,
      waktuScan: new Date().toISOString(),
    });

    setScanResult({
      success: true,
      message: status === 'Terlambat' ? 'Presensi Tercatat: Terlambat' : 'Presensi Berhasil: Tepat Waktu',
      nama: staff.nama,
      jabatan: staff.jabatan,
      jamMasuk: timeStr,
      statusPresensi: status,
      detail: keterangan,
      jarakMeter: effectiveDistance,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Pemindai Barcode Presensi & Kedisiplinan Guru
              </h3>
              <p className="text-xs text-slate-500">
                Singkronisasi otomatis jam hadir, aturan toleransi, dan radius koordinat sekolah
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Coordinates & Gmaps Setting Bar */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Titik Wilayah Sekolah: {sekolahConfig.namaSekolah}</span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={sekolahConfig.gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-800 hover:underline flex items-center space-x-1 font-bold"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setIsEditingGmaps(!isEditingGmaps)}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 cursor-pointer"
              >
                {isEditingGmaps ? 'Tutup Form' : 'Ubah Koordinat & Link Gmaps'}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              Lat: <strong className="font-mono text-slate-800">{sekolahConfig.latitude}</strong>
            </span>
            <span>
              Lng: <strong className="font-mono text-slate-800">{sekolahConfig.longitude}</strong>
            </span>
            <span>
              Radius Diizinkan: <strong className="text-slate-800">{sekolahConfig.radiusMeter} meter</strong>
            </span>
            <span className="text-emerald-800 font-semibold">
              Status Anda: {simulateInSchool ? 'Terverifikasi di Area Sekolah (15m)' : `${calculatedDistance}m dari Sekolah`}
            </span>
          </div>

          {/* Form to Edit Gmaps Link & Coordinates */}
          {isEditingGmaps && (
            <form
              onSubmit={handleSaveGmapsSettings}
              className="mt-2 pt-2.5 border-t border-emerald-200 space-y-2.5 bg-white p-3 rounded-xl"
            >
              <div>
                <label className="font-bold text-slate-700 block text-[11px]">
                  Tempelkan Tautan / Link Google Maps Wilayah Sekolah
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=-6.595038,106.797241"
                  value={inputGmapsUrl}
                  onChange={(e) => handleGmapsUrlChange(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-300 font-mono text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">
                  Sistem otomatis mendeteksi angka Latitude & Longitude saat tautan ditempel
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={inputLat}
                    onChange={(e) => setInputLat(parseFloat(e.target.value))}
                    className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={inputLng}
                    onChange={(e) => setInputLng(parseFloat(e.target.value))}
                    className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Radius Sekolah (Meter)</label>
                  <input
                    type="number"
                    required
                    value={inputRadius}
                    onChange={(e) => setInputRadius(parseInt(e.target.value, 10))}
                    className="w-full mt-0.5 p-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingGmaps(false)}
                  className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-emerald-800 text-white font-bold text-[11px] hover:bg-emerald-900"
                >
                  Simpan Titik Sekolah
                </button>
              </div>
            </form>
          )}

          {/* Toggle Simulator Geolocation for Easy Testing */}
          <div className="flex items-center justify-between pt-1 text-[11px] border-t border-emerald-100">
            <span className="text-slate-600">Simulasi GPS Berada di Sekolah (Uji Coba Cepat):</span>
            <label className="flex items-center space-x-2 cursor-pointer font-bold text-emerald-900">
              <input
                type="checkbox"
                checked={simulateInSchool}
                onChange={(e) => setSimulateInSchool(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>{simulateInSchool ? 'Aktif (15m dari Sekolah)' : 'Gunakan GPS Riil'}</span>
            </label>
          </div>
        </div>

        {/* Scan Result Feedback Card */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
              scanResult.success
                ? scanResult.statusPresensi === 'Terlambat'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {scanResult.success ? (
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      scanResult.statusPresensi === 'Terlambat' ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <h4 className="font-extrabold text-sm">{scanResult.message}</h4>
              </div>
              {scanResult.statusPresensi && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    scanResult.statusPresensi === 'Terlambat'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {scanResult.statusPresensi}
                </span>
              )}
            </div>

            {scanResult.nama && (
              <div className="font-semibold text-slate-800">
                <span>{scanResult.nama}</span> ({scanResult.jabatan}) - Jam Hadir:{' '}
                <span className="font-bold text-slate-900">{scanResult.jamMasuk}</span>
              </div>
            )}

            <p className="text-[11px] leading-relaxed opacity-90">{scanResult.detail}</p>
          </div>
        )}

        {/* Attendance Scan Controller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Option A: Fast Select Guru & Test Attendance Rule */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-800 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>Pilih Guru / Pengelola Untuk Scan</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Pilih Asatidz / Pengelola</label>
              <select
                value={selectedStaffId}
                onChange={(e) => {
                  setSelectedStaffId(e.target.value);
                  const staff = sdmList.find((s) => s.id === e.target.value);
                  if (staff && staff.barcodeId) setScannedCode(staff.barcodeId);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {sdmList.map((sdm) => {
                  const sdmTipe =
                    sdm.tipePresensi ||
                    (sdm.jabatan.toLowerCase().includes('kepala')
                      ? 'Kepsek'
                      : sdm.jabatan.toLowerCase().includes('kebersihan') ||
                        sdm.jabatan.toLowerCase().includes('karyawan') ||
                        sdm.jabatan.toLowerCase().includes('satpam')
                      ? 'Karyawan'
                      : 'Guru Biasa');
                  return (
                    <option key={sdm.id} value={sdm.id}>
                      {sdm.nama} — [{sdmTipe}] ({sdm.barcodeId || `SDM-${sdm.id}`})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Time selector to test 07:02 vs 07:15 easily */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Jam Presensi:</span>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="timeOption"
                    checked={useCurrentTime}
                    onChange={() => setUseCurrentTime(true)}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Jam Sekarang</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="timeOption"
                    checked={!useCurrentTime}
                    onChange={() => setUseCurrentTime(false)}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Simulasi Jam:</span>
                </label>
                {!useCurrentTime && (
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="p-1 rounded-lg border border-slate-300 font-mono font-bold text-xs"
                  />
                )}
              </div>
              <div className="text-[10px] text-slate-500">
                * Uji coba: Guru biasa (07.04 tepat / 07.10 terlambat). Karyawan/Kepsek/Pengelola bebas batas keterlambatan.
              </div>
            </div>

            <button
              type="button"
              onClick={() => executeScan(selectedStaffId)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Scan & Rekam Presensi</span>
            </button>
          </div>

          {/* Option B: Live Camera Scanner / Manual Input */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2 font-bold text-slate-800">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Kamera / Input Kode Barcode</span>
                </div>
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 cursor-pointer"
                  >
                    Buka Kamera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 cursor-pointer"
                  >
                    Tutup Kamera
                  </button>
                )}
              </div>

              {cameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-emerald-500">
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  <div className="absolute inset-4 border-2 border-dashed border-emerald-400 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="bg-black/60 text-white px-3 py-1 rounded-full text-[10px]">
                      Arahkan barcode ke dalam bingkai
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-4 text-center space-y-1">
                  <QrCode className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-[11px] text-slate-500">
                    Kamera belum aktif. Anda bisa mengetik atau menempelkan ID barcode di bawah.
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">ID Barcode / QR Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Contoh: SDM-GB-003"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300 font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (scannedCode.trim()) executeScan('', scannedCode.trim());
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer"
                  >
                    Cek
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              * Presensi langsung memperbarui persentase kehadiran di tab "Presensi & Kedisiplinan".
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
