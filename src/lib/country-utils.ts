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

// 지역 좌표 타입
interface RegionCoordinates {
  lat: number;
  lng: number;
  name: string;
}

// 미국 주요 주/도시 좌표 (지역별 상세 표시용)
export const US_REGIONS: Record<string, RegionCoordinates> = {
  // 주요 주
  'California': { lat: 36.7783, lng: -119.4179, name: '캘리포니아' },
  'Texas': { lat: 31.9686, lng: -99.9018, name: '텍사스' },
  'Florida': { lat: 27.6648, lng: -81.5158, name: '플로리다' },
  'New York': { lat: 40.7128, lng: -74.0060, name: '뉴욕' },
  'Illinois': { lat: 40.6331, lng: -89.3985, name: '일리노이' },
  'Pennsylvania': { lat: 41.2033, lng: -77.1945, name: '펜실베이니아' },
  'Ohio': { lat: 40.4173, lng: -82.9071, name: '오하이오' },
  'Georgia': { lat: 32.1656, lng: -82.9001, name: '조지아' },
  'Michigan': { lat: 44.3148, lng: -85.6024, name: '미시간' },
  'Washington': { lat: 47.7511, lng: -120.7401, name: '워싱턴' },
  'Arizona': { lat: 34.0489, lng: -111.0937, name: '애리조나' },
  'Massachusetts': { lat: 42.4072, lng: -71.3824, name: '매사추세츠' },
  'Colorado': { lat: 39.5501, lng: -105.7821, name: '콜로라도' },
  'Virginia': { lat: 37.4316, lng: -78.6569, name: '버지니아' },
  'Nevada': { lat: 38.8026, lng: -116.4194, name: '네바다' },
  
  // 주요 도시
  'New York City': { lat: 40.7128, lng: -74.0060, name: '뉴욕시' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, name: '로스앤젤레스' },
  'Chicago': { lat: 41.8781, lng: -87.6298, name: '시카고' },
  'Houston': { lat: 29.7604, lng: -95.3698, name: '휴스턴' },
  'Phoenix': { lat: 33.4484, lng: -112.0740, name: '피닉스' },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, name: '필라델피아' },
  'San Antonio': { lat: 29.4241, lng: -98.4936, name: '샌안토니오' },
  'San Diego': { lat: 32.7157, lng: -117.1611, name: '샌디에이고' },
  'Dallas': { lat: 32.7767, lng: -96.7970, name: '댈러스' },
  'San Jose': { lat: 37.3382, lng: -121.8863, name: '산호세' },
  'Austin': { lat: 30.2672, lng: -97.7431, name: '오스틴' },
  'San Francisco': { lat: 37.7749, lng: -122.4194, name: '샌프란시스코' },
  'Seattle': { lat: 47.6062, lng: -122.3321, name: '시애틀' },
  'Denver': { lat: 39.7392, lng: -104.9903, name: '덴버' },
  'Boston': { lat: 42.3601, lng: -71.0589, name: '보스턴' },
  'Miami': { lat: 25.7617, lng: -80.1918, name: '마이애미' },
  'Atlanta': { lat: 33.7490, lng: -84.3880, name: '애틀랜타' },
  'Las Vegas': { lat: 36.1699, lng: -115.1398, name: '라스베이거스' },
  'Detroit': { lat: 42.3314, lng: -83.0458, name: '디트로이트' },
  'Portland': { lat: 45.5152, lng: -122.6784, name: '포틀랜드' },
  'Washington DC': { lat: 38.9072, lng: -77.0369, name: '워싱턴DC' },
  'Minneapolis': { lat: 44.9778, lng: -93.2650, name: '미니애폴리스' },
  'Nashville': { lat: 36.1627, lng: -86.7816, name: '내슈빌' },
  'Baltimore': { lat: 39.2904, lng: -76.6122, name: '볼티모어' },
  'Charlotte': { lat: 35.2271, lng: -80.8431, name: '샬럿' },
};

