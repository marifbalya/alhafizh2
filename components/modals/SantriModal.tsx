
import React, { useState } from 'react';
import { Santri, Kelas } from '../../types';
import { Modal, Select } from '../ui';

interface SantriModalProps {
    santri: Santri | null;
    kelasList: Kelas[];
    onClose: () => void;
    onSave: (data: Omit<Santri, 'id' | 'hafalanData'>, id?: string) => void;
}

const SantriModal: React.FC<SantriModalProps> = ({ santri, kelasList, onClose, onSave }) => {
    const [nama, setNama] = useState(santri?.nama_santri || '');
    const [kelasId, setKelasId] = useState(santri?.kelasId || (kelasList[0]?.id || ''));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ nama_santri: nama, kelasId }, santri?.id);
        onClose();
    };

    return (
        <Modal title={santri ? 'Edit Data Santri' : 'Tambah Santri Baru'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="santri-nama" className="block text-sm font-medium text-[#5A3825]">Nama Lengkap</label>
                    <input type="text" id="santri-nama" value={nama} onChange={e => setNama(e.target.value)} className="mt-1 block w-full border border-[#DAA520]/50 rounded-md shadow-sm p-2" required />
                </div>
                <div className="mb-6">
                     <Select label="Pilih Kelas" id="santri-kelas" value={kelasId} onChange={e => setKelasId(e.target.value)} required>
                        {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                    </Select>
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400">Batal</button>
                    <button type="submit" className="bg-[#DAA520] text-white py-2 px-4 rounded-lg hover:bg-[#c7951c]">Simpan Santri</button>
                </div>
            </form>
        </Modal>
    );
};

export default SantriModal;
