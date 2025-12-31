
import React from 'react';
import { Subject, AttendanceMetrics } from '../types';
import { calculateMetrics } from '../utils/logic';
import { Plus, Minus, Trash2, Info } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  target: number;
  onLog: (id: string, type: 'present' | 'absent') => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, target, onLog, onDelete, onViewDetails }) => {
  const metrics = calculateMetrics(subject, target);

  const getStatusColor = () => {
    switch (metrics.status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
              <h3 className="text-lg font-bold text-slate-800 truncate max-w-[150px]">{subject.name}</h3>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {metrics.attended}/{metrics.total} classes attended
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor()}`}>
            {metrics.percentage.toFixed(1)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Safe to Bunk</p>
            <p className={`text-2xl font-black ${metrics.safeToBunk > 0 ? 'text-green-600' : 'text-slate-300'}`}>
              {metrics.safeToBunk}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Must Attend</p>
            <p className={`text-2xl font-black ${metrics.mustAttend > 0 ? 'text-red-600' : 'text-slate-300'}`}>
              {metrics.mustAttend}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onLog(subject.id, 'present')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Present
          </button>
          <button 
            onClick={() => onLog(subject.id, 'absent')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Minus size={18} /> Bunk
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50 px-5 py-2 flex justify-between items-center border-t border-slate-100">
        <button 
          onClick={() => onViewDetails(subject.id)}
          className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"
        >
          <Info size={14} /> History
        </button>
        <button 
          onClick={() => onDelete(subject.id)}
          className="text-slate-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
