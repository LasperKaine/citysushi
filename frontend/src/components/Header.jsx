import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

function Header({ showBackButton = false, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const showAuth = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <header className="sticky top-0 z-100 bg-white px-5 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="bg-none border-none text-2xl text-dark cursor-pointer p-2"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-2xl">🍣</span>
          City Sushi
        </div>
      </div>

      {showAuth && (
        <div className="flex gap-2">
          <a
            href="/login"
            className="px-4 py-2 rounded-full text-sm font-semibold text-primary border-2 border-primary hover:bg-red-50 transition-all"
          >
            Kirjaudu
          </a>
          <a
            href="/register"
            className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary border-2 border-primary hover:bg-red-700 transition-all"
          >
            Rekisteröidy
          </a>
        </div>
      )}
    </header>
  );
}

export default Header;