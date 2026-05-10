import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axious from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axious.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      const data = await res.data;
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // Save token and user info as needed
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center gradient-text">Login</h2>
        {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-slate-300 mb-1 text-sm">Email</label>
          <input
            type="email"
            placeholder='example@gmail.com'
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-slate-300 mb-1 text-sm">Password</label>
          <input
            type="password"
            placeholder='********'
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors mb-3"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="text-center text-slate-400 text-xs">
          Don't have an account?{' '}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate('/onboarding')}
          >
            Sign up
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