// 뉴스 출처에서 국가 추정
export const SOURCE_COUNTRY_MAP: Record<string, string> = {
  // 미국
  'CNN': '미국',
  'New York Times': '미국',
  'NYT': '미국',
  'Washington Post': '미국',
  'AP': '미국',
  'NPR': '미국',
  'Fox News': '미국',
  'Wall Street Journal': '미국',
  'USA Today': '미국',
  'Los Angeles Times': '미국',
  'Chicago Tribune': '미국',
  'Bloomberg': '미국',
  'CNBC': '미국',
  'ABC News': '미국',
  'CBS News': '미국',
  'NBC News': '미국',
  
  // 영국
  'BBC': '영국',
  'BBC News': '영국',
  'Reuters': '영국',
  'The Guardian': '영국',
  'The Telegraph': '영국',
  'Financial Times': '영국',
  'The Times': '영국',
  'Sky News': '영국',
  
  // 한국
  '네이버': '대한민국',
  '네이버 정치': '대한민국',
  '네이버 경제': '대한민국',
  '네이버 IT/과학': '대한민국',
  '네이버 세계': '대한민국',
  '연합뉴스': '대한민국',
  'KBS': '대한민국',
  'MBC': '대한민국',
  'SBS': '대한민국',
  '조선일보': '대한민국',
  '중앙일보': '대한민국',
  '한겨레': '대한민국',
  
  // 독일
  'DW': '독일',
  'Deutsche Welle': '독일',
  'Der Spiegel': '독일',
  
  // 프랑스
  'AFP': '프랑스',
  'France24': '프랑스',
  'Le Monde': '프랑스',
  
  // 일본
  'NHK': '일본',
  'Japan Times': '일본',
  'Nikkei': '일본',
  
  // 중국
  '신화통신': '중국',
  'Xinhua': '중국',
  'CGTN': '중국',
  'South China Morning Post': '홍콩',
  
  // 중동
  'Al Jazeera': '카타르',
  'Times of Israel': '이스라엘',
  'Haaretz': '이스라엘',
  
  // 인도
  'NDTV': '인도',
  'Times of India': '인도',
  'Hindustan Times': '인도',
  
  // 러시아
  'RT': '러시아',
  'TASS': '러시아',
  
  // 호주
  'ABC Australia': '호주',
  'Sydney Morning Herald': '호주',
  
  // 브라질
  'Folha': '브라질',
  'O Globo': '브라질',
  
  // 캐나다
  'CBC': '캐나다',
  'Globe and Mail': '캐나다',
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

// 뉴스 텍스트에서 미국 지역 추출
export function extractUSRegion(text: string): { region: string; coords: { lat: number; lng: number } } | null {
  const textUpper = text.toUpperCase();
  
  // 도시명 검색 (우선순위 높음)
  for (const [cityName, data] of Object.entries(US_REGIONS)) {
    if (textUpper.includes(cityName.toUpperCase())) {
      return { region: data.name, coords: { lat: data.lat, lng: data.lng } };
    }
  }
  
  // 주 약어 검색
  const stateAbbreviations: Record<string, string> = {
    'CA': 'California', 'TX': 'Texas', 'FL': 'Florida', 'NY': 'New York',
    'IL': 'Illinois', 'PA': 'Pennsylvania', 'OH': 'Ohio', 'GA': 'Georgia',
    'MI': 'Michigan', 'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts',
    'CO': 'Colorado', 'VA': 'Virginia', 'NV': 'Nevada', 'DC': 'Washington DC',
  };
  
  for (const [abbr, stateName] of Object.entries(stateAbbreviations)) {
    // 주 약어가 단어로 등장하는지 확인 (예: "CA," "CA." "CA ")
    const regex = new RegExp(`\\b${abbr}\\b`, 'i');
    if (regex.test(text) && US_REGIONS[stateName]) {
      const data = US_REGIONS[stateName];
      return { region: data.name, coords: { lat: data.lat, lng: data.lng } };
    }
  }
  
  return null;
}

// 미국 뉴스의 상세 좌표 가져오기
export function getUSNewsCoordinates(news: { title?: string; description?: string; country?: string }): { lat: number; lng: number } | null {
  if (news.country !== '미국' && news.country !== 'United States' && news.country !== 'US') {
    return null;
  }
  
  // 제목에서 지역 추출 시도
  if (news.title) {
    const result = extractUSRegion(news.title);
    if (result) return result.coords;
  }
  
  // 설명에서 지역 추출 시도
  if (news.description) {
    const result = extractUSRegion(news.description);
    if (result) return result.coords;
  }
  
  // 기본 미국 좌표 (워싱턴 DC)
  return { lat: 38.9072, lng: -77.0369 };
}

// 주요 대도시 좌표 (도시 불빛 효과용)
export interface CityData {
  name: string;
  lat: number;
  lng: number;
  population: number; // 인구 수 (밝기 계산용)
}

export const MAJOR_CITIES: CityData[] = [
  // 아시아
  { name: '서울', lat: 37.5665, lng: 126.9780, population: 9776000 },
  { name: '도쿄', lat: 35.6762, lng: 139.6503, population: 13960000 },
  { name: '베이징', lat: 39.9042, lng: 116.4074, population: 21540000 },
  { name: '상하이', lat: 31.2304, lng: 121.4737, population: 24280000 },
  { name: '홍콩', lat: 22.3193, lng: 114.1694, population: 7482000 },
  { name: '싱가포르', lat: 1.3521, lng: 103.8198, population: 5850000 },
  { name: '방콕', lat: 13.7563, lng: 100.5018, population: 10539000 },
  { name: '뭄바이', lat: 19.0760, lng: 72.8777, population: 20411000 },
  { name: '델리', lat: 28.6139, lng: 77.2090, population: 29399000 },
  { name: '자카르타', lat: -6.2088, lng: 106.8456, population: 10562000 },
  { name: '마닐라', lat: 14.5995, lng: 120.9842, population: 13923000 },
  { name: '오사카', lat: 34.6937, lng: 135.5023, population: 2691000 },
  { name: '광저우', lat: 23.1291, lng: 113.2644, population: 13501000 },
  { name: '선전', lat: 22.5431, lng: 114.0579, population: 12528000 },
  { name: '타이베이', lat: 25.0330, lng: 121.5654, population: 2646000 },
  
  // 북미
  { name: '뉴욕', lat: 40.7128, lng: -74.0060, population: 8336000 },
  { name: '로스앤젤레스', lat: 34.0522, lng: -118.2437, population: 3979000 },
  { name: '시카고', lat: 41.8781, lng: -87.6298, population: 2693000 },
  { name: '휴스턴', lat: 29.7604, lng: -95.3698, population: 2320000 },
  { name: '토론토', lat: 43.6532, lng: -79.3832, population: 2731000 },
  { name: '멕시코시티', lat: 19.4326, lng: -99.1332, population: 21782000 },
  { name: '마이애미', lat: 25.7617, lng: -80.1918, population: 467963 },
  { name: '샌프란시스코', lat: 37.7749, lng: -122.4194, population: 883305 },
  { name: '시애틀', lat: 47.6062, lng: -122.3321, population: 753675 },
  { name: '워싱턴DC', lat: 38.9072, lng: -77.0369, population: 689545 },
  
  // 유럽
  { name: '런던', lat: 51.5074, lng: -0.1278, population: 8982000 },
  { name: '파리', lat: 48.8566, lng: 2.3522, population: 2161000 },
  { name: '베를린', lat: 52.5200, lng: 13.4050, population: 3645000 },
  { name: '마드리드', lat: 40.4168, lng: -3.7038, population: 3223000 },
  { name: '로마', lat: 41.9028, lng: 12.4964, population: 2873000 },
  { name: '암스테르담', lat: 52.3676, lng: 4.9041, population: 872680 },
  { name: '모스크바', lat: 55.7558, lng: 37.6173, population: 12537000 },
  { name: '이스탄불', lat: 41.0082, lng: 28.9784, population: 15462000 },
  { name: '바르셀로나', lat: 41.3851, lng: 2.1734, population: 1620343 },
  { name: '뮌헨', lat: 48.1351, lng: 11.5820, population: 1472000 },
  { name: '밀라노', lat: 45.4642, lng: 9.1900, population: 1366180 },
  { name: '비엔나', lat: 48.2082, lng: 16.3738, population: 1897000 },
  { name: '프라하', lat: 50.0755, lng: 14.4378, population: 1309000 },
  { name: '아테네', lat: 37.9838, lng: 23.7275, population: 3154000 },
  
  // 중동
  { name: '두바이', lat: 25.2048, lng: 55.2708, population: 3400800 },
  { name: '리야드', lat: 24.7136, lng: 46.6753, population: 7676654 },
  { name: '텔아비브', lat: 32.0853, lng: 34.7818, population: 460613 },
  { name: '테헤란', lat: 35.6892, lng: 51.3890, population: 8694000 },
  { name: '카이로', lat: 30.0444, lng: 31.2357, population: 20901000 },
  
  // 오세아니아
  { name: '시드니', lat: -33.8688, lng: 151.2093, population: 5312000 },
  { name: '멜버른', lat: -37.8136, lng: 144.9631, population: 5078000 },
  { name: '오클랜드', lat: -36.8485, lng: 174.7633, population: 1657000 },
  
  // 남미
  { name: '상파울루', lat: -23.5505, lng: -46.6333, population: 12330000 },
  { name: '리우데자네이루', lat: -22.9068, lng: -43.1729, population: 6748000 },
  { name: '부에노스아이레스', lat: -34.6037, lng: -58.3816, population: 3075000 },
  { name: '보고타', lat: 4.7110, lng: -74.0721, population: 7181000 },
  { name: '리마', lat: -12.0464, lng: -77.0428, population: 9752000 },
  { name: '산티아고', lat: -33.4489, lng: -70.6693, population: 6160000 },
  
  // 아프리카
  { name: '요하네스버그', lat: -26.2041, lng: 28.0473, population: 5635000 },
  { name: '라고스', lat: 6.5244, lng: 3.3792, population: 14368000 },
  { name: '나이로비', lat: -1.2921, lng: 36.8219, population: 4397000 },
  { name: '카사블랑카', lat: 33.5731, lng: -7.5898, population: 3359000 },
  { name: '케이프타운', lat: -33.9249, lng: 18.4241, population: 4618000 },
];

// 중국 주요 성/도시 좌표
export const CHINA_REGIONS: Record<string, RegionCoordinates> = {
  // 주요 성
  '광둥성': { lat: 23.1291, lng: 113.2644, name: '광둥성' },
  '광동성': { lat: 23.1291, lng: 113.2644, name: '광둥성' },
  'Guangdong': { lat: 23.1291, lng: 113.2644, name: '광둥성' },
  '산둥성': { lat: 36.6683, lng: 117.0206, name: '산둥성' },
  'Shandong': { lat: 36.6683, lng: 117.0206, name: '산둥성' },
  '쓰촨성': { lat: 30.5728, lng: 104.0668, name: '쓰촨성' },
  'Sichuan': { lat: 30.5728, lng: 104.0668, name: '쓰촨성' },
  '저장성': { lat: 30.2741, lng: 120.1551, name: '저장성' },
  'Zhejiang': { lat: 30.2741, lng: 120.1551, name: '저장성' },
  '장쑤성': { lat: 32.0603, lng: 118.7969, name: '장쑤성' },
  'Jiangsu': { lat: 32.0603, lng: 118.7969, name: '장쑤성' },
  '후난성': { lat: 28.2282, lng: 112.9388, name: '후난성' },
  'Hunan': { lat: 28.2282, lng: 112.9388, name: '후난성' },
  '후베이성': { lat: 30.5928, lng: 114.3055, name: '후베이성' },
  'Hubei': { lat: 30.5928, lng: 114.3055, name: '후베이성' },
  '신장': { lat: 43.7930, lng: 87.6177, name: '신장' },
  'Xinjiang': { lat: 43.7930, lng: 87.6177, name: '신장' },
  '티베트': { lat: 29.6500, lng: 91.1000, name: '티베트' },
  'Tibet': { lat: 29.6500, lng: 91.1000, name: '티베트' },
  
  // 직할시
  '베이징': { lat: 39.9042, lng: 116.4074, name: '베이징' },
  '북경': { lat: 39.9042, lng: 116.4074, name: '베이징' },
  'Beijing': { lat: 39.9042, lng: 116.4074, name: '베이징' },
  '상하이': { lat: 31.2304, lng: 121.4737, name: '상하이' },
  '상해': { lat: 31.2304, lng: 121.4737, name: '상하이' },
  'Shanghai': { lat: 31.2304, lng: 121.4737, name: '상하이' },
  '톈진': { lat: 39.3434, lng: 117.3616, name: '톈진' },
  'Tianjin': { lat: 39.3434, lng: 117.3616, name: '톈진' },
  '충칭': { lat: 29.4316, lng: 106.9123, name: '충칭' },
  'Chongqing': { lat: 29.4316, lng: 106.9123, name: '충칭' },
  
  // 주요 도시
  '광저우': { lat: 23.1291, lng: 113.2644, name: '광저우' },
  'Guangzhou': { lat: 23.1291, lng: 113.2644, name: '광저우' },
  '선전': { lat: 22.5431, lng: 114.0579, name: '선전' },
  '심천': { lat: 22.5431, lng: 114.0579, name: '선전' },
  'Shenzhen': { lat: 22.5431, lng: 114.0579, name: '선전' },
  '항저우': { lat: 30.2741, lng: 120.1551, name: '항저우' },
  'Hangzhou': { lat: 30.2741, lng: 120.1551, name: '항저우' },
  '난징': { lat: 32.0603, lng: 118.7969, name: '난징' },
  'Nanjing': { lat: 32.0603, lng: 118.7969, name: '난징' },
  '우한': { lat: 30.5928, lng: 114.3055, name: '우한' },
  'Wuhan': { lat: 30.5928, lng: 114.3055, name: '우한' },
  '청두': { lat: 30.5728, lng: 104.0668, name: '청두' },
  'Chengdu': { lat: 30.5728, lng: 104.0668, name: '청두' },
  '시안': { lat: 34.3416, lng: 108.9398, name: '시안' },
  'Xian': { lat: 34.3416, lng: 108.9398, name: '시안' },
};

// 러시아 주요 지역/도시 좌표
export const RUSSIA_REGIONS: Record<string, RegionCoordinates> = {
  // 주요 지역
  '모스크바주': { lat: 55.7558, lng: 37.6173, name: '모스크바주' },
  'Moscow Oblast': { lat: 55.7558, lng: 37.6173, name: '모스크바주' },
  '시베리아': { lat: 61.0137, lng: 99.1967, name: '시베리아' },
  'Siberia': { lat: 61.0137, lng: 99.1967, name: '시베리아' },
  '극동': { lat: 48.4827, lng: 135.0836, name: '극동' },
  'Far East': { lat: 48.4827, lng: 135.0836, name: '극동' },
  '크림': { lat: 44.9521, lng: 34.1024, name: '크림' },
  'Crimea': { lat: 44.9521, lng: 34.1024, name: '크림' },
  '체첸': { lat: 43.3170, lng: 45.6982, name: '체첸' },
  'Chechnya': { lat: 43.3170, lng: 45.6982, name: '체첸' },
  
  // 주요 도시
  '모스크바': { lat: 55.7558, lng: 37.6173, name: '모스크바' },
  'Moscow': { lat: 55.7558, lng: 37.6173, name: '모스크바' },
  '상트페테르부르크': { lat: 59.9311, lng: 30.3609, name: '상트페테르부르크' },
  'Saint Petersburg': { lat: 59.9311, lng: 30.3609, name: '상트페테르부르크' },
  '노보시비르스크': { lat: 55.0084, lng: 82.9357, name: '노보시비르스크' },
  'Novosibirsk': { lat: 55.0084, lng: 82.9357, name: '노보시비르스크' },
  '블라디보스토크': { lat: 43.1056, lng: 131.8735, name: '블라디보스토크' },
  'Vladivostok': { lat: 43.1056, lng: 131.8735, name: '블라디보스토크' },
  '카잔': { lat: 55.7887, lng: 49.1221, name: '카잔' },
  'Kazan': { lat: 55.7887, lng: 49.1221, name: '카잔' },
  '예카테린부르크': { lat: 56.8389, lng: 60.6057, name: '예카테린부르크' },
  'Yekaterinburg': { lat: 56.8389, lng: 60.6057, name: '예카테린부르크' },
  '소치': { lat: 43.6028, lng: 39.7342, name: '소치' },
  'Sochi': { lat: 43.6028, lng: 39.7342, name: '소치' },
};

// 캐나다 주요 지역/도시 좌표
export const CANADA_REGIONS: Record<string, RegionCoordinates> = {
  // 주
  '온타리오': { lat: 51.2538, lng: -85.3232, name: '온타리오' },
  'Ontario': { lat: 51.2538, lng: -85.3232, name: '온타리오' },
  '퀘벡': { lat: 52.9399, lng: -73.5491, name: '퀘벡' },
  'Quebec': { lat: 52.9399, lng: -73.5491, name: '퀘벡' },
  '브리티시컬럼비아': { lat: 53.7267, lng: -127.6476, name: '브리티시컬럼비아' },
  'British Columbia': { lat: 53.7267, lng: -127.6476, name: '브리티시컬럼비아' },
  '앨버타': { lat: 53.9333, lng: -116.5765, name: '앨버타' },
  'Alberta': { lat: 53.9333, lng: -116.5765, name: '앨버타' },
  
  // 도시
  '토론토': { lat: 43.6532, lng: -79.3832, name: '토론토' },
  'Toronto': { lat: 43.6532, lng: -79.3832, name: '토론토' },
  '밴쿠버': { lat: 49.2827, lng: -123.1207, name: '밴쿠버' },
  'Vancouver': { lat: 49.2827, lng: -123.1207, name: '밴쿠버' },
  '몬트리올': { lat: 45.5017, lng: -73.5673, name: '몬트리올' },
  'Montreal': { lat: 45.5017, lng: -73.5673, name: '몬트리올' },
  '캘거리': { lat: 51.0447, lng: -114.0719, name: '캘거리' },
  'Calgary': { lat: 51.0447, lng: -114.0719, name: '캘거리' },
  '오타와': { lat: 45.4215, lng: -75.6972, name: '오타와' },
  'Ottawa': { lat: 45.4215, lng: -75.6972, name: '오타와' },
  '에드먼턴': { lat: 53.5461, lng: -113.4938, name: '에드먼턴' },
  'Edmonton': { lat: 53.5461, lng: -113.4938, name: '에드먼턴' },
};

// 인도 주요 지역/도시 좌표
export const INDIA_REGIONS: Record<string, RegionCoordinates> = {
  // 주요 주
  '마하라슈트라': { lat: 19.7515, lng: 75.7139, name: '마하라슈트라' },
  'Maharashtra': { lat: 19.7515, lng: 75.7139, name: '마하라슈트라' },
  '카르나타카': { lat: 15.3173, lng: 75.7139, name: '카르나타카' },
  'Karnataka': { lat: 15.3173, lng: 75.7139, name: '카르나타카' },
  '타밀나두': { lat: 11.1271, lng: 78.6569, name: '타밀나두' },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569, name: '타밀나두' },
  '우타르프라데시': { lat: 26.8467, lng: 80.9462, name: '우타르프라데시' },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, name: '우타르프라데시' },
  '라자스탄': { lat: 27.0238, lng: 74.2179, name: '라자스탄' },
  'Rajasthan': { lat: 27.0238, lng: 74.2179, name: '라자스탄' },
  '케랄라': { lat: 10.8505, lng: 76.2711, name: '케랄라' },
  'Kerala': { lat: 10.8505, lng: 76.2711, name: '케랄라' },
  '카슈미르': { lat: 34.0837, lng: 74.7973, name: '카슈미르' },
  'Kashmir': { lat: 34.0837, lng: 74.7973, name: '카슈미르' },
  
  // 주요 도시
  '뭄바이': { lat: 19.0760, lng: 72.8777, name: '뭄바이' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, name: '뭄바이' },
  '델리': { lat: 28.6139, lng: 77.2090, name: '델리' },
  'Delhi': { lat: 28.6139, lng: 77.2090, name: '델리' },
  'New Delhi': { lat: 28.6139, lng: 77.2090, name: '뉴델리' },
  '뉴델리': { lat: 28.6139, lng: 77.2090, name: '뉴델리' },
  '벵갈루루': { lat: 12.9716, lng: 77.5946, name: '벵갈루루' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, name: '벵갈루루' },
  'Bengaluru': { lat: 12.9716, lng: 77.5946, name: '벵갈루루' },
  '첸나이': { lat: 13.0827, lng: 80.2707, name: '첸나이' },
  'Chennai': { lat: 13.0827, lng: 80.2707, name: '첸나이' },
  '콜카타': { lat: 22.5726, lng: 88.3639, name: '콜카타' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, name: '콜카타' },
  '하이데라바드': { lat: 17.3850, lng: 78.4867, name: '하이데라바드' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, name: '하이데라바드' },
};

