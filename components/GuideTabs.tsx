
import React, { useState } from 'react';
import { ELEMENT_DIRECTION_GUIDE, SPECIAL_TIPS_GUIDE, SAFETY_GUIDE } from '../constants';

const GuideTabs: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const guides = [ELEMENT_DIRECTION_GUIDE, SPECIAL_TIPS_GUIDE, SAFETY_GUIDE];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        {guides.map((guide, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSubTab(idx)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold sinhala-font transition-all ${activeSubTab === idx ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
          >
            {guide.title_si}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-black mb-2 sinhala-font">{guides[activeSubTab].title_si}</h2>
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-10">{guides[activeSubTab].title_en}</p>
        
        <div className="space-y-6">
          {guides[activeSubTab].content.map((item, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {i + 1}
              </div>
              <p className="text-slate-700 dark:text-slate-300 sinhala-font leading-relaxed pt-1">{item}</p>
            </div>
          ))}
        </div>

        {guides[activeSubTab].tips && (
          <div className="mt-12 p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-900/30">
            <h4 className="text-amber-700 dark:text-amber-500 font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.336 16.336l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM16 10a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
              Pro Tips
            </h4>
            <ul className="space-y-3">
              {guides[activeSubTab].tips?.map((tip, i) => (
                <li key={i} className="text-amber-800/80 dark:text-amber-400/80 text-sm sinhala-font">• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideTabs;
