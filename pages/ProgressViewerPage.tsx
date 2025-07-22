
import React, { useState, useMemo } from 'react';
import { Page, Kelas, Santri } from '../types';
import { ALL_SURAHS } from '../constants';
import { Select, TabButton } from '../components/ui';

interface PageProps {
    kelas: Kelas[];
    santri: Santri[];
}

const ProgressViewerPage: React.FC<PageProps> = ({ kelas, santri }) => {
    const [activeTab, setActiveTab] = useState<'kelas' | 'santri'>('kelas');
    const [selectedKelasId, setSelectedKelasId] = useState(kelas[0]?.id || '');
    const [selectedSantriId, setSelectedSantriId] = useState('');
    
    const kelasForProgress = useMemo(() => kelas.find(k => k.id === selectedKelasId), [kelas, selectedKelasId]);
    const santriForProgress = useMemo(() => santri.find(s => s.id === selectedSantriId), [santri, selectedSantriId]);
    const santriInKelas = useMemo(() => santri.filter(s => s.kelasId === selectedKelasId), [santri, selectedKelasId]);

    const targetSurahs = useMemo(() => {
        if (!kelasForProgress) return [];
        return ALL_SURAHS
            .filter(s => s.nomor >= kelasForProgress.targetHafalan.dariSurat && s.nomor <= kelasForProgress.targetHafalan.sampaiSurat)
            .sort((a,b) => b.nomor - a.nomor);
    }, [kelasForProgress]);
    
    const surahProgress = useMemo(() => {
        if (!kelasForProgress || santriInKelas.length === 0) return [];
        return targetSurahs.map(surah => {
            const completedCount = santriInKelas.filter(s => 
                s.hafalanData.some(h => h.surat === surah.namaLatin && h.status_pengulangan === 'selesai')
            ).length;
            const percentage = (completedCount / santriInKelas.length) * 100;
            return { name: surah.namaLatin, completed: completedCount, total: santriInKelas.length, percentage };
        });
    }, [santriInKelas, kelasForProgress, targetSurahs]);
    
    return (
        <section className="fade-in">
            <h1 className="text-3xl font-bold text-[#5A3825] mb-6">Progres Hafalan</h1>
            <div className="bg-[#F5DEB3] p-6 rounded-xl shadow-md">
                <div className="border-b border-[#DAA520]/50 mb-4">
                    <nav className="flex -mb-px">
                        <TabButton label="Progres Kelas" isActive={activeTab === 'kelas'} onClick={() => setActiveTab('kelas')} />
                        <TabButton label="Progres Santri" isActive={activeTab === 'santri'} onClick={() => setActiveTab('santri')} />
                    </nav>
                </div>

                {activeTab === 'kelas' ? (
                    <div>
                        <div className="mb-4 max-w-sm">
                            <Select id="progress-kelas" label="Pilih Kelas" value={selectedKelasId} onChange={e => setSelectedKelasId(e.target.value)}>
                                <option value="">Pilih Kelas</option>
                                {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                            </Select>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-inner">
                            <p className="mb-4 font-semibold">Total Santri di Kelas: <span className="font-bold text-amber-800">{santriInKelas.length}</span></p>
                            <div className="space-y-3">
                                {surahProgress.length > 0 ? surahProgress.map(p => (
                                    <div key={p.name} className="grid grid-cols-[100px,1fr,80px] gap-4 items-center text-sm">
                                        <span className="font-medium text-gray-700 truncate">{p.name}</span>
                                        <div className="bg-gray-200 rounded-full h-4"><div className="bg-emerald-500 h-4 rounded-full" style={{width: `${p.percentage}%`}}></div></div>
                                        <span className="font-semibold text-right">{p.completed}/{p.total}</span>
                                    </div>
                                )) : <p className="italic text-gray-500 text-center">Pilih kelas untuk melihat progres.</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <Select id="progress-santri-kelas" label="Pilih Kelas" value={selectedKelasId} onChange={e => { setSelectedKelasId(e.target.value); setSelectedSantriId(''); }}>
                                <option value="">Pilih Kelas</option>
                                {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                            </Select>
                            <Select id="progress-santri-santri" label="Pilih Santri" value={selectedSantriId} onChange={e => setSelectedSantriId(e.target.value)} disabled={!selectedKelasId}>
                                <option value="">Pilih Santri</option>
                                {santriInKelas.map(s => <option key={s.id} value={s.id}>{s.nama_santri}</option>)}
                            </Select>
                        </div>
                        <div className="mt-4 space-y-2 bg-white p-4 rounded-lg shadow-inner min-h-[10rem]">
                            {santriForProgress ? (
                                santriForProgress.hafalanData.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {santriForProgress.hafalanData.map(h => (
                                        <li key={h.surat}><strong>{h.surat}</strong>: <span className={`${h.status_pengulangan === 'selesai' ? 'text-green-700' : 'text-red-700'} font-semibold`}>{h.status_pengulangan}</span> (Nilai: {h.nilai})</li>
                                    ))}
                                </ul>
                                ) : <p className="italic text-gray-500">Santri ini belum memiliki data hafalan.</p>
                            ) : <p className="italic text-gray-500">Pilih santri untuk melihat progres.</p>}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProgressViewerPage;