// 유럽 주요 국가 도시 좌표
export const EUROPE_CITIES: Record<string, Record<string, RegionCoordinates>> = {
  '영국': {
    '런던': { lat: 51.5074, lng: -0.1278, name: '런던' },
    'London': { lat: 51.5074, lng: -0.1278, name: '런던' },
    '맨체스터': { lat: 53.4808, lng: -2.2426, name: '맨체스터' },
    'Manchester': { lat: 53.4808, lng: -2.2426, name: '맨체스터' },
    '버밍엄': { lat: 52.4862, lng: -1.8904, name: '버밍엄' },
    'Birmingham': { lat: 52.4862, lng: -1.8904, name: '버밍엄' },
    '에든버러': { lat: 55.9533, lng: -3.1883, name: '에든버러' },
    'Edinburgh': { lat: 55.9533, lng: -3.1883, name: '에든버러' },
    '글래스고': { lat: 55.8642, lng: -4.2518, name: '글래스고' },
    'Glasgow': { lat: 55.8642, lng: -4.2518, name: '글래스고' },
    '리버풀': { lat: 53.4084, lng: -2.9916, name: '리버풀' },
    'Liverpool': { lat: 53.4084, lng: -2.9916, name: '리버풀' },
  },
  '독일': {
    '베를린': { lat: 52.5200, lng: 13.4050, name: '베를린' },
    'Berlin': { lat: 52.5200, lng: 13.4050, name: '베를린' },
    '뮌헨': { lat: 48.1351, lng: 11.5820, name: '뮌헨' },
    'Munich': { lat: 48.1351, lng: 11.5820, name: '뮌헨' },
    '프랑크푸르트': { lat: 50.1109, lng: 8.6821, name: '프랑크푸르트' },
    'Frankfurt': { lat: 50.1109, lng: 8.6821, name: '프랑크푸르트' },
    '함부르크': { lat: 53.5511, lng: 9.9937, name: '함부르크' },
    'Hamburg': { lat: 53.5511, lng: 9.9937, name: '함부르크' },
    '쾰른': { lat: 50.9375, lng: 6.9603, name: '쾰른' },
    'Cologne': { lat: 50.9375, lng: 6.9603, name: '쾰른' },
    '슈투트가르트': { lat: 48.7758, lng: 9.1829, name: '슈투트가르트' },
    'Stuttgart': { lat: 48.7758, lng: 9.1829, name: '슈투트가르트' },
  },
  '프랑스': {
    '파리': { lat: 48.8566, lng: 2.3522, name: '파리' },
    'Paris': { lat: 48.8566, lng: 2.3522, name: '파리' },
    '마르세유': { lat: 43.2965, lng: 5.3698, name: '마르세유' },
    'Marseille': { lat: 43.2965, lng: 5.3698, name: '마르세유' },
    '리옹': { lat: 45.7640, lng: 4.8357, name: '리옹' },
    'Lyon': { lat: 45.7640, lng: 4.8357, name: '리옹' },
    '니스': { lat: 43.7102, lng: 7.2620, name: '니스' },
    'Nice': { lat: 43.7102, lng: 7.2620, name: '니스' },
    '보르도': { lat: 44.8378, lng: -0.5792, name: '보르도' },
    'Bordeaux': { lat: 44.8378, lng: -0.5792, name: '보르도' },
  },
  '일본': {
    '도쿄': { lat: 35.6762, lng: 139.6503, name: '도쿄' },
    'Tokyo': { lat: 35.6762, lng: 139.6503, name: '도쿄' },
    '오사카': { lat: 34.6937, lng: 135.5023, name: '오사카' },
    'Osaka': { lat: 34.6937, lng: 135.5023, name: '오사카' },
    '교토': { lat: 35.0116, lng: 135.7681, name: '교토' },
    'Kyoto': { lat: 35.0116, lng: 135.7681, name: '교토' },
    '요코하마': { lat: 35.4437, lng: 139.6380, name: '요코하마' },
    'Yokohama': { lat: 35.4437, lng: 139.6380, name: '요코하마' },
    '나고야': { lat: 35.1815, lng: 136.9066, name: '나고야' },
    'Nagoya': { lat: 35.1815, lng: 136.9066, name: '나고야' },
    '후쿠오카': { lat: 33.5904, lng: 130.4017, name: '후쿠오카' },
    'Fukuoka': { lat: 33.5904, lng: 130.4017, name: '후쿠오카' },
    '삿포로': { lat: 43.0618, lng: 141.3545, name: '삿포로' },
    'Sapporo': { lat: 43.0618, lng: 141.3545, name: '삿포로' },
    '오키나와': { lat: 26.2124, lng: 127.6809, name: '오키나와' },
    'Okinawa': { lat: 26.2124, lng: 127.6809, name: '오키나와' },
  },
  '호주': {
    '시드니': { lat: -33.8688, lng: 151.2093, name: '시드니' },
    'Sydney': { lat: -33.8688, lng: 151.2093, name: '시드니' },
    '멜버른': { lat: -37.8136, lng: 144.9631, name: '멜버른' },
    'Melbourne': { lat: -37.8136, lng: 144.9631, name: '멜버른' },
    '브리즈번': { lat: -27.4698, lng: 153.0251, name: '브리즈번' },
    'Brisbane': { lat: -27.4698, lng: 153.0251, name: '브리즈번' },
    '퍼스': { lat: -31.9505, lng: 115.8605, name: '퍼스' },
    'Perth': { lat: -31.9505, lng: 115.8605, name: '퍼스' },
    '애들레이드': { lat: -34.9285, lng: 138.6007, name: '애들레이드' },
    'Adelaide': { lat: -34.9285, lng: 138.6007, name: '애들레이드' },
    '캔버라': { lat: -35.2809, lng: 149.1300, name: '캔버라' },
    'Canberra': { lat: -35.2809, lng: 149.1300, name: '캔버라' },
  },
  '브라질': {
    '상파울루': { lat: -23.5505, lng: -46.6333, name: '상파울루' },
    'Sao Paulo': { lat: -23.5505, lng: -46.6333, name: '상파울루' },
    '리우데자네이루': { lat: -22.9068, lng: -43.1729, name: '리우데자네이루' },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729, name: '리우데자네이루' },
    '브라질리아': { lat: -15.7801, lng: -47.9292, name: '브라질리아' },
    'Brasilia': { lat: -15.7801, lng: -47.9292, name: '브라질리아' },
    '살바도르': { lat: -12.9714, lng: -38.5014, name: '살바도르' },
    'Salvador': { lat: -12.9714, lng: -38.5014, name: '살바도르' },
  },
};

