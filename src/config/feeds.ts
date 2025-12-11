/**
 * 뉴스 수집을 위한 RSS 피드 설정
 * 전 세계 주요 언론사 RSS 피드
 */
export const newsFeeds = [
  // ============================================
  // 미국 (USA) - 영향력이 큰 국가이므로 다양한 소스
  // ============================================
  {
    url: 'https://rss.cnn.com/rss/edition.rss',
    name: 'CNN',
    country: '미국',
    maxItems: 15,
  },
  {
    url: 'https://rss.cnn.com/rss/edition_world.rss',
    name: 'CNN World',
    country: '미국',
    maxItems: 10,
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    name: 'New York Times',
    country: '미국',
    maxItems: 15,
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    name: 'NYT World',
    country: '미국',
    maxItems: 10,
  },
  {
    url: 'https://feeds.washingtonpost.com/rss/world',
    name: 'Washington Post',
    country: '미국',
    maxItems: 8,
  },
  {
    url: 'https://feeds.npr.org/1001/rss.xml',
    name: 'NPR',
    country: '미국',
    maxItems: 8,
  },

  // ============================================
  // 영국 (UK) - 영향력이 큰 국가
  // ============================================
  {
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    name: 'BBC News',
    country: '영국',
    maxItems: 15,
  },
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    name: 'BBC World',
    country: '영국',
    maxItems: 10,
  },
  {
    url: 'https://www.theguardian.com/world/rss',
    name: 'The Guardian',
    country: '영국',
    maxItems: 8,
  },
  {
    url: 'https://www.telegraph.co.uk/rss.xml',
    name: 'The Telegraph',
    country: '영국',
    maxItems: 5,
  },

  // ============================================
  // 한국 (Korea)
  // ============================================
  {
    url: 'https://news.naver.com/main/rss/section.naver?sid=100',
    name: '네이버 정치',
    country: '대한민국',
    maxItems: 5,
  },
  {
    url: 'https://news.naver.com/main/rss/section.naver?sid=101',
    name: '네이버 경제',
    country: '대한민국',
    maxItems: 5,
  },
  {
    url: 'https://news.naver.com/main/rss/section.naver?sid=104',
    name: '네이버 세계',
    country: '대한민국',
    maxItems: 5,
  },

  // ============================================
  // 유럽 (Europe)
  // ============================================
  // 독일
  {
    url: 'https://rss.dw.com/rdf/rss-en-all',
    name: 'Deutsche Welle',
    country: '독일',
    maxItems: 8,
  },
  // 프랑스
  {
    url: 'https://www.france24.com/en/rss',
    name: 'France24',
    country: '프랑스',
    maxItems: 8,
  },
  // 러시아 (영어)
  {
    url: 'https://tass.com/rss/v2.xml',
    name: 'TASS',
    country: '러시아',
    maxItems: 5,
  },

  // ============================================
  // 아시아 (Asia)
  // ============================================
  // 일본
  {
    url: 'https://www3.nhk.or.jp/rss/news/cat0.xml',
    name: 'NHK',
    country: '일본',
    maxItems: 8,
  },
  // 중국/홍콩
  {
    url: 'https://www.scmp.com/rss/91/feed',
    name: 'South China Morning Post',
    country: '홍콩',
    maxItems: 8,
  },
  // 인도
  {
    url: 'https://feeds.feedburner.com/ndtvnews-top-stories',
    name: 'NDTV',
    country: '인도',
    maxItems: 8,
  },
  {
    url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    name: 'Times of India',
    country: '인도',
    maxItems: 5,
  },
  // 싱가포르
  {
    url: 'https://www.straitstimes.com/news/world/rss.xml',
    name: 'Straits Times',
    country: '싱가포르',
    maxItems: 5,
  },

  // ============================================
  // 중동 (Middle East)
  // ============================================
  {
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    name: 'Al Jazeera',
    country: '카타르',
    maxItems: 8,
  },
  {
    url: 'https://www.timesofisrael.com/feed/',
    name: 'Times of Israel',
    country: '이스라엘',
    maxItems: 5,
  },

  // ============================================
  // 오세아니아 (Oceania)
  // ============================================
  {
    url: 'https://www.abc.net.au/news/feed/51120/rss.xml',
    name: 'ABC Australia',
    country: '호주',
    maxItems: 8,
  },

  // ============================================
  // 남미 (South America)
  // ============================================
  {
    url: 'https://rss.uol.com.br/feed/noticias.xml',
    name: 'UOL Brazil',
    country: '브라질',
    maxItems: 5,
  },

  // ============================================
  // 아프리카 (Africa)
  // ============================================
  {
    url: 'https://www.news24.com/news24/TopStories/rss',
    name: 'News24 South Africa',
    country: '남아프리카공화국',
    maxItems: 5,
  },

  // ============================================
  // 글로벌/통신사 (Wire Services)
  // ============================================
  {
    url: 'https://www.reuters.com/rssFeed/worldNews',
    name: 'Reuters',
    country: '영국',
    maxItems: 10,
  },
];

// 국가별 최대 뉴스 개수 설정
export const NEWS_LIMITS_BY_COUNTRY: Record<string, number> = {
  '미국': 20,      // 영향력이 큰 국가
  '영국': 15,      // 영향력이 큰 국가
  '대한민국': 10,
  '독일': 8,
  '프랑스': 8,
  '일본': 8,
  '중국': 8,
  '홍콩': 5,
  '인도': 8,
  '러시아': 5,
  '카타르': 5,
  '이스라엘': 5,
  '호주': 5,
  '브라질': 5,
  '남아프리카공화국': 5,
  '싱가포르': 5,
  'default': 5,    // 기본값
};

