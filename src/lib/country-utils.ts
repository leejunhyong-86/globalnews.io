import { CountryCoordinates } from '@/types/news';

// 주요 국가의 좌표 데이터
export const COUNTRY_COORDINATES: Record<string, CountryCoordinates> = {
  // 아시아
  '대한민국': { name: '대한민국', code: 'KR', lat: 37.5665, lng: 126.9780 },
  '한국': { name: '대한민국', code: 'KR', lat: 37.5665, lng: 126.9780 },
  '일본': { name: '일본', code: 'JP', lat: 35.6762, lng: 139.6503 },
  '중국': { name: '중국', code: 'CN', lat: 39.9042, lng: 116.4074 },
  '대만': { name: '대만', code: 'TW', lat: 25.0330, lng: 121.5654 },
  '홍콩': { name: '홍콩', code: 'HK', lat: 22.3193, lng: 114.1694 },
  '인도': { name: '인도', code: 'IN', lat: 28.6139, lng: 77.2090 },
  '싱가포르': { name: '싱가포르', code: 'SG', lat: 1.3521, lng: 103.8198 },
  '베트남': { name: '베트남', code: 'VN', lat: 21.0285, lng: 105.8542 },
  '태국': { name: '태국', code: 'TH', lat: 13.7563, lng: 100.5018 },
  '인도네시아': { name: '인도네시아', code: 'ID', lat: -6.2088, lng: 106.8456 },
  '말레이시아': { name: '말레이시아', code: 'MY', lat: 3.1390, lng: 101.6869 },
  '필리핀': { name: '필리핀', code: 'PH', lat: 14.5995, lng: 120.9842 },

  // 북미
  '미국': { name: '미국', code: 'US', lat: 38.9072, lng: -77.0369 },
  '캐나다': { name: '캐나다', code: 'CA', lat: 45.4215, lng: -75.6972 },
  '멕시코': { name: '멕시코', code: 'MX', lat: 19.4326, lng: -99.1332 },

  // 유럽
  '영국': { name: '영국', code: 'GB', lat: 51.5074, lng: -0.1278 },
  '프랑스': { name: '프랑스', code: 'FR', lat: 48.8566, lng: 2.3522 },
  '독일': { name: '독일', code: 'DE', lat: 52.5200, lng: 13.4050 },
  '이탈리아': { name: '이탈리아', code: 'IT', lat: 41.9028, lng: 12.4964 },
  '스페인': { name: '스페인', code: 'ES', lat: 40.4168, lng: -3.7038 },
  '네덜란드': { name: '네덜란드', code: 'NL', lat: 52.3676, lng: 4.9041 },
  '벨기에': { name: '벨기에', code: 'BE', lat: 50.8503, lng: 4.3517 },
  '스위스': { name: '스위스', code: 'CH', lat: 46.9480, lng: 7.4474 },
  '오스트리아': { name: '오스트리아', code: 'AT', lat: 48.2082, lng: 16.3738 },
  '폴란드': { name: '폴란드', code: 'PL', lat: 52.2297, lng: 21.0122 },
  '체코': { name: '체코', code: 'CZ', lat: 50.0755, lng: 14.4378 },
  '스웨덴': { name: '스웨덴', code: 'SE', lat: 59.3293, lng: 18.0686 },
  '노르웨이': { name: '노르웨이', code: 'NO', lat: 59.9139, lng: 10.7522 },
  '덴마크': { name: '덴마크', code: 'DK', lat: 55.6761, lng: 12.5683 },
  '핀란드': { name: '핀란드', code: 'FI', lat: 60.1699, lng: 24.9384 },
  '아일랜드': { name: '아일랜드', code: 'IE', lat: 53.3498, lng: -6.2603 },
  '포르투갈': { name: '포르투갈', code: 'PT', lat: 38.7223, lng: -9.1393 },
  '그리스': { name: '그리스', code: 'GR', lat: 37.9838, lng: 23.7275 },
  '러시아': { name: '러시아', code: 'RU', lat: 55.7558, lng: 37.6173 },
  '우크라이나': { name: '우크라이나', code: 'UA', lat: 50.4501, lng: 30.5234 },
  '터키': { name: '터키', code: 'TR', lat: 41.0082, lng: 28.9784 },

  // 중동
  '이스라엘': { name: '이스라엘', code: 'IL', lat: 31.7683, lng: 35.2137 },
  '이란': { name: '이란', code: 'IR', lat: 35.6892, lng: 51.3890 },
  '사우디아라비아': { name: '사우디아라비아', code: 'SA', lat: 24.7136, lng: 46.6753 },
  'UAE': { name: 'UAE', code: 'AE', lat: 25.2048, lng: 55.2708 },
  '아랍에미리트': { name: 'UAE', code: 'AE', lat: 25.2048, lng: 55.2708 },
  '카타르': { name: '카타르', code: 'QA', lat: 25.2854, lng: 51.5310 },
  '이라크': { name: '이라크', code: 'IQ', lat: 33.3152, lng: 44.3661 },
  '시리아': { name: '시리아', code: 'SY', lat: 33.5138, lng: 36.2765 },

  // 오세아니아
  '호주': { name: '호주', code: 'AU', lat: -33.8688, lng: 151.2093 },
  '뉴질랜드': { name: '뉴질랜드', code: 'NZ', lat: -41.2865, lng: 174.7762 },

  // 남미
  '브라질': { name: '브라질', code: 'BR', lat: -23.5505, lng: -46.6333 },
  '아르헨티나': { name: '아르헨티나', code: 'AR', lat: -34.6037, lng: -58.3816 },
  '칠레': { name: '칠레', code: 'CL', lat: -33.4489, lng: -70.6693 },
  '콜롬비아': { name: '콜롬비아', code: 'CO', lat: 4.7110, lng: -74.0721 },
  '페루': { name: '페루', code: 'PE', lat: -12.0464, lng: -77.0428 },
  '베네수엘라': { name: '베네수엘라', code: 'VE', lat: 10.4806, lng: -66.9036 },

  // 아프리카
  '남아프리카공화국': { name: '남아프리카공화국', code: 'ZA', lat: -33.9249, lng: 18.4241 },
  '이집트': { name: '이집트', code: 'EG', lat: 30.0444, lng: 31.2357 },
  '나이지리아': { name: '나이지리아', code: 'NG', lat: 6.5244, lng: 3.3792 },
  '케냐': { name: '케냐', code: 'KE', lat: -1.2921, lng: 36.8219 },
  '모로코': { name: '모로코', code: 'MA', lat: 33.9716, lng: -6.8498 },
  '에티오피아': { name: '에티오피아', code: 'ET', lat: 9.0320, lng: 38.7469 },

  // 전세계/글로벌
  '전세계': { name: '전세계', code: 'GLOBAL', lat: 0, lng: 0 },
  '글로벌': { name: '전세계', code: 'GLOBAL', lat: 0, lng: 0 },
};

