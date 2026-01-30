
import React, { useState, useEffect, useCallback } from 'react';
import { fetchMeals } from './services/neisService';
import { MealInfo, ALLERGY_MAP } from './types';
import MealCard from './components/MealCard';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<MealInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getMealData = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMeals(date);
      setMeals(data);
    } catch (err) {
      setError('급식 정보를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMealData(selectedDate);
  }, [selectedDate, getMealData]);

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const getFormattedDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-2xl px-4 py-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-lg mb-4">
          <i className="fas fa-school text-2xl"></i>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">다대고 급식 도우미</h1>
        <p className="text-slate-500 mt-2 font-medium">부산광역시 다대고등학교 급식 정보</p>
      </header>

      {/* Date Selector Wrapper */}
      <div className="sticky top-4 z-20 w-full max-w-2xl px-4 mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-2 flex items-center justify-between">
          <button 
            onClick={() => changeDate(-1)}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            aria-label="Previous Day"
          >
            <i className="fas fa-chevron-left text-lg"></i>
          </button>
          
          <div className="flex flex-col items-center flex-1">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-bold text-slate-900 bg-transparent border-none focus:ring-0 text-center cursor-pointer text-lg"
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest -mt-1">
              {getFormattedDateString(selectedDate).split(' ').pop()}
            </span>
          </div>

          <button 
            onClick={() => changeDate(1)}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            aria-label="Next Day"
          >
            <i className="fas fa-chevron-right text-lg"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-2xl px-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">급식 정보를 가져오는 중입니다...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-600">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-circle text-2xl"></i>
            </div>
            <p className="font-bold text-lg">{error}</p>
            <button 
              onClick={() => getMealData(selectedDate)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : meals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-calendar-xmark text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-slate-600">등록된 급식이 없습니다</h2>
            <p className="text-slate-400 mt-2">일정을 확인하거나 다른 날짜를 선택해보세요.</p>
          </div>
        ) : (
          <div className="animate-fadeIn space-y-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <h2 className="font-bold text-slate-700 text-lg">오늘의 전체 식단</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {meals.length}개의 식단
              </span>
            </div>
            {meals.map((meal) => (
              <MealCard key={`${meal.MLSV_YMD}-${meal.MMEAL_SC_CODE}`} meal={meal} />
            ))}
          </div>
        )}

        {/* Allergy Legend */}
        <div className="mt-8 bg-white/50 rounded-3xl p-6 border border-slate-200">
          <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-indigo-500"></i>
            알레르기 유발 식재료 번호 안내
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
            {Object.entries(ALLERGY_MAP).map(([code, name]) => (
              <div key={code} className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="w-5 h-5 flex-shrink-0 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-indigo-600 shadow-sm">
                  {code}
                </span>
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-10 text-slate-400 text-xs border-t border-slate-200 bg-white">
        <p>&copy; {new Date().getFullYear()} 다대고등학교 급식 정보 서비스</p>
        <p className="mt-1">데이터 출처: 나이스(NEIS) 교육정보 개방 포털</p>
      </footer>

      {/* Styles for animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
