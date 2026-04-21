import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (email) {
      alert('Kirjauduttu sisään! (Demo)');
      navigate('/');
    } else {
      alert('Syötä sähköposti');
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2 mb-3">
            <span className="text-4xl">🍣</span>
            City Sushi
          </div>
          <h1 className="text-3xl font-bold text-dark">Kirjaudu sisään</h1>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label className="block mb-2 font-semibold text-dark">Sähköposti</label>
            <input
              type="email"
              placeholder="matti@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-dark">Salasana</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Muista minut
            </label>
            <a href="#" className="text-primary hover:underline">
              Unohtuiko salasana?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-all"
          >
            Kirjaudu sisään
          </button>
        </form>

        <div className="text-center my-6 relative">
          <span className="bg-white px-3 text-gray">Ei vielä tiliä?</span>
        </div>

        <button
          onClick={() => navigate('/register')}
          className="w-full bg-transparent text-primary border-2 border-primary py-3 rounded-full font-semibold text-lg hover:bg-red-50 transition-all"
        >
          Luo uusi tili
        </button>

        <div className="text-center mt-6">
          <a href="/" className="text-gray hover:text-primary">
            ← Takaisin etusivulle
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;