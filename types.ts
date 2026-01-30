
export interface MealInfo {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
  ATPT_OFCDC_SC_NM: string;   // 시도교육청명
  SD_SCHUL_CODE: string;      // 행정표준코드
  SCHUL_NM: string;           // 학교명
  MMEAL_SC_CODE: string;      // 식사코드 (1: 조식, 2: 중식, 3: 석식)
  MMEAL_SC_NM: string;        // 식사명
  MLSV_YMD: string;           // 급식일자
  MLSV_FGR: string;           // 급식인원수
  DDISH_NM: string;           // 요리명
  ORPLC_INFO: string;         // 원산지정보
  CAL_INFO: string;           // 칼로리정보
  NTR_INFO: string;           // 영양정보
}

export interface NeisApiResponse {
  mealServiceDietInfo?: [
    { head: any[] },
    { row: MealInfo[] }
  ];
  RESULT?: {
    CODE: string;
    MESSAGE: string;
  };
}

export enum MealType {
  BREAKFAST = '1',
  LUNCH = '2',
  DINNER = '3'
}

export const ALLERGY_MAP: Record<string, string> = {
  "1": "난류", "2": "우유", "3": "메밀", "4": "땅콩", "5": "대두", "6": "밀",
  "7": "고등어", "8": "게", "9": "새우", "10": "돼지고기", "11": "복숭아",
  "12": "토마토", "13": "아황산류", "14": "호두", "15": "닭고기", "16": "쇠고기",
  "17": "오징어", "18": "조개류(굴,전복,홍합 포함)", "19": "잣"
};