// 뉴스 출처에서 국가 추정
export const SOURCE_COUNTRY_MAP: Record<string, string> = {
  'CNN': '미국',
  'BBC': '영국',
  'BBC News': '영국',
  'New York Times': '미국',
  'NYT': '미국',
  '네이버': '대한민국',
  '네이버 정치': '대한민국',
  '네이버 경제': '대한민국',
  '네이버 IT/과학': '대한민국',
  '연합뉴스': '대한민국',
  'Reuters': '영국',
  'AP': '미국',
  'AFP': '프랑스',
  'NHK': '일본',
  '신화통신': '중국',
  'Al Jazeera': '카타르',
  'DW': '독일',
  'France24': '프랑스',
  'RT': '러시아',
};

// 국가명에서 좌표 가져오기
export function getCountryCoordinates(countryName: string): CountryCoordinates | null {
  return COUNTRY_COORDINATES[countryName] || null;
}

// 출처에서 국가 추정
export function getCountryFromSource(source: string): string {
  return SOURCE_COUNTRY_MAP[source] || '전세계';
}

// 위경도를 Three.js 3D 좌표로 변환 (구체 표면)
export function latLngToVector3(lat: number, lng: number, radius: number = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
}

// 위경도를 2D 평면 좌표로 변환 (Mercator 투영)
export function latLngTo2D(lat: number, lng: number, width: number, height: number): { x: number; y: number } {
  const x = (lng + 180) * (width / 360);
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (height / 2) - (width * mercN / (2 * Math.PI));
  
  return { x, y };
}

// 뉴스에 국가 정보가 없을 경우 출처에서 추정
export function assignCountryToNews(news: { country?: string; source?: string }): string {
  if (news.country && news.country !== '전세계') {
    return news.country;
  }
  if (news.source) {
    return getCountryFromSource(news.source);
  }
  return '전세계';
}

