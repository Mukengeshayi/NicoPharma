import Footer from '@/Components/Nav/Footer';
import Header from '@/Components/Nav/Header';
import Sidebar from '@/Components/Nav/SideBar';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
 useState(false);

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {children}
                </main>

            </div>
        </div>
    );
}
