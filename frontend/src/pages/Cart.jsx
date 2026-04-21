import React, { useState } from 'react';
import Header from '../components/Header';
import { Trash2, Plus, Minus } from 'lucide-react';

function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: 'California Roll', description: 'Krab, avokado, kurkku, seesami', price: 12.50, quantity: 2 },
    { id: 2, name: 'Spicy Tuna Roll', description: 'Tonnikala, sriracha, kurkku, nori', price: 14.00, quantity: 1 },
    { id: 3, name: 'Salmon Nigiri', description: 'Tuore lohi riisillä', price: 8.50, quantity: 3 },
  ]);

  const updateQuantity = (id, delta) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 3.90;
  const total = subtotal + delivery;

  return (
    <>
      <Header showBackButton={true} />
      <div className="p-5 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-dark">Ostoskori</h2>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark mb-1">{item.name}</h3>
                  <p className="text-sm text-gray mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-light border border-gray rounded-full w-8 h-8 flex items-center justify-center text-dark hover:bg-primary hover:text-white"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-center w-6">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-light border border-gray rounded-full w-8 h-8 flex items-center justify-center text-dark hover:bg-primary hover:text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-primary font-bold">{item.price}€</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <div className="flex justify-between mb-2 text-lg">
            <span>Välisumma</span>
            <span>{subtotal.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between mb-3 text-lg">
            <span>Toimitus</span>
            <span>{delivery.toFixed(2)}€</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between text-2xl font-bold text-primary">
            <span>Yhteensä</span>
            <span>{total.toFixed(2)}€</span>
          </div>
        </div>

        <button className="w-full bg-primary text-white py-4 rounded-full font-semibold text-lg hover:bg-red-700 transition-all">
          Siirry kassalle
        </button>
      </div>
    </>
  );
}

export default Cart;