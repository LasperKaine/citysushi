import React from 'react';
import Header from '../components/Header';

function Menu() {
  const categories = [
    {
      name: 'Maki Rolls',
      icon: '🍱',
      items: [
        { id: 1, name: 'California Roll', description: 'Krab, avokado, kurkku, seesami', price: '12.50€' },
        { id: 2, name: 'Spicy Tuna Roll', description: 'Tonnikala, sriracha, kurkku, nori', price: '14.00€' },
        { id: 3, name: 'Vegetarian Roll', description: 'Avokado, kurkku, paprika, tofu', price: '11.00€' },
      ],
    },
    {
      name: 'Nigiri',
      icon: '🍣',
      items: [
        { id: 4, name: 'Salmon Nigiri', description: 'Tuore lohi riisillä', price: '8.50€' },
        { id: 5, name: 'Tuna Nigiri', description: 'Tuore tonnikala riisillä', price: '9.00€' },
        { id: 6, name: 'Ebi Nigiri', description: 'Kookoskatkarapu riisillä', price: '7.50€' },
      ],
    },
    {
      name: 'Sashimi',
      icon: '🥢',
      items: [
        { id: 7, name: 'Salmon Sashimi', description: 'Tuore lohi viipaleina (6kpl)', price: '16.00€' },
        { id: 8, name: 'Mixed Sashimi', description: 'Lohi, tonnikala, hamachi (9kpl)', price: '22.00€' },
      ],
    },
    {
      name: 'Keitto & Dumplingit',
      icon: '🍜',
      items: [
        { id: 9, name: 'Miso Keitto', description: 'Perinteinen miso keitto tofuilla', price: '4.50€' },
        { id: 10, name: 'Gyoza', description: 'Paistetut dumplingit (6kpl)', price: '8.00€' },
      ],
    },
  ];

  return (
    <>
      <Header showBackButton={true} />
      <div className="p-5 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {categories.map((category) => (
            <div key={category.name} className="bg-blue-50 rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-dark">{category.name}</h2>
              </div>
              <div className="bg-white rounded-2xl p-4 space-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-dark mb-1">{item.name}</h3>
                    <p className="text-sm text-gray mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{item.price}</span>
                      <button className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-700">
                        Lisää
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Menu;