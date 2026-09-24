import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  HeartHandshake,
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { KesiswaanView } from './components/KesiswaanView';
import { MutabaahView } from './components/MutabaahView';
import { SdmView } from './components/SdmView';
import { PortalOrtuView } from './components/PortalOrtuView';
import { LaporanView } from './components/LaporanView';
import { LoginScreen } from './components/LoginScreen';

// Modals
import { ModalTambahSiswa } from './components/modals/ModalTambahSiswa';
import { ModalEditSiswa } from './components/modals/ModalEditSiswa';
import { ModalCatatPelanggaran } from './components/modals/ModalCatatPelanggaran';
import { ModalEditPelanggaran } from './components/modals/ModalEditPelanggaran';
import { ModalCatatPrestasi } from './components/modals/ModalCatatPrestasi';
import { ModalEditPrestasi } from './components/modals/ModalEditPrestasi';
import { ModalTambahMutasi } from './components/modals/ModalTambahMutasi';
import { ModalEditMutasi } from './components/modals/ModalEditMutasi';
import { ModalInputMutabaah } from './components/modals/ModalInputMutabaah';
import { ModalTambahSdm } from './components/modals/ModalTambahSdm';
import { ModalEditSdm } from './components/modals/ModalEditSdm';
import { ModalCatatPembinaan } from './components/modals/ModalCatatPembinaan';
import { ModalEditPembinaan } from './components/modals/ModalEditPembinaan';
import { ModalPiagam } from './components/modals/ModalPiagam';
import { ModalDetailSiswa } from './components/modals/ModalDetailSiswa';
import { ModalPengaturan } from './components/modals/ModalPengaturan';
import { ModalManajemenUser } from './components/modals/ModalManajemenUser';
import { ModalEditTeksDashboard } from './components/modals/ModalEditTeksDashboard';
import { ModalKelolaRombel } from './components/modals/ModalKelolaRombel';
import { ModalEditIndikatorKarakter } from './components/modals/ModalEditIndikatorKarakter';
import { ModalEditTeksTombol } from './components/modals/ModalEditTeksTombol';
import { ModalKelolaPengumuman } from './components/modals/ModalKelolaPengumuman';
import { ModalBarcodeSdm } from './components/modals/ModalBarcodeSdm';
import { ModalScanPresensi } from './components/modals/ModalScanPresensi';

import {
  Siswa,
  SDM,
  Pelanggaran,
  Prestasi,
  Mutasi,
  Mutabaah,
  Pembinaan,
  SekolahConfig,
  UserConfig,
  DashboardConfig,
  UserRole,
  UserAccount,
  Pengumuman,
  RombelItem,
  IndikatorKarakterConfig,
  UiTextConfig,
} from './types';

import {
  initialSekolahConfig,
  initialUserConfig,
  initialDashboardConfig,
  initialUserAccounts,
  initialPengumuman,
  initialSiswa,
  initialSDM,
  initialPelanggaran,
  initialPrestasi,
  initialMutasi,
  initialMutabaah,
  initialPembinaan,
  initialRombelList,
  initialIndikatorKarakterConfig,
  initialUiTextConfig,
} from './data/initialData';

