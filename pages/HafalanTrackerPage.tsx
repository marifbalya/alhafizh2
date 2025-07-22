
import React, { useState, useEffect, useMemo } from 'react';
import { Page, Kelas, Santri, SurahDetail, Hafalan } from '../types';
import { ALL_SURAHS, ASSESSMENT_CRITERIA, ASSESSMENT_GRADES } from '../constants';
import { fetchSurahDetail } from '../services/quranApi';
import { Select } from '../components/ui';

interface PageProps {
    kelas: Kelas[];
    santri: Santri[];
    saveAssessment: (assessment: Hafalan, santriId: string) => void;
    showToast: (message: string, isError?: boolean) => void;
}

const HafalanTrackerPage: React.FC<PageProps> = ({ kelas, santri, saveAssessment, showToast }) => {
    const [selectedKelasId, setSelectedKelasId] = useState('');
    const [selectedSantriId, setSelectedSantriId] = useState('');
    const [selectedSurahNo, setSelectedSurahNo] = useState('');
    const [startAyah, setStartAyah] = useState(1);
    const [endAyah, setEndAyah] = useState(1);
    const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fontSize, setFontSize] = useState(1.875); // rem
    const [assessmentNotes, setAssessmentNotes] = useState('');
    const [assessmentValues, setAssessmentValues] = useState<{[key: string]: string}>({});

    const santriInKelas = useMemo(() => santri.filter(s => s.kelasId === selectedKelasId), [santri, selectedKelasId]);
    const selectedKelas = useMemo(() => kelas.find(k => k.id === selectedKelasId), [kelas, selectedKelasId]);
    
    const targetSurahs = useMemo(() => {
        if (!selectedKelas) return [];
        return ALL_SURAHS
            .filter(s => s.nomor >= selectedKelas.targetHafalan.dariSurat && s.nomor <= selectedKelas.targetHafalan.sampaiSurat)
            .sort((a,b) => b.nomor - a.nomor); // Desc for Juz Amma style
    }, [selectedKelas]);
    
    useEffect(() => {
        if (selectedSurahNo) {
            setIsLoading(true);
            fetchSurahDetail(Number(selectedSurahNo))
                .then(data => {
                    setSurahDetail(data);
                    if (data) {
                        setStartAyah(1);
                        setEndAyah(data.jumlahAyat);
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setSurahDetail(null);
        }
    }, [selectedSurahNo]);

    const handleSave = () => {
        if (!selectedSantriId || !selectedSurahNo || !surahDetail) {
            showToast("Pilih santri dan surat terlebih dahulu.", true);
            return;
        }
        if (Object.keys(assessmentValues).length < ASSESSMENT_CRITERIA.length) {
            showToast("Mohon isi semua kriteria penilaian.", true);
            return;
        }
        
        const gradeMap = { 'A': 95, 'B': 85, 'C': 75, 'D': 65 };
        let totalNilai = 0;
        let hasMengulang = false;

        Object.values(assessmentValues).forEach(grade => {
            totalNilai += gradeMap[grade as keyof typeof gradeMap];
            if (grade === 'D') hasMengulang = true;
        });

        const newAssessment: Hafalan = {
            surat: surahDetail.namaLatin,
            nilai: Math.round(totalNilai / ASSESSMENT_CRITERIA.length),
            status_pengulangan: hasMengulang ? 'perlu ulang' : 'selesai',
            tanggal: new Date().toISOString(),
            catatan: assessmentNotes,
            detailNilai: assessmentValues as any,
        };
        
        saveAssessment(newAssessment, selectedSantriId);
        // Reset form
        setAssessmentNotes('');
        setAssessmentValues({});
    };

    const AyahDisplay = () => {
        if (isLoading) return <div className="text-center p-4">Memuat ayat...</div>;
        if (!surahDetail) return <div className="p-4 text-center text-gray-500">Pilih surat untuk menampilkan ayat.</div>;
        
        const ayahs = surahDetail.ayat.filter(a => a.nomorAyat >= startAyah && a.nomorAyat <= endAyah);
        const basmalah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

        return (
            <div className="w-full min-h-[200px] rounded-lg shadow-inner bg-white text-[#5A3825] p-6 text-right overflow-auto" style={{ fontSize: `${fontSize}rem`, lineHeight: 2.8 }}>
                 {surahDetail.nomor !== 1 && surahDetail.nomor !== 9 && startAyah === 1 && <p dir="rtl" className="mb-4 text-3xl text-center font-amiri">{basmalah}</p>}
                <p dir="rtl" className="font-amiri whitespace-pre-wrap">
                    {ayahs.map(a => `${a.teksArab} ﴿${a.nomorAyat}﴾`).join(' ')}
                </p>
            </div>
        );
    };
    
    return (
        <section className="fade-in bg-[#F5DEB3] p-6 rounded-xl shadow-md max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#5A3825] mb-6 text-center">Mulai Hafalan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select id="hafalan-kelas" label="Pilih Kelas" value={selectedKelasId} onChange={e => { setSelectedKelasId(e.target.value); setSelectedSantriId(''); setSelectedSurahNo(''); }}>
                    <option value="">Pilih Kelas</option>
                    {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                </Select>
                <Select id="hafalan-santri" label="Pilih Santri" value={selectedSantriId} onChange={e => setSelectedSantriId(e.target.value)} disabled={!selectedKelasId}>
                    <option value="">Pilih Santri</option>
                    {santriInKelas.map(s => <option key={s.id} value={s.id}>{s.nama_santri}</option>)}
                </Select>
            </div>
            <div className="mb-4">
                 <Select id="hafalan-surat" label="Pilih Surat" value={selectedSurahNo} onChange={e => setSelectedSurahNo(e.target.value)} disabled={!selectedSantriId}>
                    <option value="">Pilih Surat</option>
                    {targetSurahs.map(s => <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin}</option>)}
                </Select>
            </div>
            {surahDetail && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Select id="ayat-mulai" label="Mulai Ayat" value={startAyah} onChange={e => setStartAyah(Number(e.target.value))}>
                        {surahDetail.ayat.map(a => <option key={a.nomorAyat} value={a.nomorAyat}>Ayat {a.nomorAyat}</option>)}
                    </Select>
                    <Select id="ayat-sampai" label="Sampai Ayat" value={endAyah} onChange={e => setEndAyah(Number(e.target.value))}>
                        {surahDetail.ayat.map(a => <option key={a.nomorAyat} value={a.nomorAyat}>Ayat {a.nomorAyat}</option>)}
                    </Select>
                </div>
            )}
            
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-[#5A3825]">Teks Al-Qur'an</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setFontSize(f => Math.max(1.25, f - 0.25))} className="bg-gray-300 w-8 h-8 rounded-full font-bold text-lg hover:bg-gray-400">-</button>
                    <button onClick={() => setFontSize(f => Math.min(3.5, f + 0.25))} className="bg-gray-300 w-8 h-8 rounded-full font-bold text-lg hover:bg-gray-400">+</button>
                </div>
            </div>
            <AyahDisplay />

            <div className="mt-8">
                <h2 className="text-xl font-bold text-[#5A3825] mb-4">Blangko Penilaian</h2>
                <div className="space-y-4">
                    {ASSESSMENT_CRITERIA.map(criterion => (
                        <div key={criterion.id}>
                            <label className="block text-sm font-medium text-[#5A3825] mb-2">{criterion.name}:</label>
                            <div className="flex flex-wrap gap-2">
                                {ASSESSMENT_GRADES.map(grade => (
                                    <label key={grade.value} className={`px-3 py-2 rounded-lg cursor-pointer text-sm font-medium border-2 transition ${assessmentValues[criterion.id] === grade.value ? 'border-amber-600 bg-amber-100 text-amber-800' : 'border-gray-300'}`}>
                                        <input type="radio" name={criterion.id} value={grade.value} checked={assessmentValues[criterion.id] === grade.value} onChange={e => setAssessmentValues(v => ({...v, [criterion.id]: e.target.value}))} className="hidden" />
                                        {grade.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <label htmlFor="assessment-notes" className="block text-sm font-medium text-[#5A3825] mb-1">Catatan</label>
                <textarea id="assessment-notes" value={assessmentNotes} onChange={e => setAssessmentNotes(e.target.value)} rows={3} className="w-full p-2 border border-[#DAA520]/50 rounded-lg bg-white" placeholder="Contoh: Panjang pendek kurang seragam..."></textarea>
            </div>
            <button onClick={handleSave} className="mt-8 w-full bg-[#DAA520] text-white py-3 px-4 rounded-lg shadow hover:bg-[#c7951c] transition font-semibold text-lg">Simpan Penilaian</button>
        </section>
    );
};

export default HafalanTrackerPage;
