
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Subject, UserSettings } from '../types';
import { calculateMetrics } from '../utils/logic';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';

interface GeminiAdvisorProps {
  subjects: Subject[];
  settings: UserSettings;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ subjects, settings }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const subjectData = subjects.map(s => {
        const m = calculateMetrics(s, settings.targetPercentage);
        return {
          name: s.name,
          percentage: m.percentage.toFixed(1),
          safeToBunk: m.safeToBunk,
          mustAttend: m.mustAttend,
          total: m.total
        };
      });

      const prompt = `Act as a "Bunking Consultant" for a student. 
      Their target attendance is ${settings.targetPercentage}%.
      Here is their current attendance data:
      ${JSON.stringify(subjectData, null, 2)}
      
      Provide a short, witty, and motivating analysis (max 100 words). 
      Tell them which subjects they can afford to relax in and where they are in "danger zone". 
      Be supportive but honest about their academic risks. Use emojis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || "Failed to generate advice.");
    } catch (error) {
      console.error(error);
      setAdvice("Looks like the AI is taking a bunk too! Try again later. 😅");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
        <BrainCircuit size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-indigo-200" size={20} />
          <h2 className="text-xl font-bold">BunkSmart AI Advisor</h2>
        </div>
        
        {advice ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-indigo-50 leading-relaxed mb-4">{advice}</p>
            <button 
              onClick={getAdvice}
              className="text-xs font-bold uppercase tracking-widest text-indigo-200 hover:text-white transition-colors"
            >
              Refresh Analysis
            </button>
          </div>
        ) : (
          <div>
            <p className="text-indigo-100 mb-6">Want to know if you can skip that 8 AM lecture tomorrow? Let Gemini analyze your trends.</p>
            <button 
              onClick={getAdvice}
              disabled={loading}
              className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Analyze My Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAdvisor;
