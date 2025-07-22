
import React, { useState, useMemo } from 'react';
import { Kelas } from '../../types';
import { ALL_SURAHS } from '../../constants';
import { Modal, Select } from '../ui';

interface KelasModalProps {
    kelas: Kelas | null;
    onClose: () => void;
    onSave: (data: Omit<Kelas, 'id'>, id?: string) => void;
}

const KelasModal: React.FC<KelasModalProps> = ({ kelas, onClose, onSave }) => {
    const [nama, setNama] = useState(kelas?.nama_kelas || '');
    const [dariSurat, setDariSurat] = useState(kelas?.targetHafalan.dariSurat || 78);
    const [sampaiSurat, setSampaiSurat] = useState(kelas?.targetHafalan.sampaiSurat || 114);
    
    const sortedSurahs = useMemo(() => [...ALL_SURAHS].sort((a, b) => b.nomor - a.nomor), []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // User sees "Mulai Dari" An-Nas (114) and "Sampai" An-Naba (78)
        // This means the range is 78-114. So "dari" should be smaller number.
        const finalDari = Math.min(dariSurat, sampaiSurat);
        const finalSampai = Math.max(dariSurat, sampaiSurat);

        onSave({ nama_kelas: nama, targetHafalan: { dariSurat: finalDari, sampaiSurat: finalSampai } }, kelas?.id);
        onClose();
    };

    return (
        <Modal title={kelas ? 'Edit Kelas' : 'Tambah Kelas Baru'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="kelas-nama" className="block text-sm font-medium text-[#5A3825]">Nama Kelas</label>
                    <input type="text" id="kelas-nama" value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Kelas Juz Amma" className="mt-1 block w-full border border-[#DAA520]/50 rounded-md shadow-sm p-2" required />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Select label="Mulai dari Surat" id="kelas-mulai" value={sampaiSurat} onChange={e => setSampaiSurat(Number(e.target.value))}>
                        {sortedSurahs.map(s => <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin}</option>)}
                    </Select>
                    <Select label="Sampai Surat" id="kelas-sampai" value={dariSurat} onChange={e => setDariSurat(Number(e.target.value))}>
                        {sortedSurahs.map(s => <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin}</option>)}
                    </Select>
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400">Batal</button>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Simpan Kelas</button>
                </div>
            </form>
        </Modal>
    );
};

export default KelasModal;
