import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SurahDetail } from '../types';
import { ALL_SURAHS } from '../constants';
import { fetchSurahDetail } from '../services/quranApi';
import { Select } from '../components/ui';
import { PageSpinner, ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '../components/Icons';

const MurottalPlayerPage: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [juzFilter, setJuzFilter] = useState('all');
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playingAyah, setPlayingAyah] = useState<string | null>(null);

    const handleSelectSurah = async (nomor: number) => {
        setIsLoading(true);
        setView('detail');
        const data = await fetchSurahDetail(nomor);
        if (data) {
            setSelectedSurah(data);
        }
        setIsLoading(false);
    };

    const playAudio = (src: string, ayahKey: string) => {
        if (audioRef.current) {
            if (playingAyah === ayahKey && !audioRef.current.paused) {
                audioRef.current.pause();
                setPlayingAyah(null);
            } else {
                audioRef.current.src = src;
                audioRef.current.play();
                setPlayingAyah(ayahKey);
            }
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        const onEnded = () => setPlayingAyah(null);
        const onPause = () => {
            // Check if it was a user pause or natural end
            if (audio?.ended) return;
            setPlayingAyah(null);
        };
        audio?.addEventListener('ended', onEnded);
        audio?.addEventListener('pause', onPause);
        return () => {
            audio?.removeEventListener('ended', onEnded);
            audio?.removeEventListener('pause', onPause);
        };
    }, []);

    const juzSurahMapping = useMemo(() => ({
        1: [1, 2], 2: [2], 3: [2, 3], 4: [3, 4], 5: [4], 6: [4, 5], 7: [5, 6], 8: [6, 7], 9: [7, 8], 10: [8, 9], 11: [9, 10, 11], 12: [11, 12], 13: [12, 13, 14], 14: [15, 16], 15: [17, 18], 16: [18, 19, 20], 17: [21, 22], 18: [23, 24, 25], 19: [25, 26, 27], 20: [27, 28, 29], 21: [29, 30, 31, 32, 33], 22: [33, 34, 35, 36], 23: [36, 37, 38, 39], 24: [39, 40, 41], 25: [41, 42, 43, 44, 45], 26: [46, 47, 48, 49, 50, 51], 27: [51, 52, 53, 54, 55, 56, 57], 28: [58, 59, 60, 61, 62, 63, 64, 65, 66], 29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], 30: [...Array(37).keys()].map(i => i + 78)
    }), []);

    const filteredSurahs = useMemo(() => {
        if (juzFilter === 'all') return ALL_SURAHS;
        const surahNumbersInJuz = juzSurahMapping[juzFilter as any];
        return ALL_SURAHS.filter(surah => surahNumbersInJuz?.includes(surah.nomor));
    }, [juzFilter, juzSurahMapping]);

    const SurahListView = () => (
        <div>
            <div className="mb-8">
                <Select id="juz-select" label="Pilih Tampilan:" value={juzFilter} onChange={e => setJuzFilter(e.target.value)}>
                    <option value="all">Semua Surat</option>
                    {[...Array(30).keys()].map(i => <option key={i+1} value={i+1}>Juz {i+1}</option>)}
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map(surah => (
                    <div key={surah.nomor} onClick={() => handleSelectSurah(surah.nomor)} className="bg-white p-4 rounded-lg hover:bg-amber-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-md border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <span className="text-amber-700 font-bold">{surah.nomor}</span>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">{surah.namaLatin}</h3>
                                <p className="text-sm text-gray-600">{surah.arti}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-amiri text-2xl text-amber-900">{surah.nama}</p>
                                <p className="text-xs text-gray-500">{surah.jumlahAyat} Ayat</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const SurahDetailView = () => {
        if (isLoading) return <PageSpinner />;
        if (!selectedSurah) return <p>Surat tidak ditemukan.</p>;

        const prevSurah = selectedSurah.suratSebelumnya;
        const nextSurah = selectedSurah.suratSelanjutnya;

        return (
            <div>
                <button onClick={() => setView('list')} className="mb-6 bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition shadow"><ChevronLeftIcon/> Kembali</button>
                <div className="bg-white p-6 rounded-lg mb-8 text-center fade-in shadow-md">
                    <h2 className="text-3xl font-bold text-amber-800">{selectedSurah.namaLatin} ({selectedSurah.nama})</h2>
                    <p className="text-gray-600 mt-2">{selectedSurah.arti} • {selectedSurah.jumlahAyat} Ayat • {selectedSurah.tempatTurun}</p>
                    <div className="mt-4 text-sm text-left text-gray-700">{selectedSurah.deskripsi}</div>
                    <div className="mt-6">
                        <p className="mb-2 text-gray-500">Dengarkan Full Surah (Misyari Rasyid Al-Afasi)</p>
                        <audio controls className="w-full" src={selectedSurah.audioFull['05']} onPlay={() => audioRef.current?.pause()}>Browser Anda tidak mendukung elemen audio.</audio>
                    </div>
                </div>
                <div className="space-y-8">
                    {selectedSurah.nomor !== 1 && selectedSurah.nomor !== 9 && (
                         <div className="flex justify-between items-center py-6 my-6 border-y-2 border-amber-200 fade-in">
                            <p className="font-amiri text-4xl md:text-5xl text-amber-900 flex-grow text-center">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                        </div>
                    )}
                    {selectedSurah.ayat.map(ayat => (
                        <div key={ayat.nomorAyat} className="bg-white p-5 rounded-lg fade-in border-l-4 border-amber-500 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-amber-600 font-bold"> Ayat {ayat.nomorAyat}</div>
                                <button onClick={() => playAudio(ayat.audio['05'], `${selectedSurah.nomor}:${ayat.nomorAyat}`)} className="p-2 rounded-full bg-amber-600 hover:bg-amber-500 transition text-white">
                                    {playingAyah === `${selectedSurah.nomor}:${ayat.nomorAyat}` ? <PauseIcon/> : <PlayIcon/>}
                                </button>
                            </div>
                            <p className="text-right font-amiri text-3xl md:text-4xl mb-4 text-gray-900 leading-[2.8]">{ayat.teksArab}</p>
                            <p className="text-left text-gray-700">{ayat.teksIndonesia}</p>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between mt-8">
                    {prevSurah ? <button onClick={() => handleSelectSurah(prevSurah.nomor)} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition shadow"><ChevronLeftIcon/> {prevSurah.namaLatin}</button> : <div></div>}
                    {nextSurah ? <button onClick={() => handleSelectSurah(nextSurah.nomor)} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition shadow">{nextSurah.namaLatin} <ChevronRightIcon/></button> : <div></div>}
                </div>
            </div>
        );
    }
    
    return (
        <section className="fade-in">
            <audio ref={audioRef} className="hidden" />
            {view === 'list' ? <SurahListView/> : <SurahDetailView />}
        </section>
    );
};

export default MurottalPlayerPage;