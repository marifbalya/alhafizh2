
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { HomeIcon, BookIcon, ChartIcon, SettingsIcon, MenuIcon, CloseIcon, ChevronUpIcon } from './Icons';

interface LayoutProps {
    children: React.ReactNode;
    page: Page;
    navigateTo: (page: Page) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    mainContentRef: React.RefObject<HTMLElement>;
}

const Layout: React.FC<LayoutProps> = ({ children, page, navigateTo, isSidebarOpen, setSidebarOpen, mainContentRef }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleScroll = () => {
        if (mainContentRef.current && mainContentRef.current.scrollTop > 200) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    const scrollToTop = () => {
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const contentArea = mainContentRef.current;
        contentArea?.addEventListener('scroll', handleScroll);
        return () => contentArea?.removeEventListener('scroll', handleScroll);
    }, [mainContentRef]);


    const navItems: { page: Page; label: string; icon?: React.ReactNode; }[] = [
        { page: 'dashboard', label: 'Home', icon: <HomeIcon /> },
        { page: 'santri', label: 'Data Santri' },
        { page: 'hafalan', label: 'Mulai Hafalan' },
        { page: 'murottal', label: 'Murottal', icon: <BookIcon /> },
        { page: 'progress', label: 'Progres', icon: <ChartIcon /> },
        { page: 'tes', label: 'Tes Acak' },
        { page: 'pengaturan', label: 'Setting', icon: <SettingsIcon /> },
    ];
    
    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-amber-800 to-gray-900 text-white shadow-lg">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white p-2 rounded-md hover:bg-white/20">
                            <MenuIcon />
                        </button>
                        <img src="https://i.postimg.cc/0QbJBZz5/IMG-20250719-WA0026-1.png" alt="Logo Al Hafizh" className="h-10 w-10 rounded-full border-2 border-amber-500" />
                        <h1 className="text-xl sm:text-2xl font-bold">Al Hafizh</h1>
                    </div>
                </div>
            </header>
            
            <div className="flex h-screen bg-[#FDF5E6]">
                {/* Sidebar (Desktop) */}
                <aside className={`bg-[#F5DEB3] text-[#5A3825] w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40 shadow-lg`}>
                    <div className="flex justify-between items-center px-4">
                        <span className="font-amiri text-2xl font-bold text-[#5A3825]">Menu</span>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-red-500 hover:text-red-700">
                            <CloseIcon />
                        </button>
                    </div>
                    <nav>
                        {navItems.map(item => (
                            <a key={item.page} href={`#${item.page}`} onClick={(e) => { e.preventDefault(); navigateTo(item.page); }}
                               className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-[#DAA520]/50 ${page === item.page ? 'bg-[#DAA520]/30' : ''}`}>
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
                    <main ref={mainContentRef} className="smooth-scroll flex-1 overflow-x-hidden overflow-y-auto bg-[#FDF5E6] pb-24 md:pb-6 p-4 md:p-6" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {children}
                    </main>
                </div>
            </div>

            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-lg z-50 border-t border-gray-200">
                <div className="flex justify-around">
                    {navItems.filter(item => item.icon).map(item => (
                        <a key={item.page} href={`#${item.page}`} onClick={(e) => { e.preventDefault(); navigateTo(item.page); }}
                           className={`flex flex-col items-center justify-center text-center p-2 w-full transition-colors ${page === item.page ? 'text-amber-700 border-t-2 border-amber-700 bg-amber-50' : 'text-gray-600 hover:text-amber-700'}`}>
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                        </a>
                    ))}
                </div>
            </nav>
            {showScrollTop && (
                 <button onClick={scrollToTop} className="fixed bottom-24 md:bottom-6 right-6 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition z-50">
                    <ChevronUpIcon />
                </button>
            )}
        </>
    );
};

export default Layout;