// 국가별 지역 데이터 매핑
const COUNTRY_REGION_MAP: Record<string, Record<string, RegionCoordinates>> = {
  '미국': US_REGIONS,
  'United States': US_REGIONS,
  'US': US_REGIONS,
  'USA': US_REGIONS,
  '중국': CHINA_REGIONS,
  'China': CHINA_REGIONS,
  '러시아': RUSSIA_REGIONS,
  'Russia': RUSSIA_REGIONS,
  '캐나다': CANADA_REGIONS,
  'Canada': CANADA_REGIONS,
  '인도': INDIA_REGIONS,
  'India': INDIA_REGIONS,
};

/**
 * 국가, 지역, 도시 정보를 기반으로 상세 좌표 반환
 */
export function getDetailedCoordinates(
  country: string,
  region?: string | null,
  city?: string | null
): { lat: number; lng: number } | null {
  // 1. 도시 정보가 있으면 도시 좌표 우선 검색
  if (city) {
    // 유럽/아시아/호주 등 국가별 도시 검색
    const countryKey = Object.keys(EUROPE_CITIES).find(
      key => key === country || COUNTRY_COORDINATES[key]?.code === country
    );
    if (countryKey && EUROPE_CITIES[countryKey]) {
      const cityData = EUROPE_CITIES[countryKey][city];
      if (cityData) {
        return { lat: cityData.lat, lng: cityData.lng };
      }
    }
    
    // 미국 도시 검색
    if (country === '미국' || country === 'US' || country === 'USA' || country === 'United States') {
      const usCity = US_REGIONS[city];
      if (usCity) {
        return { lat: usCity.lat, lng: usCity.lng };
      }
    }
    
    // 중국 도시 검색
    if (country === '중국' || country === 'China') {
      const chinaCity = CHINA_REGIONS[city];
      if (chinaCity) {
        return { lat: chinaCity.lat, lng: chinaCity.lng };
      }
    }
    
    // 러시아 도시 검색
    if (country === '러시아' || country === 'Russia') {
      const russiaCity = RUSSIA_REGIONS[city];
      if (russiaCity) {
        return { lat: russiaCity.lat, lng: russiaCity.lng };
      }
    }
    
    // 캐나다 도시 검색
    if (country === '캐나다' || country === 'Canada') {
      const canadaCity = CANADA_REGIONS[city];
      if (canadaCity) {
        return { lat: canadaCity.lat, lng: canadaCity.lng };
      }
    }
    
    // 인도 도시 검색
    if (country === '인도' || country === 'India') {
      const indiaCity = INDIA_REGIONS[city];
      if (indiaCity) {
        return { lat: indiaCity.lat, lng: indiaCity.lng };
      }
    }
  }
  
  // 2. 지역 정보로 검색
  if (region) {
    const regionData = COUNTRY_REGION_MAP[country];
    if (regionData) {
      const regionCoords = regionData[region];
      if (regionCoords) {
        return { lat: regionCoords.lat, lng: regionCoords.lng };
      }
    }
    
    // 모든 지역 데이터에서 검색
    for (const regionMap of Object.values(COUNTRY_REGION_MAP)) {
      const coords = regionMap[region];
      if (coords) {
        return { lat: coords.lat, lng: coords.lng };
      }
    }
  }
  
  // 3. 국가 좌표 반환
  const countryCoords = getCountryCoordinates(country);
  if (countryCoords) {
    return { lat: countryCoords.lat, lng: countryCoords.lng };
  }
  
  return null;
}

