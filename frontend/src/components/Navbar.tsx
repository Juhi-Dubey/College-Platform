'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener('focus', checkLogin);

    return () => {
      window.removeEventListener('focus', checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[72px] py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
            <Link href="/" className="text-xl md:text-2xl font-bold text-indigo-600">
              🎓 CollegeDiscovery
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap justify-end">   <Link href="/" className="text-gray-200 hover:text-indigo-600 text-sm sm:text-base font-medium transition">
              Home
            </Link>
            <Link href="/compare" className="text-gray-200 hover:text-indigo-600 text-sm sm:text-base font-medium transition">
              Compare
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/saved" className="text-gray-200 hover:text-indigo-600 text-sm sm:text-base font-medium transition">
                  Saved
                </Link>
                <Link
                  href="/comparisons"
                  className="text-gray-200 hover:text-indigo-600 text-sm sm:text-base font-medium transition"
                >
                  Comparisons
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-3 py-2 sm:px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 sm:px-4 rounded-xl border border-white/10 text-gray-200 hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 sm:px-4 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
