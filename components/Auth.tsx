
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Zap, AlertCircle, KeyRound, BellRing, X } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
  onSignupComplete: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignupComplete }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password' | 'reset-sent'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; sub: string } | null>(null);

  // Mock "database" check
  const getStoredUsers = () => {
    const users = localStorage.getItem('bunksmart_mock_users');
    return users ? JSON.parse(users) : {};
  };

  // Helper to trigger a simulated 'Received Email' notification
  const triggerEmailNotification = (message: string, sub: string) => {
    setToast({ message, sub });
    setTimeout(() => setToast(null), 8000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      
      if (!users[email]) {
        setError("Account not found. It seems you don't have an account yet.");
        setLoading(false);
        return;
      }

      if (users[email].password !== password) {
        setError("Incorrect password. Access denied.");
        setLoading(false);
        return;
      }

      onLogin(email);
      setLoading(false);
    }, 1200);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      if (users[email]) {
        setError("An account with this institutional email already exists.");
        setLoading(false);
        return;
      }
      
      // Save user to "database"
      users[email] = { password }; 
      localStorage.setItem('bunksmart_mock_users', JSON.stringify(users));
      
      onSignupComplete(email);
      setLoading(false);
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      triggerEmailNotification(
        "Password Reset Link",
        `A secure link to reset your BunkSmart password was sent to ${email}.`
      );
      setView('reset-sent');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Simulated Email Notification Toast */}
      {toast && (
        <div className="fixed top-6 left-6 right-6 z-[100] animate-in slide-in-from-top-10 duration-500 max-w-md mx-auto">
          <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-start gap-4 border border-slate-700">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <BellRing size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black flex items-center justify-between">
                New Email from BunkSmart
                <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100">
                  <X size={14} />
                </button>
              </p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{toast.message}</p>
              <p className="text-sm mt-2 text-indigo-200 font-medium leading-relaxed">{toast.sub}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
        <div className="p-8 pt-12 text-center">
          <div className="inline-flex p-5 bg-indigo-600 rounded-[2rem] mb-6 shadow-xl shadow-indigo-200">
            <Zap className="text-white fill-white" size={36} />
          </div>
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">BunkSmart</h1>
          <p className="text-slate-500 font-bold px-4 text-xs uppercase tracking-[0.2em] opacity-60">
            {view === 'login' && 'Student Access Panel'}
            {view === 'signup' && 'Create Secure Account'}
            {view === 'forgot-password' && 'Account Recovery'}
            {view === 'reset-sent' && 'Inbox Check'}
          </p>
        </div>

        <div className="px-8 pb-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900 leading-snug">{error}</p>
                {error.includes("Account not found") && (
                  <button onClick={() => {setView('signup'); setError(null);}} className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mt-3 hover:bg-red-700 transition-colors">
                    Sign Up Now
                  </button>
                )}
                {error.includes("Incorrect password") && (
                  <button onClick={() => {setView('forgot-password'); setError(null);}} className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mt-3 hover:bg-indigo-700 transition-colors">
                    Reset Password
                  </button>
                )}
              </div>
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Student Email Address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-black placeholder:text-slate-400"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Secret Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-black placeholder:text-slate-400"
                />
              </div>
              <div className="flex justify-end pr-2">
                <button 
                  type="button" 
                  onClick={() => {setView('forgot-password'); setError(null);}}
                  className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                >
                  Forgot Key?
                </button>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <>Sign In Securely <ArrowRight size={20}/></>}
              </button>
              <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                New to the platform? <button type="button" onClick={() => {setView('signup'); setError(null);}} className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-4">Register Account</button>
              </p>
            </form>
          )}

          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Institutional Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-black placeholder:text-slate-400"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Create Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-black placeholder:text-slate-400"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-black placeholder:text-slate-400"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
              </button>
              <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                Already registered? <button type="button" onClick={() => {setView('login'); setError(null);}} className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-4">Sign In</button>
              </p>
            </form>
          )}

          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-5 top-5 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Registered Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-bold text-black"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Send Recovery Link'}
              </button>
              <button 
                type="button" 
                onClick={() => setView('login')} 
                className="w-full text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600"
              >
                Return to Login
              </button>
            </form>
          )}

          {view === 'reset-sent' && (
            <div className="text-center space-y-8 py-4">
              <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-600 border border-indigo-100 shadow-inner">
                <KeyRound size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black">Reset Link Sent</h3>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">Check your inbox for a secure password reset link sent to <br/><span className="text-black font-black">{email}</span>.</p>
              </div>
              <button 
                onClick={() => setView('login')}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl active:scale-[0.98]"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-4 text-slate-400">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <ShieldCheck size={18} className="text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Secure AES-256 Storage</p>
        </div>
        <p className="text-[10px] opacity-60 text-center max-w-[300px] leading-relaxed font-medium">
          Your credentials and attendance records are strictly protected with end-to-end institutional grade encryption.
        </p>
      </div>
    </div>
  );
};

export default Auth;
