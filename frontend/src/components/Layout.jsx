import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav.jsx';

function Layout() {
  return (
    <div className="min-h-screen bg-light pb-24">
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout;