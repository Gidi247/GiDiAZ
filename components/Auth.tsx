import React, { useState } from 'react';
import { User, Role } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: Role.STAFF
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsers = localStorage.getItem('gidi_users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (isLogin) {
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } else {
      if (users.find(u => u.username === formData.username)) {
        setError('Username already exists');
        return;
      }
      const newUser: User = {
        username: formData.username,
        password: formData.password, // Note: In production, never store plain text passwords
        name: formData.name,
        role: formData.role
      };
      users.push(newUser);
      localStorage.setItem('gidi_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gidiLight">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-gidiBlue to-gidiTeal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fa-solid fa-plus text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gidiDark">GiDi<span className="text-gidiTeal">.</span></h1>
          <p className="text-gray-500 mt-2">The Intelligent Healthcare Ecosystem</p>
        </div>

        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-white shadow text-gidiBlue' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-white shadow text-gidiBlue' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
                >
                  <option value={Role.STAFF}>Staff</option>
                  <option value={Role.PHARMACIST}>Pharmacist</option>
                  <option value={Role.ADMIN}>Admin</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
              placeholder="username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gidiBlue text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Secure Offline-First Authentication</p>
          <p>v1.0.0 Stable</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;