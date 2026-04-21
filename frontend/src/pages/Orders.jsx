import React from 'react';
import Header from '../components/Header';

function Orders() {
  const orders = [
    {
      id: '1',
      number: '#CS-7842',
      status: 'delivered',
      date: '3. huhtikuuta 2026 • 18:45',
      items: 'Spicy Tuna Roll ×2 • Salmon Nigiri ×3 • Miso Soup',
      total: '28,90 €',
    },
    {
      id: '2',
      number: '#CS-7839',
      status: 'preparing',
      date: '2. huhtikuuta 2026 • 12:30',
      items: 'California Roll ×1 • Dragon Roll',
      total: '19,50 €',
    },
    {
      id: '3',
      number: '#CS-7831',
      status: 'delivered',
      date: '30. maaliskuuta 2026 • 19:20',
      items: 'Rainbow Roll • Edamame',
      total: '24,70 €',
    },
  ];

  return (
    <>
      <Header showBackButton={true} title="Tilaukset" />
      <div className="p-5 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-dark">Tilaukset</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-lg text-primary">{order.number}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'delivered'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {order.status === 'delivered' ? 'Toimitettu' : 'Valmistetaan'}
                </span>
              </div>
              <p className="text-sm text-gray mb-2">{order.date}</p>
              <p className="text-dark mb-3">{order.items}</p>
              <div className="text-lg font-semibold text-right">
                Yhteensä: <span className="text-primary">{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Orders;