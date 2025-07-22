
import React from 'react';
import { Kelas, Santri } from '../types';

interface KelasCardProps {
    kelas: Kelas;
    santri: Santri[];
    onEditKelas: (k: Kelas) => void;
    onDeleteKelas: (id: string) => void;
    onEditSantri: (s: Santri) => void;
    onDeleteSantri: (id: string) => void;
}

const KelasCard: React.FC<KelasCardProps> = ({ kelas, santri, onEditKelas, onDeleteKelas, onEditSantri, onDeleteSantri }) => (
    <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            <h3 className="text-xl font-bold text-[#5A3825]">{kelas.nama_kelas}</h3>
            <div className="text-sm">
                <button onClick={() => onEditKelas(kelas)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDeleteKelas(kelas.id)} className="text-red-600 hover:underline ml-2">Hapus</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-[#DAA520]/50">
                    <tr>
                        <th className="p-3 text-center w-12">No.</th>
                        <th className="p-3">Nama Santri</th>
                        <th className="p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {santri.length === 0 ? (
                        <tr><td colSpan={3} className="p-3 text-center italic text-gray-500">Tidak ada santri di kelas ini.</td></tr>
                    ) : (
                        santri.map((s, index) => (
                            <tr key={s.id} className="border-b border-[#DAA520]/20 last:border-b-0">
                                <td className="p-3 text-center">{index + 1}</td>
                                <td className="p-3 whitespace-nowrap font-medium">{s.nama_santri}</td>
                                <td className="p-3 whitespace-nowrap text-sm">
                                    <button onClick={() => onEditSantri(s)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => onDeleteSantri(s.id)} className="text-red-600 hover:underline ml-2">Hapus</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default KelasCard;
