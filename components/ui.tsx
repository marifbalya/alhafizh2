
import React from 'react';

export const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <div className="bg-[#F5DEB3] p-6 rounded-xl shadow flex items-center justify-between">
        <div>
            <p className="text-sm text-[#5A3825]">{label}</p>
            <p className="text-3xl font-bold text-[#5A3825]">{value}</p>
        </div>
        <div className="bg-[#DAA520]/30 p-3 rounded-full text-[#DAA520]"><span className="text-2xl">{icon}</span></div>
    </div>
);

export const Toast: React.FC<{ message: string; isError: boolean }> = ({ message, isError }) => (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 transition-all duration-300 animate-fade-in-up ${isError ? 'bg-red-500' : 'bg-green-500'}`}>
        {message}
    </div>
);

export const ConfirmDialog: React.FC<{ title: string; body: string; onConfirm: () => void; onCancel: () => void; }> = ({ title, body, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-[#FDF5E6] p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#5A3825] mb-2">{title}</h3>
            <p className="text-sm text-stone-600 mb-6">{body}</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400">Batal</button>
                <button onClick={onConfirm} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">Ya, Lanjutkan</button>
            </div>
        </div>
    </div>
);

export const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={onClose}>
        <div className="bg-[#FDF5E6] rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-[#5A3825] mb-6">{title}</h2>
            {children}
        </div>
    </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string}> = ({label, id, children, ...props}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[#5A3825] mb-1">{label}</label>
        <select id={id} {...props} className="w-full p-2 border border-[#DAA520]/50 rounded-lg bg-white relative z-10 disabled:bg-gray-200">
            {children}
        </select>
    </div>
);

export const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition ${isActive ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {label}
    </button>
);
