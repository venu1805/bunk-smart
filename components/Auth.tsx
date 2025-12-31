
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Zap, AlertCircle, RefreshCw, KeyRound, Info } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
  onSignupComplete: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignupComplete }) => {
  const [view, setView] = useState<'login' | 'signup' | 'otp' | 'forgot-password' | 'reset-sent'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  // Mock "database" check
  const getStoredUsers = () => {
    const users = localStorage.getItem('bunksmart_mock_users');
    return users ? JSON.parse(users) : {};
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      
      if (!users[email]) {
        setError("Account not found. We couldn't find a student with this ID.");
        setLoading(false);
        return;
      }

      if (users[email].password !== password) {
        setError("Incorrect password. Access denied for security reasons.");
        setLoading(false);
        return;
      }

      onLogin(email);
      setLoading(false);
    }, 1200);
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      if (users[email]) {
        setError("An account with this institutional email already exists.");
        setLoading(false);
        return;
      }
      setDemoHint("DEMO MODE: Your OTP code is 123456");
      setView('otp');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    // For demo purposes, we accept '123456' or any code if demoHint is visible
    if (enteredOtp !== '123456') {
      setError("Invalid verification code. Please check your email again.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getStoredUsers();
      // Default password for new users in this simulation
      users[email] = { password: 'password123' }; 
      localStorage.setItem('bunksmart_mock_users', JSON.stringify(users));
      
      onSignupComplete(email);
      setLoading(false);
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setView('reset-sent');
      setLoading(false);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
        <div className="p-8 pt-12 text-center">
          <div className="inline-flex p-4 bg-indigo-600 rounded-3xl mb-6 shadow-xl shadow-indigo-200">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">BunkSmart</h1>
          <p className="text-slate-500 font-medium px-4 text-sm">
            {view === 'login' && 'Secure Student Attendance Gateway'}
            {view === 'signup' && 'Create Your Encrypted Account'}
            {view === 'otp' && 'Verify Your Identity'}
            {view === 'forgot-password' && 'Recover Account Access'}
            {view === 'reset-sent' && 'Check Your Inbox'}
          </p>
        </div>

        <div className="px-8 pb-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700">{error}</p>
                {error.includes("Account not found") && (
                  <button onClick={() => {setView('signup'); setError(null);}} className="text-xs font-black uppercase tracking-widest text-indigo-600 mt-2 hover:underline block">Sign Up Instead</button>
                )}
                {error.includes("Incorrect password") && (
                  <button onClick={() => {setView('forgot-password'); setError(null);}} className="text-xs font-black uppercase tracking-widest text-indigo-600 mt-2 hover:underline block">Reset Password</button>
                )}
              </div>
            </div>
          )}

          {demoHint && view === 'otp' && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in">
              <Info className="text-indigo-600 shrink-0" size={18} />
              <p className="text-xs font-bold text-indigo-700">{demoHint}</p>
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Student Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => {setView('forgot-password'); setError(null);}}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Sign In Securely'}
              </button>
              <p className="text-center text-sm text-slate-500 mt-6">
                New to BunkSmart? <button type="button" onClick={() => {setView('signup'); setError(null);}} className="text-indigo-600 font-bold hover:underline">Create Account</button>
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
                  placeholder="Institutional Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Send OTP Code'}
              </button>
              <p className="text-center text-sm text-slate-500 mt-6">
                Already registered? <button type="button" onClick={() => {setView('login'); setError(null);}} className="text-indigo-600 font-bold hover:underline">Log In</button>
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
                    required
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 bg-slate-50 rounded-xl border border-slate-100 text-center text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">Check Your Email</p>
                <p className="text-sm text-slate-500">Security code sent to <span className="text-slate-800 font-bold">{email}</span></p>
              </div>
              <button 
                type="submit"
                disabled={loading || otp.some(d => !d)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Verify & Continue'}
              </button>
              <button 
                type="button" 
                onClick={() => {setView('signup'); setDemoHint(null);}} 
                className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                Change Email Address
              </button>
            </form>
          )}

          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Your Registered Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Email Recovery Link'}
              </button>
              <button 
                type="button" 
                onClick={() => setView('login')} 
                className="w-full text-slate-400 font-bold text-sm hover:text-slate-600"
              >
                Return to Login
              </button>
            </form>
          )}

          {view === 'reset-sent' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
                <KeyRound size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Check Your Inbox</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">We've sent a secure password reset link to <span className="text-slate-800 font-bold">{email}</span>. The link will expire in 15 minutes.</p>
              </div>
              <button 
                onClick={() => setView('login')}
                className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-3 text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-400" />
          <p className="text-[10px] font-black uppercase tracking-widest">Encrypted Cloud Storage</p>
        </div>
        <p className="text-[10px] opacity-60 text-center max-w-[280px] leading-relaxed">
          BunkSmart uses industry-standard encryption for all student records. Your data is strictly private.
        </p>
      </div>
    </div>
  );
};

export default Auth;
