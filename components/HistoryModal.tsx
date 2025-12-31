
import React from 'react';
import { Subject } from '../types';
import { X, Calendar, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

interface HistoryModalProps {
  subject: Subject;
  onClose: () => void;
  onRemoveRecord: (subjectId: string, recordId: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ subject, onClose, onRemoveRecord }) => {
  const sortedHistory = [...subject.history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-800">{subject.name}</h2>
              <p className="text-sm text-slate-500">Attendance History</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No records yet</p>
            </div>
          ) : (
            sortedHistory.map(record => (
              <div key={record.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${record.type === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {record.type === 'present' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{record.type === 'present' ? 'Present' : 'Bunked'}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(record.timestamp).toLocaleDateString()} at {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveRecord(subject.id, record.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
