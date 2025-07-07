// import Header from '@/Components/Nav/Header';
// import Sidebar from '@/Components/Nav/SideBar';
// import { Link, usePage } from '@inertiajs/react';
// import { PropsWithChildren, ReactNode, useState } from 'react';

// export default function Authenticated({
//     children,
// }: PropsWithChildren<{ header?: ReactNode }>) {
//     const { auth } = usePage().props;
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     return (
//         <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden">
//             {/* Sidebar */}
//             <Sidebar
//                 sidebarOpen={sidebarOpen}
//                 setSidebarOpen={setSidebarOpen}
//             />

//             {/* Main Content Area */}
//             <div className="flex flex-col flex-1 min-w-0">
//                 {/* Header */}
//                 <Header
//                     setSidebarOpen={setSidebarOpen}
//                     userName={auth.user.name}
//                     userRole={'Pharmacien'}
//                 />

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// }



import Header from '@/Components/Nav/Header';
import Sidebar from '@/Components/Nav/SideBar';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

// export default function Authenticated({
//     children,
// }: PropsWithChildren<{ header?: ReactNode }>) {
//     const user = usePage().props.auth.user;
//     const [sidebarOpen, setSidebarOpen] = useState(false)


export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            {/* Overlay pour mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden md:ml-64">
                <Header
                    setSidebarOpen={setSidebarOpen}
                    userName={auth.user.name}
                    userRole={'Pharmacien'}
                />
                <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}

