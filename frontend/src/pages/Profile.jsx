import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Heart, History, CreditCard, MapPin, Ticket, LogOut } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Heart size={20} />, label: 'Suosikkiannokset' },
    { icon: <History size={20} />, label: 'Tilaushistoria' },
    { icon: <CreditCard size={20} />, label: 'Maksutavat' },
    { icon: <MapPin size={20} />, label: 'Toimitusosoitteet' },
    { icon: <Ticket size={20} />, label: 'Kupongit & tarjoukset' },
  ];

  const handleLogout = () => {
    if (confirm('Haluatko kirjautua ulos?')) {
      navigate('/');
    }
  };

  return (
    <>
      <Header showBackButton={true} title="Minä" />
      <div className="p-5 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 text-center mb-6 shadow-md">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-primary">
            <span className="text-5xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Matti Meikäläinen</h2>
          <p className="text-gray mb-3">matti@example.com</p>
          <p className="text-accent font-semibold">
            Kanta-asiakaspisteet: <strong>245</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md mb-6 divide-y">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-4 px-6 py-4 text-dark hover:bg-light transition-colors"
            >
              <span className="text-primary">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </a>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-4/5 mx-auto block bg-transparent text-primary border-2 border-primary px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-all"
        >
          Kirjaudu ulos
        </button>
      </div>
    </>
  );
}

export default Profile;