import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

let genAI: GoogleGenerativeAI | null = null;

// Gemini API 초기화
if (config.ai.geminiApiKey) {
  genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
}

/**
 * 뉴스를 한국어로 번역하고 한 줄로 요약
 */
export async function summarizeNewsInKorean(
  title: string,
  description?: string
): Promise<string | null> {
  // API 키가 없으면 요약하지 않음
  if (!genAI || !config.ai.geminiApiKey) {
    console.log('⚠️ Gemini API 키가 설정되지 않아 요약을 건너뜁니다');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `다음 뉴스 기사를 한국어로 번역하고 한 줄로 요약해주세요. 요약은 50자 이내로 간결하게 작성해주세요.

제목: ${title}
${description ? `내용: ${description.substring(0, 500)}` : ''}

한 줄 요약 (한국어, 50자 이내):`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    return summary;
  } catch (error) {
    console.error('뉴스 요약 실패:', error);
    return null;
  }
}

/**
 * 뉴스에서 관련 국가를 추출
 */
export async function extractCountryFromNews(
  title: string,
  description?: string,
  source?: string
): Promise<string> {
  // API 키가 없으면 출처 기반으로 추정
  if (!genAI || !config.ai.geminiApiKey) {
    return getCountryFromSource(source || '');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `다음 뉴스 기사에서 가장 관련 있는 국가 하나를 한국어로 알려주세요.
여러 국가가 언급되어 있다면 뉴스의 주요 배경이 되는 국가 하나만 선택하세요.
국가명만 답해주세요. (예: 미국, 영국, 대한민국, 일본, 중국 등)
만약 특정 국가를 파악할 수 없다면 "전세계"라고 답해주세요.

제목: ${title}
${description ? `내용: ${description.substring(0, 500)}` : ''}
출처: ${source || '알 수 없음'}

관련 국가 (한국어, 국가명만):`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const country = response.text().trim();

    // 유효한 국가명인지 확인
    const validCountries = [
      '대한민국', '한국', '미국', '영국', '일본', '중국', '프랑스', '독일',
      '러시아', '캐나다', '호주', '인도', '브라질', '이탈리아', '스페인',
      '멕시코', '네덜란드', '스위스', '스웨덴', '노르웨이', '덴마크',
      '핀란드', '폴란드', '체코', '오스트리아', '벨기에', '아일랜드',
      '포르투갈', '그리스', '터키', '이스라엘', '이란', '사우디아라비아',
      'UAE', '아랍에미리트', '카타르', '이라크', '시리아', '우크라이나',
      '대만', '홍콩', '싱가포르', '베트남', '태국', '인도네시아',
      '말레이시아', '필리핀', '뉴질랜드', '아르헨티나', '칠레', '콜롬비아',
      '페루', '베네수엘라', '남아프리카공화국', '이집트', '나이지리아',
      '케냐', '모로코', '에티오피아', '전세계', '글로벌'
    ];

    if (validCountries.some(c => country.includes(c))) {
      // 정확한 국가명 추출
      for (const c of validCountries) {
        if (country.includes(c)) {
          return c;
        }
      }
    }

    return '전세계';
  } catch (error) {
    console.error('국가 추출 실패:', error);
    return getCountryFromSource(source || '');
  }
}

/**
 * 뉴스 출처에서 국가 추정
 */
function getCountryFromSource(source: string): string {
  const sourceCountryMap: Record<string, string> = {
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

  return sourceCountryMap[source] || '전세계';
}

/**
 * 뉴스 요약과 국가를 한 번에 추출
 */
export async function processNewsWithAI(
  title: string,
  description?: string,
  source?: string
): Promise<{ summary: string | null; country: string }> {
  // API 키가 없으면 기본값 반환
  if (!genAI || !config.ai.geminiApiKey) {
    return {
      summary: null,
      country: getCountryFromSource(source || ''),
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `다음 뉴스 기사를 분석해주세요.

제목: ${title}
${description ? `내용: ${description.substring(0, 500)}` : ''}
출처: ${source || '알 수 없음'}

아래 형식으로 답해주세요:
요약: (한국어 50자 이내로 간결하게)
국가: (가장 관련 있는 국가 하나만, 한국어로. 예: 미국, 영국, 대한민국)`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    // 응답 파싱
    const summaryMatch = text.match(/요약[:\s]*(.+)/);
    const countryMatch = text.match(/국가[:\s]*(.+)/);

    const summary = summaryMatch ? summaryMatch[1].trim() : null;
    let country = countryMatch ? countryMatch[1].trim() : '전세계';

    // 국가명 정제
    if (country.length > 20) {
      country = '전세계';
    }

    return { summary, country };
  } catch (error) {
    console.error('뉴스 처리 실패:', error);
    return {
      summary: null,
      country: getCountryFromSource(source || ''),
    };
  }
}
