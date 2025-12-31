
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Zap } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
  onSignupComplete: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignupComplete }) => {
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(email);
      setLoading(false);
    }, 1500);
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setView('otp');
      setLoading(false);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      onSignupComplete(email);
      setLoading(false);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden">
        <div className="p-8 pt-12 text-center">
          <div className="inline-flex p-4 bg-indigo-600 rounded-3xl mb-6 shadow-lg shadow-indigo-200">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">BunkSmart</h1>
          <p className="text-slate-500 font-medium">
            {view === 'login' ? 'Welcome back! Log in to sync data.' : 
             view === 'signup' ? 'Create your smart tracker account.' : 
             'Verify your email address.'}
          </p>
        </div>

        <div className="px-8 pb-12">
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Log In'}
              </button>
              <p className="text-center text-sm text-slate-500 mt-4">
                New here? <button type="button" onClick={() => setView('signup')} className="text-indigo-600 font-bold hover:underline">Create Account</button>
              </p>
            </form>
          )}

          {view === 'signup' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Send OTP Code'}
              </button>
              <p className="text-center text-sm text-slate-500 mt-4">
                Already have an account? <button type="button" onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">Log In</button>
              </p>
            </form>
          )}

          {view === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 bg-slate-50 rounded-xl border border-slate-100 text-center text-xl font-black text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Check your email</p>
                <p className="text-sm text-slate-500">We've sent a 6-digit code to <span className="text-slate-800 font-bold">{email}</span></p>
              </div>
              <button 
                type="submit"
                disabled={loading || otp.some(d => !d)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Verify & Continue'}
              </button>
              <button 
                type="button" 
                onClick={() => setView('signup')} 
                className="w-full text-slate-400 font-bold text-sm hover:text-slate-600"
              >
                Change Email
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-400">
        <ShieldCheck size={16} />
        <p className="text-xs font-medium">Secured with end-to-end encryption</p>
      </div>
    </div>
  );
};

export default Auth;
