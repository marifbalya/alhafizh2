
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Kelas, Santri, Hafalan, ToastMessage, ConfirmDialogInfo } from './types';
import { loadData, saveData } from './services/db';
import Layout from './components/Layout';
import { Toast, ConfirmDialog } from './components/ui';

// Import page components
import DashboardPage from './pages/DashboardPage';
import SantriManagerPage from './pages/SantriManagerPage';
import HafalanTrackerPage from './pages/HafalanTrackerPage';
import MurottalPlayerPage from './pages/MurottalPlayerPage';
import ProgressViewerPage from './pages/ProgressViewerPage';
import RandomTestPage from './pages/RandomTestPage';
import SettingsPage from './pages/SettingsPage';


// Helper function to generate unique IDs
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- Main App Component ---
export default function App() {
    const [page, setPage] = useState<Page>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [kelas, setKelas] = useState<Kelas[]>([]);
    const [santri, setSantri] = useState<Santri[]>([]);
    const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogInfo | null>(null);

    const mainContentRef = useRef<HTMLElement>(null);

    // Load data from localStorage on initial render
    useEffect(() => {
        const { kelas: loadedKelas, santri: loadedSantri } = loadData();
        setKelas(loadedKelas);
        setSantri(loadedSantri);
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        // Only save if data has been loaded initially
        if (kelas.length > 0 || santri.length > 0) {
            saveData(kelas, santri);
        }
    }, [kelas, santri]);
    
    // --- Navigation & UI Handlers ---
    const navigateTo = useCallback((newPage: Page) => {
        setPage(newPage);
        setSidebarOpen(false);
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const showToast = useCallback((message: string, isError: boolean = false) => {
        const id = Date.now();
        setToastMessages(prev => [...prev, { id, message, isError }]);
        setTimeout(() => {
            setToastMessages(prev => prev.filter(t => t.id !== id));
        }, 5000); // Increased duration for longer messages
    }, []);

    const showConfirmDialog = useCallback((info: ConfirmDialogInfo) => {
        setConfirmDialog(info);
    }, []);

    // --- Data CRUD Operations ---
    const addOrUpdateKelas = (newKelasData: Omit<Kelas, 'id'>, id?: string) => {
        if (id) {
            setKelas(prev => prev.map(k => k.id === id ? { ...k, ...newKelasData } : k));
            showToast('Kelas berhasil diperbarui!');
        } else {
            setKelas(prev => [...prev, { ...newKelasData, id: generateId() }]);
            showToast('Kelas baru berhasil ditambahkan!');
        }
    };
    
    const deleteKelas = (id: string) => {
        showConfirmDialog({
            title: 'Hapus Kelas?',
            body: 'Menghapus kelas juga akan menghapus semua santri di dalamnya. Anda yakin?',
            onConfirm: () => {
                setSantri(prev => prev.filter(s => s.kelasId !== id));
                setKelas(prev => prev.filter(k => k.id !== id));
                setConfirmDialog(null);
                showToast('Kelas dan santri di dalamnya berhasil dihapus.');
            }
        });
    };
    
    const addOrUpdateSantri = (newSantriData: Omit<Santri, 'id' | 'hafalanData'>, id?: string) => {
        if (id) {
            setSantri(prev => prev.map(s => s.id === id ? { ...s, ...newSantriData } : s));
            showToast('Data santri berhasil diperbarui!');
        } else {
            setSantri(prev => [...prev, { ...newSantriData, id: generateId(), hafalanData: [] }]);
            showToast('Santri baru berhasil ditambahkan!');
        }
    };

    const deleteSantri = (id: string) => {
        showConfirmDialog({
            title: 'Hapus Santri?',
            body: 'Anda yakin ingin menghapus santri ini? Semua data hafalannya akan hilang.',
            onConfirm: () => {
                setSantri(prev => prev.filter(s => s.id !== id));
                setConfirmDialog(null);
                showToast('Santri berhasil dihapus.');
            }
        });
    };
    
    const saveAssessment = (assessment: Hafalan, santriId: string) => {
        setSantri(prev => prev.map(s => {
            if (s.id === santriId) {
                const existingHafalanIndex = s.hafalanData.findIndex(h => h.surat === assessment.surat);
                const newHafalanData = [...s.hafalanData];
                if (existingHafalanIndex > -1) {
                    newHafalanData[existingHafalanIndex] = assessment;
                } else {
                    newHafalanData.push(assessment);
                }
                return { ...s, hafalanData: newHafalanData };
            }
            return s;
        }));
        showToast('Penilaian berhasil disimpan!');
    };

    const resetAllHafalan = () => {
        showConfirmDialog({
            title: 'Reset Semua Data Hafalan?',
            body: 'Tindakan ini akan menghapus semua progres dan riwayat penilaian untuk SEMUA santri. Data nama santri akan tetap ada.',
            onConfirm: () => {
                setSantri(prev => prev.map(s => ({ ...s, hafalanData: [] })));
                setConfirmDialog(null);
                showToast("Semua data hafalan berhasil direset.");
            }
        });
    };

    const refreshData = () => {
        const { kelas: loadedKelas, santri: loadedSantri } = loadData();
        setKelas(loadedKelas);
        setSantri(loadedSantri);
        showToast('Data berhasil dimuat ulang!');
    };
    
    const importData = (csvString: string) => {
        const lines = csvString.trim().split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) {
            showToast('File CSV kosong atau hanya berisi header.', true);
            return;
        }

        const headerLine = lines.shift() as string;
        const header = headerLine.trim().split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
        const santriNameIndex = header.indexOf('nama santri');
        const kelasNameIndex = header.indexOf('nama kelas');

        if (santriNameIndex === -1 || kelasNameIndex === -1) {
            showToast('Header CSV harus mengandung "Nama Santri" dan "Nama Kelas".', true);
            return;
        }

        const tempKelas = [...kelas];
        const tempSantri = [...santri];
        let newKelasCount = 0;
        let newSantriCount = 0;
        let skippedCount = 0;

        lines.forEach(line => {
            const values = line.trim().split(',');
            const santriName = values[santriNameIndex]?.trim().replace(/"/g, '');
            const kelasName = values[kelasNameIndex]?.trim().replace(/"/g, '');

            if (!santriName || !kelasName) {
                skippedCount++;
                return;
            }

            let kelasObj = tempKelas.find(k => k.nama_kelas.toLowerCase() === kelasName.toLowerCase());

            if (!kelasObj) {
                kelasObj = {
                    id: generateId(),
                    nama_kelas: kelasName,
                    targetHafalan: { dariSurat: 78, sampaiSurat: 114 }, // Default to Juz Amma
                };
                tempKelas.push(kelasObj);
                newKelasCount++;
            }
            
            const santriExists = tempSantri.some(s => 
                s.nama_santri.toLowerCase() === santriName.toLowerCase() && s.kelasId === kelasObj!.id
            );

            if (!santriExists) {
                const newSantri: Santri = {
                    id: generateId(),
                    nama_santri: santriName,
                    kelasId: kelasObj!.id,
                    hafalanData: [],
                };
                tempSantri.push(newSantri);
                newSantriCount++;
            } else {
                skippedCount++;
            }
        });

        setKelas(tempKelas);
        setSantri(tempSantri);

        let message = `Impor selesai. Ditambahkan: ${newSantriCount} santri & ${newKelasCount} kelas baru.`;
        if (skippedCount > 0) {
            message += ` ${skippedCount} data dilewati (duplikat/tidak valid).`;
        }
        showToast(message);
    };

    // --- Page Rendering ---
    const renderPage = () => {
        const props = { kelas, santri, navigateTo, showToast, addOrUpdateKelas, deleteKelas, addOrUpdateSantri, deleteSantri, saveAssessment, resetAllHafalan, refreshData, importData };
        switch (page) {
            case 'dashboard': return <DashboardPage {...props} />;
            case 'santri': return <SantriManagerPage {...props} />;
            case 'hafalan': return <HafalanTrackerPage {...props} />;
            case 'murottal': return <MurottalPlayerPage />;
            case 'progress': return <ProgressViewerPage {...props} />;
            case 'tes': return <RandomTestPage />;
            case 'pengaturan': return <SettingsPage {...props} />;
            default: return <DashboardPage {...props} />;
        }
    };

    return (
        <div className="bg-[#FDF5E6] min-h-screen text-[#5A3825]">
             <Layout page={page} navigateTo={navigateTo} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} mainContentRef={mainContentRef}>
                {renderPage()}
            </Layout>

            {toastMessages.map(toast => (
                <Toast key={toast.id} message={toast.message} isError={toast.isError} />
            ))}
            
            {confirmDialog && (
                <ConfirmDialog 
                    title={confirmDialog.title} 
                    body={confirmDialog.body} 
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(null)} 
                />
            )}
        </div>
    );
}
