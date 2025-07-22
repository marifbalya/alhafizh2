
import React, { useState, useMemo } from 'react';
import { Page, Kelas, Santri, Hafalan } from '../types';
import { RefreshIcon } from '../components/Icons';
import { Select } from '../components/ui';
import KelasModal from '../components/modals/KelasModal';
import SantriModal from '../components/modals/SantriModal';
import KelasCard from '../components/KelasCard';

interface PageProps {
    kelas: Kelas[];
    santri: Santri[];
    showToast: (message: string, isError?: boolean) => void;
    refreshData: () => void;
    addOrUpdateKelas: (data: Omit<Kelas, 'id'>, id?: string) => void;
    deleteKelas: (id: string) => void;
    addOrUpdateSantri: (data: Omit<Santri, 'id' | 'hafalanData'>, id?: string) => void;
    deleteSantri: (id: string) => void;
}

const SantriManagerPage: React.FC<PageProps> = ({ kelas, santri, showToast, refreshData, addOrUpdateKelas, deleteKelas, addOrUpdateSantri, deleteSantri }) => {
    const [isKelasModalOpen, setKelasModalOpen] = useState(false);
    const [isSantriModalOpen, setSantriModalOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
    const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
    const [filterKelas, setFilterKelas] = useState('all');
    const [sortSantri, setSortSantri] = useState('abjad');

    const handleEditKelas = (k: Kelas) => { setEditingKelas(k); setKelasModalOpen(true); };
    const handleAddKelas = () => { setEditingKelas(null); setKelasModalOpen(true); };
    const handleEditSantri = (s: Santri) => { setEditingSantri(s); setSantriModalOpen(true); };
    const handleAddSantri = () => {
        if (kelas.length === 0) {
            showToast("Buat kelas terlebih dahulu sebelum menambah santri.", true);
            return;
        }
        setEditingSantri(null); 
        setSantriModalOpen(true); 
    };
    
    const sortedSantri = useMemo(() => {
        let filtered = filterKelas === 'all' ? [...santri] : santri.filter(s => s.kelasId === filterKelas);
        
        switch(sortSantri) {
            case 'terbanyak':
                return filtered.sort((a, b) => (b.hafalanData?.length || 0) - (a.hafalanData?.length || 0));
            case 'terdikit':
                return filtered.sort((a, b) => (a.hafalanData?.length || 0) - (b.hafalanData?.length || 0));
            case 'abjad':
            default:
                return filtered.sort((a, b) => a.nama_santri.localeCompare(b.nama_santri));
        }
    }, [santri, filterKelas, sortSantri]);

    const kelasToRender = useMemo(() => {
        return filterKelas === 'all' ? kelas : kelas.filter(k => k.id === filterKelas);
    }, [kelas, filterKelas]);

    return (
        <section className="fade-in">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-[#5A3825]">Data Santri & Kelas</h1>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={refreshData} className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition flex items-center gap-2"><RefreshIcon /> Refresh</button>
                    <button onClick={handleAddKelas} className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">Tambah Kelas</button>
                    <button onClick={handleAddSantri} className="bg-[#DAA520] text-white py-2 px-4 rounded-lg shadow hover:bg-[#c7951c] transition">Tambah Santri</button>
                </div>
            </div>
            <div className="bg-[#F5DEB3] p-4 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-grow">
                        <Select id="filter-kelas" label="Filter per Kelas" value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
                            <option value="all">Semua Kelas</option>
                            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                        </Select>
                    </div>
                    <div className="flex-grow">
                        <Select id="sort-santri" label="Urutkan Menurut" value={sortSantri} onChange={e => setSortSantri(e.target.value)}>
                            <option value="abjad">Abjad Nama</option>
                            <option value="terbanyak">Hafalan Terbanyak</option>
                            <option value="terdikit">Hafalan Terdikit</option>
                        </Select>
                    </div>
                </div>
                <div className="space-y-6">
                    {kelasToRender.length === 0 && kelas.length === 0 && <p className="text-center italic text-gray-500 p-4">Belum ada kelas yang dibuat. Silakan buat kelas baru.</p>}
                    {kelasToRender.length === 0 && kelas.length > 0 && <p className="text-center italic text-gray-500 p-4">Tidak ada kelas yang cocok dengan filter.</p>}

                    {kelasToRender.map(k => (
                        <KelasCard key={k.id} kelas={k} santri={sortedSantri.filter(s => s.kelasId === k.id)} onEditKelas={handleEditKelas} onDeleteKelas={deleteKelas} onEditSantri={handleEditSantri} onDeleteSantri={deleteSantri} />
                    ))}
                </div>
            </div>

            {isKelasModalOpen && <KelasModal kelas={editingKelas} onClose={() => setKelasModalOpen(false)} onSave={addOrUpdateKelas} />}
            {isSantriModalOpen && <SantriModal santri={editingSantri} kelasList={kelas} onClose={() => setSantriModalOpen(false)} onSave={addOrUpdateSantri} />}
        </section>
    );
};

export default SantriManagerPage;