export default function App() {
  // Accounts & Login Session
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('aa_user_accounts');
    return saved ? JSON.parse(saved) : initialUserAccounts;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('aa_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation & Role
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('pengelola');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Configurations
  const [sekolahConfig, setSekolahConfig] = useState<SekolahConfig>(() => {
    const saved = localStorage.getItem('aa_sekolah_config');
    return saved ? JSON.parse(saved) : initialSekolahConfig;
  });

  const [userConfig, setUserConfig] = useState<UserConfig>(() => {
    const saved = localStorage.getItem('aa_user_config');
    return saved ? JSON.parse(saved) : initialUserConfig;
  });

  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() => {
    const saved = localStorage.getItem('aa_dashboard_config');
    return saved ? JSON.parse(saved) : initialDashboardConfig;
  });

  const [rombelList, setRombelList] = useState<RombelItem[]>(() => {
    const saved = localStorage.getItem('aa_rombel_list');
    return saved ? JSON.parse(saved) : initialRombelList;
  });

  const [indikatorConfig, setIndikatorConfig] = useState<IndikatorKarakterConfig>(() => {
    const saved = localStorage.getItem('aa_indikator_config');
    return saved ? JSON.parse(saved) : initialIndikatorKarakterConfig;
  });

  const [uiTextConfig, setUiTextConfig] = useState<UiTextConfig>(() => {
    const saved = localStorage.getItem('aa_uitext_config');
    return saved ? JSON.parse(saved) : initialUiTextConfig;
  });

  // Domain Entities
  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    const saved = localStorage.getItem('aa_siswa_list');
    return saved ? JSON.parse(saved) : initialSiswa;
  });

  const [sdmList, setSdmList] = useState<SDM[]>(() => {
    const saved = localStorage.getItem('aa_sdm_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SDM[];
        if (!parsed.some((s) => s.id === 'sdm-7')) {
          const mulyadi = initialSDM.find((s) => s.id === 'sdm-7');
          if (mulyadi) return [...parsed, mulyadi];
        }
        return parsed;
      } catch {
        return initialSDM;
      }
    }
    return initialSDM;
  });

  const [pelanggaranList, setPelanggaranList] = useState<Pelanggaran[]>(() => {
    const saved = localStorage.getItem('aa_pelanggaran_list');
    return saved ? JSON.parse(saved) : initialPelanggaran;
  });

  const [prestasiList, setPrestasiList] = useState<Prestasi[]>(() => {
    const saved = localStorage.getItem('aa_prestasi_list');
    return saved ? JSON.parse(saved) : initialPrestasi;
  });

  const [mutasiList, setMutasiList] = useState<Mutasi[]>(() => {
    const saved = localStorage.getItem('aa_mutasi_list');
    return saved ? JSON.parse(saved) : initialMutasi;
  });

  const [mutabaahList, setMutabaahList] = useState<Mutabaah[]>(() => {
    const saved = localStorage.getItem('aa_mutabaah_list');
    return saved ? JSON.parse(saved) : initialMutabaah;
  });

  const [pembinaanList, setPembinaanList] = useState<Pembinaan[]>(() => {
    const saved = localStorage.getItem('aa_pembinaan_list');
    return saved ? JSON.parse(saved) : initialPembinaan;
  });

  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(() => {
    const saved = localStorage.getItem('aa_pengumuman_list');
    return saved ? JSON.parse(saved) : initialPengumuman;
  });

  // Modals Visibility
  const [isModalTambahSiswaOpen, setIsModalTambahSiswaOpen] = useState(false);
  const [isModalEditSiswaOpen, setIsModalEditSiswaOpen] = useState(false);
  const [selectedSiswaForEdit, setSelectedSiswaForEdit] = useState<Siswa | null>(null);

  const [isModalTambahPelanggaranOpen, setIsModalTambahPelanggaranOpen] = useState(false);
  const [isModalEditPelanggaranOpen, setIsModalEditPelanggaranOpen] = useState(false);
  const [selectedPelanggaranForEdit, setSelectedPelanggaranForEdit] = useState<Pelanggaran | null>(null);
  const [defaultSiswaPelanggaranId, setDefaultSiswaPelanggaranId] = useState<string | undefined>();

  const [isModalTambahPrestasiOpen, setIsModalTambahPrestasiOpen] = useState(false);
  const [isModalEditPrestasiOpen, setIsModalEditPrestasiOpen] = useState(false);
  const [selectedPrestasiForEdit, setSelectedPrestasiForEdit] = useState<Prestasi | null>(null);
  const [defaultSiswaPrestasiId, setDefaultSiswaPrestasiId] = useState<string | undefined>();

  const [isModalTambahMutasiOpen, setIsModalTambahMutasiOpen] = useState(false);
  const [isModalEditMutasiOpen, setIsModalEditMutasiOpen] = useState(false);
  const [selectedMutasiForEdit, setSelectedMutasiForEdit] = useState<Mutasi | null>(null);

  const [isModalInputMutabaahOpen, setIsModalInputMutabaahOpen] = useState(false);
  const [defaultSiswaMutabaahId, setDefaultSiswaMutabaahId] = useState<string | undefined>();

  const [isModalTambahSdmOpen, setIsModalTambahSdmOpen] = useState(false);
  const [isModalEditSdmOpen, setIsModalEditSdmOpen] = useState(false);
  const [selectedSdmForEdit, setSelectedSdmForEdit] = useState<SDM | null>(null);

  const [isModalTambahPembinaanOpen, setIsModalTambahPembinaanOpen] = useState(false);
  const [isModalEditPembinaanOpen, setIsModalEditPembinaanOpen] = useState(false);
  const [selectedPembinaanForEdit, setSelectedPembinaanForEdit] = useState<Pembinaan | null>(null);

  const [isModalPiagamOpen, setIsModalPiagamOpen] = useState(false);
  const [selectedPrestasiForPiagam, setSelectedPrestasiForPiagam] = useState<Prestasi | null>(null);

  const [isModalDetailSiswaOpen, setIsModalDetailSiswaOpen] = useState(false);
  const [selectedSiswaForDetail, setSelectedSiswaForDetail] = useState<Siswa | null>(null);

  const [isModalPengaturanOpen, setIsModalPengaturanOpen] = useState(false);
  const [isModalManajemenUserOpen, setIsModalManajemenUserOpen] = useState(false);
  const [isModalEditDashboardTextOpen, setIsModalEditDashboardTextOpen] = useState(false);

  // New Management Modals
  const [isModalKelolaRombelOpen, setIsModalKelolaRombelOpen] = useState(false);
  const [isModalEditIndikatorOpen, setIsModalEditIndikatorOpen] = useState(false);
  const [isModalEditTombolOpen, setIsModalEditTombolOpen] = useState(false);
  const [isModalKelolaPengumumanOpen, setIsModalKelolaPengumumanOpen] = useState(false);
  const [isModalBarcodeSdmOpen, setIsModalBarcodeSdmOpen] = useState(false);
  const [isModalScanPresensiOpen, setIsModalScanPresensiOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aa_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aa_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aa_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aa_sekolah_config', JSON.stringify(sekolahConfig));
  }, [sekolahConfig]);

  useEffect(() => {
    localStorage.setItem('aa_user_config', JSON.stringify(userConfig));
  }, [userConfig]);

  useEffect(() => {
    localStorage.setItem('aa_dashboard_config', JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  useEffect(() => {
    localStorage.setItem('aa_rombel_list', JSON.stringify(rombelList));
  }, [rombelList]);

  useEffect(() => {
    localStorage.setItem('aa_indikator_config', JSON.stringify(indikatorConfig));
  }, [indikatorConfig]);

  useEffect(() => {
    localStorage.setItem('aa_uitext_config', JSON.stringify(uiTextConfig));
  }, [uiTextConfig]);

  useEffect(() => {
    localStorage.setItem('aa_siswa_list', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('aa_sdm_list', JSON.stringify(sdmList));
  }, [sdmList]);

  useEffect(() => {
    localStorage.setItem('aa_pelanggaran_list', JSON.stringify(pelanggaranList));
  }, [pelanggaranList]);

  useEffect(() => {
    localStorage.setItem('aa_prestasi_list', JSON.stringify(prestasiList));
  }, [prestasiList]);

  useEffect(() => {
    localStorage.setItem('aa_mutasi_list', JSON.stringify(mutasiList));
  }, [mutasiList]);

  useEffect(() => {
    localStorage.setItem('aa_mutabaah_list', JSON.stringify(mutabaahList));
  }, [mutabaahList]);

  useEffect(() => {
    localStorage.setItem('aa_pembinaan_list', JSON.stringify(pembinaanList));
  }, [pembinaanList]);

  useEffect(() => {
    localStorage.setItem('aa_pengumuman_list', JSON.stringify(pengumumanList));
  }, [pengumumanList]);

  // Handle Login
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'ortu') {
      setCurrentView('ortu');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Profile Photo Upload for current user
  const handleUpdateProfilePhoto = (newPhotoUrl: string) => {
    if (currentUser) {
      const updatedUser: UserAccount = { ...currentUser, avatar: newPhotoUrl };
      setCurrentUser(updatedUser);
      setUserAccounts((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
      if (currentUser.role === 'pengelola') {
        setUserConfig((prev) => ({ ...prev, avatar: newPhotoUrl }));
      }
    }
  };

  // User Accounts CRUD
  const handleAddUser = (newUserData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...newUserData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUserAccounts((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUserAccounts((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserAccounts((prev) => prev.filter((u) => u.id !== userId));
  };

  // EWS counts
  const studentAlertsCount = siswaList.filter((s) => {
    const studentPels = pelanggaranList.filter((p) => p.siswaId === s.id);
    const totalPoints = studentPels.reduce((acc, curr) => acc + curr.poin, 0);
    const urgentStatus = studentPels.some(
      (p) => p.status === 'Butuh Pemanggilan Orang Tua' || p.status === 'Butuh Konseling Guru BK'
    );
    return totalPoints >= 15 || urgentStatus;
  }).length;

  const sdmAlertsCount = sdmList.filter((sdm) => {
    if (sdm.status !== 'Kontrak') return false;
    const endDate = new Date(sdm.kontrakAkhir);
    const now = new Date('2026-09-23');
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  }).length;

  const totalEws = studentAlertsCount + sdmAlertsCount;

  // Handlers for Siswa
  const handleAddSiswa = (newSiswaData: Omit<Siswa, 'id'>) => {
    const newSiswa: Siswa = {
      ...newSiswaData,
      id: `s-${Date.now()}`,
    };
    setSiswaList((prev) => [newSiswa, ...prev]);
  };

  const handleSaveEditSiswa = (updatedSiswa: Siswa) => {
    setSiswaList((prev) => prev.map((s) => (s.id === updatedSiswa.id ? updatedSiswa : s)));
  };

  const handleDeleteSiswa = (siswaId: string) => {
    setSiswaList((prev) => prev.filter((s) => s.id !== siswaId));
    setPelanggaranList((prev) => prev.filter((p) => p.siswaId !== siswaId));
    setPrestasiList((prev) => prev.filter((pr) => pr.siswaId !== siswaId));
    setMutabaahList((prev) => prev.filter((m) => m.siswaId !== siswaId));
  };

  // Handlers for Pelanggaran
  const handleAddPelanggaran = (newPelData: Omit<Pelanggaran, 'id'>) => {
    const newPel: Pelanggaran = {
      ...newPelData,
      id: `p-${Date.now()}`,
    };
    setPelanggaranList((prev) => [newPel, ...prev]);
  };

  const handleSaveEditPelanggaran = (updatedPelanggaran: Pelanggaran) => {
    setPelanggaranList((prev) =>
      prev.map((p) => (p.id === updatedPelanggaran.id ? updatedPelanggaran : p))
    );
  };

  const handleDeletePelanggaran = (id: string) => {
    setPelanggaranList((prev) => prev.filter((p) => p.id !== id));
  };

  // Handlers for Prestasi
  const handleAddPrestasi = (newPresData: Omit<Prestasi, 'id'>) => {
    const newPres: Prestasi = {
      ...newPresData,
      id: `pr-${Date.now()}`,
    };
    setPrestasiList((prev) => [newPres, ...prev]);
  };

  const handleSaveEditPrestasi = (updatedPrestasi: Prestasi) => {
    setPrestasiList((prev) =>
      prev.map((pr) => (pr.id === updatedPrestasi.id ? updatedPrestasi : pr))
    );
  };

  const handleDeletePrestasi = (id: string) => {
    setPrestasiList((prev) => prev.filter((pr) => pr.id !== id));
  };

  // Handlers for Mutasi
  const handleAddMutasi = (newMut: Mutasi) => {
    setMutasiList((prev) => [newMut, ...prev]);
  };

  const handleSaveEditMutasi = (updatedMutasi: Mutasi) => {
    setMutasiList((prev) =>
      prev.map((m) => (m.id === updatedMutasi.id ? updatedMutasi : m))
    );
  };

  const handleDeleteMutasi = (id: string) => {
    setMutasiList((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers for Mutabaah
  const handleAddMutabaah = (newMutData: Omit<Mutabaah, 'id'>) => {
    const newMut: Mutabaah = {
      ...newMutData,
      id: `mut-${Date.now()}`,
    };
    setMutabaahList((prev) => [newMut, ...prev]);
  };

  // Handlers for SDM
  const handleAddSdm = (newSdmData: Omit<SDM, 'id'>) => {
    const newSdm: SDM = {
      ...newSdmData,
      id: `sdm-${Date.now()}`,
      barcodeId: newSdmData.barcodeId || `SDM-${Date.now().toString().slice(-4)}`,
      tipePresensi: newSdmData.tipePresensi || 'Guru Biasa',
    };
    setSdmList((prev) => [...prev, newSdm]);
  };

  const handleSaveEditSdm = (updatedSdm: SDM) => {
    // If status changed to Karyawan/Pengelola/Kepsek, ensure late penalty is cleared
    let adjustedPresensi = { ...updatedSdm.presensiHariIni };
    if (
      (updatedSdm.tipePresensi === 'Karyawan' ||
        updatedSdm.tipePresensi === 'Pengelola' ||
        updatedSdm.tipePresensi === 'Kepsek') &&
      adjustedPresensi.status === 'Terlambat'
    ) {
      adjustedPresensi = {
        ...adjustedPresensi,
        status: 'Hadir Tepat Waktu',
        keterangan:
          updatedSdm.tipePresensi === 'Karyawan'
            ? 'Hadir Tepat Waktu (Karyawan: Jam presensi disamakan dengan Pengelola, bebas batas keterlambatan)'
            : 'Hadir Tepat Waktu (Akses Eksekutif: Bebas batas keterlambatan jam dinas)',
      };
    }
    const finalSdm = { ...updatedSdm, presensiHariIni: adjustedPresensi };
    setSdmList((prev) => prev.map((s) => (s.id === finalSdm.id ? finalSdm : s)));
  };

  const handleDeleteSdm = (sdmId: string) => {
    setSdmList((prev) => prev.filter((s) => s.id !== sdmId));
    setPembinaanList((prev) => prev.filter((pem) => pem.sdmId !== sdmId));
  };

  // Handlers for Pembinaan
  const handleAddPembinaan = (newPemData: Omit<Pembinaan, 'id'>) => {
    const newPem: Pembinaan = {
      ...newPemData,
      id: `pem-${Date.now()}`,
    };
    setPembinaanList((prev) => [newPem, ...prev]);
  };

  const handleSaveEditPembinaan = (updatedPem: Pembinaan) => {
    setPembinaanList((prev) =>
      prev.map((p) => (p.id === updatedPem.id ? updatedPem : p))
    );
  };

  const handleDeletePembinaan = (pemId: string) => {
    setPembinaanList((prev) => prev.filter((p) => p.id !== pemId));
  };

  // Attendance Barcode Sync
  const handleUpdateSdmPresensi = (
    sdmId: string,
    presensiData: SDM['presensiHariIni']
  ) => {
    setSdmList((prev) =>
      prev.map((s) => (s.id === sdmId ? { ...s, presensiHariIni: presensiData } : s))
    );
  };

  // School Location / Gmaps Update
  const handleUpdateSekolahLocation = (config: {
    gmapsUrl: string;
    latitude: number;
    longitude: number;
    radiusMeter: number;
  }) => {
    setSekolahConfig((prev) => ({
      ...prev,
      gmapsUrl: config.gmapsUrl,
      latitude: config.latitude,
      longitude: config.longitude,
      radiusMeter: config.radiusMeter,
    }));
  };

  // Handlers for Pengumuman
  const handleAddPengumuman = (newPeng: Omit<Pengumuman, 'id'>) => {
    const item: Pengumuman = {
      ...newPeng,
      id: `warta-${Date.now()}`,
    };
    setPengumumanList((prev) => [item, ...prev]);
  };

  const handleUpdatePengumuman = (updatedPeng: Pengumuman) => {
    setPengumumanList((prev) =>
      prev.map((p) => (p.id === updatedPeng.id ? updatedPeng : p))
    );
  };

  const handleDeletePengumuman = (id: string) => {
    setPengumumanList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetData = () => {
    if (confirm('Kembalikan semua data ke pengaturan awal (SDIT Alam Azizah)?')) {
      localStorage.clear();
      setSekolahConfig(initialSekolahConfig);
      setUserConfig(initialUserConfig);
      setDashboardConfig(initialDashboardConfig);
      setUserAccounts(initialUserAccounts);
      setSiswaList(initialSiswa);
      setSdmList(initialSDM);
      setPelanggaranList(initialPelanggaran);
      setPrestasiList(initialPrestasi);
      setMutasiList(initialMutasi);
      setMutabaahList(initialMutabaah);
      setPembinaanList(initialPembinaan);
      setPengumumanList(initialPengumuman);
      setRombelList(initialRombelList);
      setIndikatorConfig(initialIndikatorKarakterConfig);
      setUiTextConfig(initialUiTextConfig);
      setCurrentRole('pengelola');
      setCurrentView('dashboard');
    }
  };

  const scrollToEws = () => {
    setCurrentView('dashboard');
    setTimeout(() => {
      const ewsElement = document.getElementById('ewsSection');
      if (ewsElement) {
        ewsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // If not authenticated, render Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        sekolahConfig={sekolahConfig}
        userAccounts={userAccounts}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAF8] text-slate-800 antialiased">
      {/* Collapsible Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setIsSidebarOpen(false);
        }}
        sekolahConfig={sekolahConfig}
        currentUser={currentUser}
        currentRole={currentRole}
        onOpenSettings={() => setIsModalPengaturanOpen(true)}
        onOpenManajemenUser={() => setIsModalManajemenUserOpen(true)}
        onUpdateProfilePhoto={handleUpdateProfilePhoto}
        onLogout={handleLogout}
        ewsCount={{ siswa: studentAlertsCount, guru: sdmAlertsCount }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          currentView={currentView}
          sekolahConfig={sekolahConfig}
          currentUser={currentUser}
          currentRole={currentRole}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenSettings={() => setIsModalPengaturanOpen(true)}
          onOpenManajemenUser={() => setIsModalManajemenUserOpen(true)}
          onUpdateProfilePhoto={handleUpdateProfilePhoto}
          onLogout={handleLogout}
          onResetData={handleResetData}
          onScrollToEws={scrollToEws}
          totalAlerts={totalEws}
        />

        {/* Dynamic View Body */}
        <main className="main-content-area flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {currentView === 'dashboard' && (
            <DashboardView
              sekolahConfig={sekolahConfig}
              dashboardConfig={dashboardConfig}
              currentRole={currentRole}
              siswaList={siswaList}
              sdmList={sdmList}
              pelanggaranList={pelanggaranList}
              prestasiList={prestasiList}
              rombelList={rombelList}
              pengumumanList={pengumumanList}
              onOpenKelolaPengumuman={() => setIsModalKelolaPengumumanOpen(true)}
              onOpenEditDashboardText={() => setIsModalEditDashboardTextOpen(true)}
              onOpenScanPresensi={() => setIsModalScanPresensiOpen(true)}
              onOpenBarcodeCards={() => setIsModalBarcodeSdmOpen(true)}
              onOpenTambahPelanggaran={() => {
                setDefaultSiswaPelanggaranId(undefined);
                setIsModalTambahPelanggaranOpen(true);
              }}
              onOpenTambahPrestasi={() => {
                setDefaultSiswaPrestasiId(undefined);
                setIsModalTambahPrestasiOpen(true);
              }}
              onOpenInputMutabaah={() => {
                setDefaultSiswaMutabaahId(undefined);
                setIsModalInputMutabaahOpen(true);
              }}
              onNavigateToLaporan={() => setCurrentView('laporan')}
              onSelectSiswaForDetail={(s) => {
                setSelectedSiswaForDetail(s);
                setIsModalDetailSiswaOpen(true);
              }}
              onOpenEditSdm={(sdm) => {
                setSelectedSdmForEdit(sdm);
                setIsModalEditSdmOpen(true);
              }}
            />
          )}

          {currentView === 'kesiswaan' && (
            <KesiswaanView
              currentRole={currentRole}
              siswaList={siswaList}
              pelanggaranList={pelanggaranList}
              prestasiList={prestasiList}
              mutasiList={mutasiList}
              rombelList={rombelList}
              uiTextConfig={uiTextConfig}
              onOpenKelolaRombel={() => setIsModalKelolaRombelOpen(true)}
              onOpenTambahSiswa={() => setIsModalTambahSiswaOpen(true)}
              onOpenEditSiswa={(s) => {
                setSelectedSiswaForEdit(s);
                setIsModalEditSiswaOpen(true);
              }}
              onDeleteSiswa={handleDeleteSiswa}
              onOpenTambahPelanggaran={(siswaId) => {
                setDefaultSiswaPelanggaranId(siswaId);
                setIsModalTambahPelanggaranOpen(true);
              }}
              onOpenEditPelanggaran={(pel) => {
                setSelectedPelanggaranForEdit(pel);
                setIsModalEditPelanggaranOpen(true);
              }}
              onDeletePelanggaran={handleDeletePelanggaran}
              onOpenTambahPrestasi={(siswaId) => {
                setDefaultSiswaPrestasiId(siswaId);
                setIsModalTambahPrestasiOpen(true);
              }}
              onOpenEditPrestasi={(pres) => {
                setSelectedPrestasiForEdit(pres);
                setIsModalEditPrestasiOpen(true);
              }}
              onDeletePrestasi={handleDeletePrestasi}
              onOpenTambahMutasi={() => setIsModalTambahMutasiOpen(true)}
              onOpenEditMutasi={(mut) => {
                setSelectedMutasiForEdit(mut);
                setIsModalEditMutasiOpen(true);
              }}
              onDeleteMutasi={handleDeleteMutasi}
              onSelectSiswaForDetail={(s) => {
                setSelectedSiswaForDetail(s);
                setIsModalDetailSiswaOpen(true);
              }}
              onOpenPiagamModal={(prestasi) => {
                setSelectedPrestasiForPiagam(prestasi);
                setIsModalPiagamOpen(true);
              }}
            />
          )}

          {currentView === 'mutabaah' && (
            <MutabaahView
              currentRole={currentRole}
              mutabaahList={mutabaahList}
              siswaList={siswaList}
              indikatorConfig={indikatorConfig}
              uiTextConfig={uiTextConfig}
              onOpenInputMutabaah={(siswaId) => {
                setDefaultSiswaMutabaahId(siswaId);
                setIsModalInputMutabaahOpen(true);
              }}
              onOpenEditIndikator={() => setIsModalEditIndikatorOpen(true)}
              onOpenEditTombol={() => setIsModalEditTombolOpen(true)}
            />
          )}

          {currentView === 'sdm' && (
            <SdmView
              currentRole={currentRole}
              sdmList={sdmList}
              pembinaanList={pembinaanList}
              uiTextConfig={uiTextConfig}
              onOpenTambahSdm={() => setIsModalTambahSdmOpen(true)}
              onOpenEditSdm={(sdm) => {
                setSelectedSdmForEdit(sdm);
                setIsModalEditSdmOpen(true);
              }}
              onUpdateSdm={handleSaveEditSdm}
              onDeleteSdm={handleDeleteSdm}
              onOpenTambahPembinaan={() => setIsModalTambahPembinaanOpen(true)}
              onOpenEditPembinaan={(pem) => {
                setSelectedPembinaanForEdit(pem);
                setIsModalEditPembinaanOpen(true);
              }}
              onDeletePembinaan={handleDeletePembinaan}
              onOpenBarcodeCards={() => setIsModalBarcodeSdmOpen(true)}
              onOpenScanPresensi={() => setIsModalScanPresensiOpen(true)}
            />
          )}

          {currentView === 'ortu' && (
            <PortalOrtuView
              siswaList={
                currentUser.role === 'ortu' && currentUser.assignedSiswaId
                  ? siswaList.filter((s) => s.id === currentUser.assignedSiswaId)
                  : siswaList
              }
              mutabaahList={mutabaahList}
              pelanggaranList={pelanggaranList}
              prestasiList={prestasiList}
              sdmList={sdmList}
              pengumumanList={pengumumanList}
              onOpenPiagamModal={(prestasi) => {
                setSelectedPrestasiForPiagam(prestasi);
                setIsModalPiagamOpen(true);
              }}
            />
          )}

          {currentView === 'laporan' && (
            <LaporanView
              sekolahConfig={sekolahConfig}
              userConfig={userConfig}
              siswaList={siswaList}
              sdmList={sdmList}
              pelanggaranList={pelanggaranList}
              prestasiList={prestasiList}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          id="bottomNav"
          className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1B4332] text-white border-t border-emerald-800 z-30 flex items-center justify-around py-2 px-1 shadow-lg"
        >
          {currentRole !== 'ortu' && (
            <>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                  currentView === 'dashboard' ? 'text-white font-bold' : 'text-emerald-300'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mb-0.5" />
                <span className="text-[9px]">Dasbor</span>
              </button>

              <button
                onClick={() => setCurrentView('kesiswaan')}
                className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                  currentView === 'kesiswaan' ? 'text-white font-bold' : 'text-emerald-300'
                }`}
              >
                <Users className="w-5 h-5 mb-0.5" />
                <span className="text-[9px]">Murid</span>
              </button>

              <button
                onClick={() => setCurrentView('mutabaah')}
                className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                  currentView === 'mutabaah' ? 'text-white font-bold' : 'text-emerald-300'
                }`}
              >
                <BookOpen className="w-5 h-5 mb-0.5" />
                <span className="text-[9px]">Mutaba'ah</span>
              </button>

              {currentRole === 'pengelola' || currentRole === 'kepsek' ? (
                <button
                  onClick={() => setCurrentView('sdm')}
                  className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                    currentView === 'sdm' ? 'text-white font-bold' : 'text-emerald-300'
                  }`}
                >
                  <Briefcase className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px]">SDM</span>
                </button>
              ) : null}
            </>
          )}

          <button
            onClick={() => setCurrentView('ortu')}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
              currentView === 'ortu' ? 'text-white font-bold' : 'text-emerald-300'
            }`}
          >
            <HeartHandshake className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">Ortu</span>
          </button>
        </nav>
      </div>

      {/* Modals Mounting */}
      <ModalTambahSiswa
        isOpen={isModalTambahSiswaOpen}
        onClose={() => setIsModalTambahSiswaOpen(false)}
        onSave={handleAddSiswa}
      />

      <ModalEditSiswa
        isOpen={isModalEditSiswaOpen}
        onClose={() => {
          setIsModalEditSiswaOpen(false);
          setSelectedSiswaForEdit(null);
        }}
        siswa={selectedSiswaForEdit}
        onSave={handleSaveEditSiswa}
      />

      <ModalCatatPelanggaran
        isOpen={isModalTambahPelanggaranOpen}
        onClose={() => setIsModalTambahPelanggaranOpen(false)}
        siswaList={siswaList}
        defaultSiswaId={defaultSiswaPelanggaranId}
        onSave={handleAddPelanggaran}
      />

      <ModalEditPelanggaran
        isOpen={isModalEditPelanggaranOpen}
        onClose={() => {
          setIsModalEditPelanggaranOpen(false);
          setSelectedPelanggaranForEdit(null);
        }}
        pelanggaran={selectedPelanggaranForEdit}
        siswaList={siswaList}
        onSave={handleSaveEditPelanggaran}
      />

      <ModalCatatPrestasi
        isOpen={isModalTambahPrestasiOpen}
        onClose={() => setIsModalTambahPrestasiOpen(false)}
        siswaList={siswaList}
        defaultSiswaId={defaultSiswaPrestasiId}
        onSave={handleAddPrestasi}
      />

      <ModalEditPrestasi
        isOpen={isModalEditPrestasiOpen}
        onClose={() => {
          setIsModalEditPrestasiOpen(false);
          setSelectedPrestasiForEdit(null);
        }}
        prestasi={selectedPrestasiForEdit}
        siswaList={siswaList}
        onSave={handleSaveEditPrestasi}
      />

      <ModalTambahMutasi
        isOpen={isModalTambahMutasiOpen}
        onClose={() => setIsModalTambahMutasiOpen(false)}
        siswaList={siswaList}
        onAddMutasi={handleAddMutasi}
      />

      <ModalEditMutasi
        isOpen={isModalEditMutasiOpen}
        onClose={() => {
          setIsModalEditMutasiOpen(false);
          setSelectedMutasiForEdit(null);
        }}
        mutasi={selectedMutasiForEdit}
        siswaList={siswaList}
        onSave={handleSaveEditMutasi}
      />

      <ModalInputMutabaah
        isOpen={isModalInputMutabaahOpen}
        onClose={() => setIsModalInputMutabaahOpen(false)}
        siswaList={siswaList}
        defaultSiswaId={defaultSiswaMutabaahId}
        onSave={handleAddMutabaah}
      />

      <ModalTambahSdm
        isOpen={isModalTambahSdmOpen}
        onClose={() => setIsModalTambahSdmOpen(false)}
        onSave={handleAddSdm}
      />

      <ModalEditSdm
        isOpen={isModalEditSdmOpen}
        onClose={() => {
          setIsModalEditSdmOpen(false);
          setSelectedSdmForEdit(null);
        }}
        sdm={selectedSdmForEdit}
        onSave={handleSaveEditSdm}
      />

      <ModalCatatPembinaan
        isOpen={isModalTambahPembinaanOpen}
        onClose={() => setIsModalTambahPembinaanOpen(false)}
        sdmList={sdmList}
        userConfig={userConfig}
        onSave={handleAddPembinaan}
      />

      <ModalEditPembinaan
        isOpen={isModalEditPembinaanOpen}
        onClose={() => {
          setIsModalEditPembinaanOpen(false);
          setSelectedPembinaanForEdit(null);
        }}
        pembinaan={selectedPembinaanForEdit}
        sdmList={sdmList}
        onSave={handleSaveEditPembinaan}
        onDelete={handleDeletePembinaan}
      />

      <ModalPiagam
        isOpen={isModalPiagamOpen}
        onClose={() => {
          setIsModalPiagamOpen(false);
          setSelectedPrestasiForPiagam(null);
        }}
        prestasi={selectedPrestasiForPiagam}
        siswa={
          selectedPrestasiForPiagam
            ? siswaList.find((s) => s.id === selectedPrestasiForPiagam.siswaId) || null
            : null
        }
      />

      <ModalDetailSiswa
        isOpen={isModalDetailSiswaOpen}
        onClose={() => {
          setIsModalDetailSiswaOpen(false);
          setSelectedSiswaForDetail(null);
        }}
        siswa={selectedSiswaForDetail}
        pelanggaranList={pelanggaranList}
        prestasiList={prestasiList}
        mutabaahList={mutabaahList}
        onOpenPiagamModal={(prestasi) => {
          setSelectedPrestasiForPiagam(prestasi);
          setIsModalPiagamOpen(true);
        }}
      />

      <ModalPengaturan
        isOpen={isModalPengaturanOpen}
        onClose={() => setIsModalPengaturanOpen(false)}
        sekolahConfig={sekolahConfig}
        userConfig={userConfig}
        onSaveSekolah={setSekolahConfig}
        onSaveUser={setUserConfig}
      />

      <ModalManajemenUser
        isOpen={isModalManajemenUserOpen}
        onClose={() => setIsModalManajemenUserOpen(false)}
        userAccounts={userAccounts}
        currentUser={currentUser}
        siswaList={siswaList}
        rombelList={rombelList}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />

      <ModalEditTeksDashboard
        isOpen={isModalEditDashboardTextOpen}
        onClose={() => setIsModalEditDashboardTextOpen(false)}
        dashboardConfig={dashboardConfig}
        onSave={setDashboardConfig}
      />

      {/* New Feature Modals */}
      <ModalKelolaRombel
        isOpen={isModalKelolaRombelOpen}
        onClose={() => setIsModalKelolaRombelOpen(false)}
        rombelList={rombelList}
        onSaveRombelList={setRombelList}
      />

      <ModalEditIndikatorKarakter
        isOpen={isModalEditIndikatorOpen}
        onClose={() => setIsModalEditIndikatorOpen(false)}
        config={indikatorConfig}
        onSave={setIndikatorConfig}
      />

      <ModalEditTeksTombol
        isOpen={isModalEditTombolOpen}
        onClose={() => setIsModalEditTombolOpen(false)}
        config={uiTextConfig}
        onSave={setUiTextConfig}
      />

      <ModalKelolaPengumuman
        isOpen={isModalKelolaPengumumanOpen}
        onClose={() => setIsModalKelolaPengumumanOpen(false)}
        pengumumanList={pengumumanList}
        onSavePengumumanList={setPengumumanList}
      />

      <ModalBarcodeSdm
        isOpen={isModalBarcodeSdmOpen}
        onClose={() => setIsModalBarcodeSdmOpen(false)}
        sdmList={sdmList}
        userAccounts={userAccounts}
        sekolahConfig={sekolahConfig}
      />

      <ModalScanPresensi
        isOpen={isModalScanPresensiOpen}
        onClose={() => setIsModalScanPresensiOpen(false)}
        sdmList={sdmList}
        userAccounts={userAccounts}
        sekolahConfig={sekolahConfig}
        onUpdateSdmPresensi={handleUpdateSdmPresensi}
        onUpdateSekolahLocation={handleUpdateSekolahLocation}
      />
    </div>
  );
}
