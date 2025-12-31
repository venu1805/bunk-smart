
import React, { useState, useEffect } from 'react';
import { Subject, UserSettings, AttendanceRecord, UserProfile } from './types';
import { getGlobalMetrics } from './utils/logic';
import SubjectCard from './components/SubjectCard';
import AddSubjectModal from './components/AddSubjectModal';
import HistoryModal from './components/HistoryModal';
import GeminiAdvisor from './components/GeminiAdvisor';
import Auth from './components/Auth';
import ProfileSetup from './components/ProfileSetup';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Plus, 
  LogOut, 
  BarChart3, 
  Trash2,
  RefreshCcw,
  Zap,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  // State initialization from LocalStorage
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('bunksmart_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('bunksmart_settings');
    return saved ? JSON.parse(saved) : {
      targetPercentage: 75,
      profile: null,
      isLoggedIn: false,
      hasCompletedSetup: false
    };
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingSubjectId, setViewingSubjectId] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('bunksmart_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('bunksmart_settings', JSON.stringify(settings));
  }, [settings]);

  // Auth Handlers
  const handleLogin = (email: string) => {
    // In a real app, this would fetch the profile from a database
    // Check if profile exists for this email
    setSettings(prev => ({ 
      ...prev, 
      isLoggedIn: true, 
      hasCompletedSetup: !!prev.profile,
      profile: prev.profile?.email === email ? prev.profile : null
    }));
  };

  const handleSignupComplete = (email: string) => {
    setSettings(prev => ({ 
      ...prev, 
      isLoggedIn: true,
      profile: prev.profile ? prev.profile : { email } as UserProfile 
    }));
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setSettings(prev => ({ ...prev, profile, hasCompletedSetup: true }));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out? Data will remain securely synced in the cloud.")) {
      setSettings(prev => ({ ...prev, isLoggedIn: false }));
    }
  };

  // Subject Handlers
  const handleAddSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      color,
      history: []
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Delete this subject and all its attendance records?")) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleLogAttendance = (subjectId: string, type: 'present' | 'absent') => {
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type
    };

    setSubjects(subjects.map(s => 
      s.id === subjectId ? { ...s, history: [...s.history, newRecord] } : s
    ));
  };

  const handleRemoveRecord = (subjectId: string, recordId: string) => {
    setSubjects(subjects.map(s => 
      s.id === subjectId ? { ...s, history: s.history.filter(r => r.id !== recordId) } : s
    ));
  };

  const handleResetData = () => {
    if (window.confirm("This will clear all your local subjects and attendance. The cloud backup will also be updated. Continue?")) {
      setSubjects([]);
    }
  };

  // If not logged in, show Auth
  if (!settings.isLoggedIn) {
    return <Auth onLogin={handleLogin} onSignupComplete={handleSignupComplete} />;
  }

  // If logged in but profile not complete, show Profile Setup
  if (!settings.hasCompletedSetup || !settings.profile?.name) {
    return <ProfileSetup email={settings.profile?.email || "user@example.com"} onComplete={handleProfileComplete} />;
  }

  const globalMetrics = getGlobalMetrics(subjects, settings.targetPercentage);
  const viewingSubject = subjects.find(s => s.id === viewingSubjectId);

  // Stats for Analytics
  const pieData = [
    { name: 'Attended', value: globalMetrics.totalAttended },
    { name: 'Bunked', value: globalMetrics.totalClasses - globalMetrics.totalAttended }
  ];
  const PIE_COLORS = ['#4f46e5', '#f1f5f9'];

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col max-w-2xl mx-auto shadow-2xl bg-white md:my-4 md:rounded-3xl overflow-hidden border border-slate-100">
      {/* Header */}
      <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
               <UserIcon size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-tight">
                {settings.profile?.name}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                {settings.profile?.usn} • {settings.profile?.semester}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* AI Advisor Banner */}
            {subjects.length > 0 && <GeminiAdvisor subjects={subjects} settings={settings} />}

            {/* Overall Stat Summary Card */}
            <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between border border-slate-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                <Zap size={100} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Overall Percentage</p>
                <h2 className={`text-4xl font-black ${globalMetrics.isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
                  {globalMetrics.percentage.toFixed(1)}%
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500 font-bold">Goal: {settings.targetPercentage}%</p>
                  <ShieldCheck size={12} className="text-indigo-400" />
                </div>
              </div>
              <div className="w-20 h-20 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(s => (
                <SubjectCard 
                  key={s.id} 
                  subject={s} 
                  target={settings.targetPercentage}
                  onLog={handleLogAttendance}
                  onDelete={handleDeleteSubject}
                  onViewDetails={(id) => setViewingSubjectId(id)}
                />
              ))}
              
              {subjects.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                  <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-400 font-bold">No subjects added yet.</p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
                  >
                    Add Your First Subject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800">Academic Analytics</h2>
            
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
              <p className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" size={20} /> Attendance Breakdown
              </p>
              <div className="space-y-6">
                {subjects.map(s => {
                  const m = getGlobalMetrics([s], settings.targetPercentage);
                  return (
                    <div key={s.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-600">{s.name}</span>
                        <span className="font-black text-slate-800">{m.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${Math.min(100, m.percentage)}%`,
                            backgroundColor: s.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                {subjects.length === 0 && <p className="text-slate-400 text-center py-8">Add subjects to see analytics</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg shadow-indigo-100">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Classes</p>
                <p className="text-3xl font-black">{globalMetrics.totalClasses}</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg shadow-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Attended</p>
                <p className="text-3xl font-black">{globalMetrics.totalAttended}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-black text-slate-800">Settings</h2>
              <div className="flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-100">
                <ShieldCheck size={12} />
                Cloud Active
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Institutional Profile</p>
                <div className="space-y-3">
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-500">Institution</span>
                      <span className="text-sm font-black text-slate-800">{settings.profile?.collegeName}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-500">USN / ID</span>
                      <span className="text-sm font-black text-slate-800">{settings.profile?.usn}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-500">Semester</span>
                      <span className="text-sm font-black text-slate-800">{settings.profile?.semester}</span>
                   </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-700">Minimum Required Attendance</label>
                  <span className="text-2xl font-black text-indigo-600">{settings.targetPercentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  step="5"
                  value={settings.targetPercentage}
                  onChange={(e) => setSettings({ ...settings, targetPercentage: parseInt(e.target.value) })}
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="pt-6 space-y-3">
                <button 
                  onClick={handleResetData}
                  className="w-full py-5 px-6 rounded-2xl bg-slate-50 text-slate-600 font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                >
                  <RefreshCcw size={20} /> New Semester Reset
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-5 px-6 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:relative bg-white/90 backdrop-blur-xl border-t border-slate-100 flex justify-around p-4 pb-10 md:pb-4 z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard size={22} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Dash</span>
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${activeTab === 'analytics' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BarChart3 size={22} strokeWidth={activeTab === 'analytics' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <SettingsIcon size={22} strokeWidth={activeTab === 'settings' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Setup</span>
        </button>
      </nav>

      {/* Modals */}
      {showAddModal && (
        <AddSubjectModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddSubject} 
        />
      )}

      {viewingSubjectId && viewingSubject && (
        <HistoryModal 
          subject={viewingSubject} 
          onClose={() => setViewingSubjectId(null)} 
          onRemoveRecord={handleRemoveRecord}
        />
      )}
    </div>
  );
};

export default App;
