import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Check, X } from "lucide-react";
import {useDispatch} from 'react-redux';
import { setLogin } from '../store/loginSlice.js';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const Dispatch=useDispatch(); 
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });


    const responseData = res.data;        
    if (responseData.status===200) {
      Dispatch(setLogin(true));
      navigate('/');
    } else {
      setError("Error in login from Backend.");
    }

  } catch (err) {
  
    const serverMessage = err.response?.data?.message || err.message || 'Login failed';
    setError(serverMessage);
    console.error("Login Error:", err);
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
       <div className="relative">
                 <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                 <div className="relative">
                   <input
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword((prev) => !prev)}
                     className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                   >
                     {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                   </button>
                 </div>
                 
                
               </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors mt-3"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="text-center text-slate-400 text-xs mt-1">
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
