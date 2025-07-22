
import { SurahDetail } from '../types';

const API_BASE_URL = 'https://equran.id/api/v2';
const surahDetailCache: { [key: number]: SurahDetail } = {};

export const fetchSurahDetail = async (surahNumber: number): Promise<SurahDetail | null> => {
  if (surahDetailCache[surahNumber]) {
    return surahDetailCache[surahNumber];
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/surat/${surahNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message || 'Failed to fetch Surah detail');
    }
    const surahData: SurahDetail = result.data;
    surahDetailCache[surahNumber] = surahData;
    return surahData;
  } catch (error) {
    console.error(`Gagal mengambil data untuk surah ${surahNumber}:`, error);
    return null;
  }
};
