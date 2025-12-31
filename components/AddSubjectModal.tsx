
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddSubjectModalProps {
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
}

const COLORS = [
  '#4f46e5', '#10b981', '#f59e0b', '#ef4444', 
  '#06b6d4', '#8b5cf6', '#ec4899', '#f97316'
];

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, color);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800">Add New Subject</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subject Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Data Structures"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Identify Color</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 ${color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-100"
            >
              Add Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
