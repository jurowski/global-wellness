'use client';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? 'text-blue-400 border-blue-400' 
      : 'text-gray-300 hover:text-blue-400 border-transparent';
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-xl font-bold text-white">
                Global Wellness
              </a>
            </div>
            <nav className="ml-6 flex space-x-8">
              <a
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/')}`}
              >
                Dashboard
              </a>
              <a
                href="/admin/fetchers"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/admin/fetchers')}`}
              >
                Data Fetchers
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 