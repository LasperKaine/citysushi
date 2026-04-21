import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();

  const recommendations = [
    { id: 1, name: 'California Roll', price: '12.50€', emoji: '🍱' },
    { id: 2, name: 'Spicy Tuna Roll', price: '14.00€', emoji: '🍱' },
    { id: 3, name: 'Salmon Nigiri', price: '8.50€', emoji: '🍣' },
  ];

  return (
    <>
      <Header />
      <div
        className="relative h-64 bg-cover bg-center flex flex-col justify-center items-center text-center text-white px-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://picsum.photos/id/1015/1200/800')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-4xl font-bold mb-2">Tervetuloa City Sushille!</h1>
        <p className="text-lg mb-6 opacity-95">Tuoretta sushia • Maistuvaa ruokaa</p>
        <button
          onClick={() => navigate('/menu')}
          className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-all"
        >
          Menu
        </button>
      </div>

      <div className="p-5 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 mt-6 text-dark">Erityistarjoukset</h2>
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative">
          <span className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
            20% OFF
          </span>
          <h3 className="text-lg font-semibold">Special Roll Friday</h3>
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-6 text-dark">Suositellut annokset</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-semibold text-lg text-dark mb-2">{item.name}</h3>
              <p className="text-primary font-bold text-lg">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;