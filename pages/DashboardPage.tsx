
import React, { useState, useEffect, useMemo } from 'react';
import { Page, Kelas, Santri } from '../types';
import { ALL_SURAHS } from '../constants';
import { StatCard } from '../components/ui';

interface PageProps {
    kelas: Kelas[];
    santri: Santri[];
    navigateTo: (page: Page) => void;
}

const DashboardPage: React.FC<PageProps> = ({ kelas, santri, navigateTo }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const motivationalQuotes = useMemo(() => [
        { arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ", translation: "Bacalah Al-Qur'an, karena ia akan datang pada hari kiamat sebagai pemberi syafa'at bagi para pembacanya.", source: "HR. Muslim" },
        { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", translation: "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.", source: "HR. Bukhari" },
        { arabic: "الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ", translation: "Orang yang mahir membaca Al-Qur'an, kelak akan bersama para malaikat yang mulia lagi taat.", source: "HR. Bukhari & Muslim" },
        { arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِنْ مُدَّكِرٍ", translation: "Dan sungguh, telah Kami mudahkan Al-Qur'an untuk pelajaran, maka adakah orang yang mau mengambil pelajaran?", source: "QS. Al-Qamar: 17" }
    ], []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % motivationalQuotes.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [motivationalQuotes.length]);

    const stats = useMemo(() => {
        const totalSantri = santri.length;
        if (totalSantri === 0) return { totalSantri: 0, totalSurat: 0, avgProgress: 0 };
        
        let totalMemorizedSurahs = 0;
        let totalProgressSum = 0;
        
        santri.forEach(s => {
            const k = kelas.find(k => k.id === s.kelasId);
            if (!k) return;

            const targetSurahs = ALL_SURAHS.filter(surah => surah.nomor >= k.targetHafalan.dariSurat && surah.nomor <= k.targetHafalan.sampaiSurat);
            if (targetSurahs.length === 0) return;

            const memorizedCount = s.hafalanData?.filter(h => h.status_pengulangan === 'selesai').length || 0;
            totalMemorizedSurahs += memorizedCount;
            totalProgressSum += (memorizedCount / targetSurahs.length) * 100;
        });

        const avgProgress = totalSantri > 0 ? Math.round(totalProgressSum / totalSantri) : 0;
        return { totalSantri, totalSurat: totalMemorizedSurahs, avgProgress };
    }, [santri, kelas]);
    
    const navItems: { page: Page; label: string; icon: React.ReactNode; }[] = [
        { page: 'santri', label: 'Data Santri', icon: <span className="text-3xl md:text-4xl text-[#5A3825] mb-2">🧑‍🎓</span> },
        { page: 'hafalan', label: 'Mulai Hafalan', icon: <span className="text-3xl md:text-4xl text-[#5A3825] mb-2">📚</span> },
        { page: 'murottal', label: 'Murottal', icon: <span className="text-3xl md:text-4xl text-[#5A3825] mb-2">🎧</span> },
        { page: 'progress', label: 'Progres', icon: <span className="text-3xl md:text-4xl text-[#5A3825] mb-2">📊</span> },
        { page: 'tes', label: 'Tes Acak', icon: <span className="text-3xl md:text-4xl text-[#5A3825] mb-2">🎲</span> },
        { page: 'pengaturan', label: 'Pengaturan', icon: <span className="text-3xl md:text-4xl text-[#5A3825] mb-2">⚙️</span> },
    ];
    
    return (
        <section className="fade-in max-w-4xl mx-auto">
            <div className="relative w-full h-56 bg-gradient-to-r from-gray-900 via-amber-800 to-gray-900 rounded-xl shadow-lg overflow-hidden mb-8">
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center transition-opacity duration-1000">
                    <p className="font-amiri text-2xl md:text-3xl lg:text-4xl leading-relaxed" dir="rtl">{motivationalQuotes[currentSlide].arabic}</p>
                    <p className="text-sm md:text-base italic mt-3">"{motivationalQuotes[currentSlide].translation}"</p>
                    <p className="text-xs md:text-sm font-semibold mt-2">({motivationalQuotes[currentSlide].source})</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {navItems.map(item => (
                    <button key={item.page} onClick={() => navigateTo(item.page)} className="bg-[#F5DEB3] p-4 md:p-6 rounded-xl shadow flex flex-col items-center justify-center text-center hover:bg-[#DAA520]/20 transition">
                        {item.icon}
                        <span className="text-sm md:text-lg font-semibold text-[#5A3825]">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Santri" value={stats.totalSantri.toString()} icon="👤" />
                <StatCard label="Total Surat Dikuasai" value={stats.totalSurat.toString()} icon="📖" />
                <StatCard label="Progres Rata-rata" value={`${stats.avgProgress}%`} icon="📈" />
            </div>
        </section>
    );
};

export default DashboardPage;
