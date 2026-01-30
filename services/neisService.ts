
import { NeisApiResponse, MealInfo } from '../types';
import { API_KEY, OFFICE_CODE, SCHOOL_CODE, BASE_URL } from '../constants';

export const fetchMeals = async (date: string): Promise<MealInfo[]> => {
  const params = new URLSearchParams({
    KEY: API_KEY,
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: OFFICE_CODE,
    SD_SCHUL_CODE: SCHOOL_CODE,
    MLSV_YMD: date.replace(/-/g, ''), // YYYYMMDD format
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    const data: NeisApiResponse = await response.json();

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]) {
      return data.mealServiceDietInfo[1].row;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    throw error;
  }
};
