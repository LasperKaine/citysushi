import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    alert('Tili luotu onnistuneesti! (Demo)');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2 mb-3">
            <span className="text-4xl">🍣</span>
            City Sushi
          </div>
          <h1 className="text-3xl font-bold text-dark">Luo uusi tili</h1>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <div>
            <label className="block mb-2 font-semibold text-dark">Etunimi</label>
            <input
              type="text"
              name="firstName"
              placeholder="Matti"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-dark">Sukunimi</label>
            <input
              type="text"
              name="lastName"
              placeholder="Meikäläinen"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-dark">Sähköposti</label>
            <input
              type="email"
              name="email"
              placeholder="matti@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-dark">Puhelinnumero</label>
            <input
              type="tel"
              name="phone"
              placeholder="040 123 4567"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-dark">Salasana</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-dark">Salasana uudelleen</label>
            <input
              type="password"
              name="password2"
              placeholder="••••••••"
              value={formData.password2}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-lg bg-gray-100 focus:outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-all"
          >
            Luo tili
          </button>
        </form>

        <div className="text-center my-6 relative">
          <span className="bg-white px-3 text-gray">Onko sinulla jo tili?</span>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full bg-transparent text-primary border-2 border-primary py-3 rounded-full font-semibold text-lg hover:bg-red-50 transition-all"
        >
          Kirjaudu sisään
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

export default Register;