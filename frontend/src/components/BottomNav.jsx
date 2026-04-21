import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Menu as MenuIcon, ShoppingCart, Receipt, User } from 'lucide-react';

function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Koti' },
    { path: '/menu', icon: <MenuIcon size={20} />, label: 'Menu' },
    { path: '/cart', icon: <ShoppingCart size={20} />, label: 'Kori' },
    { path: '/orders', icon: <Receipt size={20} />, label: 'Tilaukset' },
    { path: '/profile', icon: <User size={20} />, label: 'Minä' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around p-3 shadow-lg z-1000 border-t border-gray-200">
      {navItems.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={`flex flex-col items-center text-xs gap-1 no-underline transition-colors ${
            location.pathname === item.path ? 'text-primary' : 'text-gray'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default BottomNav;