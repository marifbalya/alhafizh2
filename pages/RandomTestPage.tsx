import React, { useState, useMemo } from 'react';
import { Ayah, SurahDetail } from '../types';
import { ALL_SURAHS } from '../constants';
import { fetchSurahDetail } from '../services/quranApi';
import { Select } from '../components/ui';

const RandomTestPage: React.FC = () => {
    const sortedSurahs = useMemo(() => [...ALL_SURAHS].sort((a,b) => b.nomor - a.nomor), []);
    const [dariSurat, setDariSurat] = useState(sortedSurahs[0]?.nomor || 114);
    const [sampaiSurat, setSampaiSurat] = useState(sortedSurahs.find(s => s.nomor === 78)?.nomor || 78);
    const [testAyah, setTestAyah] = useState<Ayah | null>(null);
    const [testSurah, setTestSurah] = useState<SurahDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateTest = async () => {
        setTestAyah(null);
        setTestSurah(null);
        setIsLoading(true);

        const surahsInRange = ALL_SURAHS.filter(s => {
            const min = Math.min(dariSurat, sampaiSurat);
            const max = Math.max(dariSurat, sampaiSurat);
            return s.nomor >= min && s.nomor <= max;
        });

        if (surahsInRange.length === 0) {
            setIsLoading(false);
            return;
        }

        const randomSurah = surahsInRange[Math.floor(Math.random() * surahsInRange.length)];
        const surahDetail = await fetchSurahDetail(randomSurah.nomor);

        if (surahDetail && surahDetail.jumlahAyat > 1) {
            const randomAyahIndex = Math.floor(Math.random() * (surahDetail.jumlahAyat - 1)); // -1 to ensure there's a next ayah
            setTestAyah(surahDetail.ayat[randomAyahIndex]);
            setTestSurah(surahDetail);
        }
        setIsLoading(false);
    };
    
    return (
        <section className="fade-in">
            <h1 className="text-3xl font-bold text-[#5A3825] mb-6">Tes Hafalan Acak</h1>
            <div className="bg-[#F5DEB3] p-6 rounded-xl shadow-md max-w-3xl mx-auto text-center flex flex-col items-center">
                <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                    <Select id="tes-mulai" label="Dari Surat" value={dariSurat} onChange={e => setDariSurat(Number(e.target.value))}>
                        {sortedSurahs.map(s => <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin}</option>)}
                    </Select>
                     <Select id="tes-sampai" label="Sampai Surat" value={sampaiSurat} onChange={e => setSampaiSurat(Number(e.target.value))}>
                        {sortedSurahs.map(s => <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin}</option>)}
                    </Select>
                </div>
                <button onClick={generateTest} disabled={isLoading} className="mt-2 bg-[#DAA520] text-white py-3 px-6 rounded-lg shadow hover:bg-[#c7951c] transition text-lg disabled:bg-gray-400">
                    {isLoading ? 'Memuat...' : 'Mulai Tes Acak'}
                </button>

                {testAyah && testSurah && (
                    <div className="mt-6 w-full p-4 bg-white rounded-lg shadow-inner">
                        <p className="text-base text-center mb-4">Soal: Lanjutkan hafalan dari Surah {testSurah.namaLatin}:</p>
                        <p dir="rtl" className="font-amiri text-3xl text-amber-800 font-bold leading-[2.8]">{testAyah.teksArab} ﴿{testAyah.nomorAyat}﴾</p>
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-blue-600 hover:underline">Tampilkan Jawaban</summary>
                            <div className="mt-2 pt-2 border-t">
                                 <p className="text-base text-center mb-4 font-semibold">Jawaban (Lanjutan Ayat):</p>
                                 <p dir="rtl" className="font-amiri text-2xl leading-[2.8]">
                                    {testSurah.ayat.filter(a => a.nomorAyat > testAyah.nomorAyat)
                                        .map(a => `${a.teksArab} ﴿${a.nomorAyat}﴾`)
                                        .join(' ')}
                                 </p>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RandomTestPage;