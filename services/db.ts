
import { Kelas, Santri } from '../types';

const KELAS_KEY = 'alhafizh_kelas';
const SANTRI_KEY = 'alhafizh_santri';

const getInitialKelas = (): Kelas[] => [
  {
    id: 'juz-amma-pagi',
    nama_kelas: 'Kelas Juz Amma Pagi',
    targetHafalan: { dariSurat: 78, sampaiSurat: 114 },
  },
];

const getInitialSantri = (): Santri[] => [
    { 
        id: 'santri-001', 
        nama_santri: 'Ahmad Abdullah', 
        kelasId: 'juz-amma-pagi', 
        hafalanData: [
            { surat: 'An-Nas', nilai: 95, status_pengulangan: 'selesai', tanggal: new Date().toISOString(), catatan: 'Sangat Baik', detailNilai: { kelancaran: 'A', makhroj: 'A', tajwid: 'A', mad: 'A' } },
            { surat: 'Al-Falaq', nilai: 90, status_pengulangan: 'selesai', tanggal: new Date().toISOString(), catatan: 'Baik', detailNilai: { kelancaran: 'A', makhroj: 'B', tajwid: 'A', mad: 'A' } },
        ]
    },
    { 
        id: 'santri-002', 
        nama_santri: 'Fatimah Az-Zahra', 
        kelasId: 'juz-amma-pagi', 
        hafalanData: [
            { surat: 'An-Nas', nilai: 85, status_pengulangan: 'selesai', tanggal: new Date().toISOString(), catatan: 'Perlu latihan di mad', detailNilai: { kelancaran: 'A', makhroj: 'A', tajwid: 'B', mad: 'B' } },
        ] 
    },
];

export const loadData = (): { kelas: Kelas[], santri: Santri[] } => {
  try {
    const kelasJson = localStorage.getItem(KELAS_KEY);
    const santriJson = localStorage.getItem(SANTRI_KEY);

    const kelas = kelasJson ? JSON.parse(kelasJson) : getInitialKelas();
    const santri = santriJson ? JSON.parse(santriJson) : getInitialSantri();
    
    // If local storage is empty, save initial data
    if (!kelasJson) {
      localStorage.setItem(KELAS_KEY, JSON.stringify(kelas));
    }
    if (!santriJson) {
      localStorage.setItem(SANTRI_KEY, JSON.stringify(santri));
    }

    return { kelas, santri };
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
    return { kelas: getInitialKelas(), santri: getInitialSantri() };
  }
};

export const saveData = (kelas: Kelas[], santri: Santri[]) => {
  try {
    localStorage.setItem(KELAS_KEY, JSON.stringify(kelas));
    localStorage.setItem(SANTRI_KEY, JSON.stringify(santri));
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};

export const resetHafalanData = (santri: Santri[]): Santri[] => {
    const updatedSantri = santri.map(s => ({ ...s, hafalanData: [] }));
    saveData([], updatedSantri); // Assuming you want to save the change immediately
    return updatedSantri;
}
