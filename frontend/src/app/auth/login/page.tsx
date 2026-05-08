'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('storage'));
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl shadow-2xl border border-indigo-500/20 backdrop-blur-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Login to manage your saved colleges.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-indigo-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-xl py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-400">
        Don't have an account? <Link href="/auth/signup" className="text-indigo-600 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
