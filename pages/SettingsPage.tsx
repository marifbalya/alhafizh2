
import React, { useRef } from 'react';
import { Santri, Kelas } from '../types';

interface PageProps {
    santri: Santri[];
    kelas: Kelas[];
    resetAllHafalan: () => void;
    importData: (csvString: string) => void;
}

const SettingsPage: React.FC<PageProps> = ({ santri, kelas, resetAllHafalan, importData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const exportToCsv = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Nama Santri,Nama Kelas\r\n";
        
        santri.forEach(s => {
            const k = kelas.find(k => k.id === s.kelasId);
            const row = `"${s.nama_santri}","${k ? k.nama_kelas : 'Tanpa Kelas'}"`;
            csvContent += row + "\r\n";
        });
        
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `data_santri_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) {
                importData(text);
            }
        };
        reader.onerror = () => {
            console.error("Gagal membaca file.");
        };
        reader.readAsText(file);
        
        if (event.target) {
            event.target.value = '';
        }
    };
    
    return (
        <section className="fade-in">
            <h1 className="text-3xl font-bold text-[#5A3825] mb-6">Pengaturan & Data</h1>
            <div className="bg-[#F5DEB3] p-6 rounded-xl shadow-md max-w-3xl mx-auto">
                <div>
                    <h2 className="text-xl font-bold text-[#5A3825] mb-2">Manajemen Data</h2>
                    <p className="text-stone-600 mb-4">Impor data santri dari file CSV, atau ekspor data yang ada. Format impor: "Nama Santri,Nama Kelas".</p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={exportToCsv} className="bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition">Ekspor ke CSV</button>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv, text/csv"
                            className="hidden"
                        />
                        <button onClick={handleImportClick} className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
                            Impor dari CSV
                        </button>
                    </div>
                </div>

                <div className="my-6 border-t border-amber-800/20"></div>

                <div className="border-2 border-red-300 bg-red-50 p-4 rounded-lg">
                    <h2 className="text-xl font-bold text-red-800 mb-2">Zona Berbahaya</h2>
                    <p className="text-red-700 mb-4">Tindakan berikut ini akan menghapus data secara permanen dan tidak dapat diurungkan. Harap berhati-hati.</p>
                    <button onClick={resetAllHafalan} className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition">Reset Semua Data Hafalan</button>
                </div>
            </div>
        </section>
    );
};

export default SettingsPage;
