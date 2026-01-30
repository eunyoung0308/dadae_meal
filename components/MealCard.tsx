
import React, { useState } from 'react';
import { MealInfo, ALLERGY_MAP } from '../types';

interface MealCardProps {
  meal: MealInfo;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Clean the dish name string
  const dishes = meal.DDISH_NM.split('<br/>').map(dish => {
    const match = dish.match(/(.+)\s*\(([\d\.]+)\)/);
    if (match) {
      return {
        name: match[1].trim(),
        allergies: match[2].split('.').filter(n => n !== '')
      };
    }
    return { name: dish.trim(), allergies: [] };
  });

  const getMealIcon = (type: string) => {
    switch (type) {
      case '조식': return 'fa-sun';
      case '중식': return 'fa-cloud-sun';
      case '석식': return 'fa-moon';
      default: return 'fa-utensils';
    }
  };

  const getMealColor = (type: string) => {
    switch (type) {
      case '조식': return 'bg-amber-50 text-amber-600 border-amber-200';
      case '중식': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case '석식': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className={`px-6 py-4 flex items-center justify-between border-b ${getMealColor(meal.MMEAL_SC_NM)}`}>
        <div className="flex items-center gap-3">
          <i className={`fas ${getMealIcon(meal.MMEAL_SC_NM)} text-xl`}></i>
          <h3 className="text-xl font-bold">{meal.MMEAL_SC_NM}</h3>
        </div>
        <span className="font-medium px-3 py-1 bg-white/50 rounded-full text-sm">
          {meal.CAL_INFO}
        </span>
      </div>

      <div className="p-6">
        <ul className="space-y-3">
          {dishes.map((dish, idx) => (
            <li key={idx} className="flex flex-wrap items-center gap-2 group">
              <span className="text-slate-800 font-medium group-hover:text-indigo-600 transition-colors">
                {dish.name}
              </span>
              {dish.allergies.length > 0 && (
                <div className="flex gap-1">
                  {dish.allergies.map(a => (
                    <span 
                      key={a} 
                      title={ALLERGY_MAP[a]} 
                      className="inline-block w-5 h-5 text-[10px] leading-5 text-center rounded-full bg-slate-100 text-slate-500 cursor-help hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors"
          >
            {showDetails ? '상세 정보 닫기' : '원산지 및 영양 정보 보기'}
            <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'}`}></i>
          </button>

          {showDetails && (
            <div className="mt-4 space-y-4 animate-fadeIn">
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">원산지 정보</h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {meal.ORPLC_INFO.split('<br/>').join(', ')}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">영양 정보</h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {meal.NTR_INFO.split('<br/>').join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
