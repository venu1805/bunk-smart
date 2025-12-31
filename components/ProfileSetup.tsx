
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Hash, GraduationCap, School, Check, ArrowRight } from 'lucide-react';

interface ProfileSetupProps {
  email: string;
  onComplete: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ email, onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    usn: '',
    semester: '',
    collegeName: '',
    email: email
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="w-16 h-2 bg-slate-100 rounded-full mx-auto mb-8 flex overflow-hidden">
            <div 
              className="bg-indigo-600 transition-all duration-500" 
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
          <h2 className="text-3xl font-black text-slate-800">Final Step!</h2>
          <p className="text-slate-500 mt-2">Personalize your BunkSmart profile to start tracking accurately.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name" 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="relative">
                  <Hash className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="USN / Roll Number" 
                    value={profile.usn}
                    onChange={e => setProfile({...profile, usn: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
              <button 
                type="button"
                disabled={!profile.name || !profile.usn}
                onClick={nextStep}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                Next Step <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-4 text-slate-400" size={20} />
                  <select 
                    required
                    value={profile.semester}
                    onChange={e => setProfile({...profile, semester: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold appearance-none text-slate-900"
                  >
                    <option value="" disabled>Select Semester</option>
                    {[1,2,3,4,5,6,7,8].map(s => (
                      <option key={s} value={`${s}th Semester`}>{s}th Semester</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <School className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="College Name" 
                    value={profile.collegeName}
                    onChange={e => setProfile({...profile, collegeName: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={!profile.semester || !profile.collegeName}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  Finish <Check size={20} />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
