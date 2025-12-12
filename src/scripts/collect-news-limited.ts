/**
 * 제한된 수의 뉴스만 수집하는 스크립트
 * 
 * 실행 방법:
 * npx tsx src/scripts/collect-news-limited.ts [개수]
 * 
 * 예: npx tsx src/scripts/collect-news-limited.ts 100
 */

import Parser from 'rss-parser';
import { createPage } from '../lib/notion-client.js';
import { processNewsWithAI } from '../services/news-summarizer.js';
import { newsFeeds } from '../config/feeds.js';

const parser = new Parser();

interface NewsItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source?: string;
  country?: string;
}

async function collectLimitedNews(maxTotal: number) {
  console.log(`🌍 전세계 뉴스 수집 시작 (최대 ${maxTotal}개)\n`);
  
  const allNews: NewsItem[] = [];
  
  // 모든 피드에서 뉴스 수집
  for (const feed of newsFeeds) {
    try {
      console.log(`📡 ${feed.name} (${feed.country}) 수집 중...`);
      const result = await parser.parseURL(feed.url);
      
      const items = result.items.slice(0, feed.maxItems || 10).map(item => ({
        title: item.title || '제목 없음',
        link: item.link || '',
        description: item.contentSnippet || item.content || '',
        pubDate: item.pubDate || new Date().toISOString(),
        source: feed.name,
        country: feed.country,
      }));
      
      allNews.push(...items);
      console.log(`   ✓ ${items.length}개 수집`);
      
    } catch (error) {
      console.log(`   ✗ ${feed.name} 수집 실패`);
    }
  }
  
  // 중복 제거 (링크 기준)
  const uniqueNews = Array.from(
    new Map(allNews.map(item => [item.link, item])).values()
  );
  
  console.log(`\n📊 총 ${uniqueNews.length}개 수집 (중복 제거 후)`);
  
  // 제한된 개수만 선택 (다양한 국가에서 골고루 선택)
  const selectedNews = selectDiverseNews(uniqueNews, maxTotal);
  
  console.log(`📝 ${selectedNews.length}개 뉴스를 Notion에 저장합니다...\n`);
  
  let saved = 0;
  for (const newsItem of selectedNews) {
    try {
      // AI로 요약과 위치 정보 추출
      console.log(`🤖 AI 분석 중: ${newsItem.title.substring(0, 40)}...`);
      
      const { summary, country, region, city } = await processNewsWithAI(
        newsItem.title,
        newsItem.description,
        newsItem.source
      );
      
      // Notion에 저장
      const properties: Record<string, any> = {
        'name': {
          title: [{ text: { content: newsItem.title } }],
        },
        'URL': { url: newsItem.link },
      };
      
      if (newsItem.description) {
        properties['설명'] = {
          rich_text: [{ text: { content: newsItem.description.substring(0, 2000) } }],
        };
      }
      
      if (newsItem.source) {
        properties['출처'] = {
          rich_text: [{ text: { content: newsItem.source } }],
        };
      }
      
      if (newsItem.pubDate) {
        try {
          const date = new Date(newsItem.pubDate);
          if (!isNaN(date.getTime())) {
            properties['date'] = {
              date: { start: date.toISOString().split('T')[0] },
            };
          }
        } catch {}
      }
      
      if (summary) {
        properties['한 줄 요약'] = {
          rich_text: [{ text: { content: summary } }],
        };
        console.log(`   ✓ 요약: ${summary}`);
      }
      
      // 국가 정보 (AI 추출 결과 또는 피드 설정)
      const finalCountry = country || newsItem.country || '전세계';
      properties['국가'] = {
        rich_text: [{ text: { content: finalCountry } }],
      };
      
      if (region) {
        properties['지역'] = {
          rich_text: [{ text: { content: region } }],
        };
        console.log(`   ✓ 지역: ${region}`);
      }
      
      if (city) {
        properties['도시'] = {
          rich_text: [{ text: { content: city } }],
        };
        console.log(`   ✓ 도시: ${city}`);
      }
      
      await createPage(properties);
      saved++;
      console.log(`   💾 저장 완료 (${saved}/${selectedNews.length})\n`);
      
      // Rate limit 방지
      await new Promise(resolve => setTimeout(resolve, 1200));
      
    } catch (error) {
      console.log(`   ✗ 저장 실패: ${newsItem.title.substring(0, 30)}...`);
    }
  }
  
  console.log(`\n✅ 완료! ${saved}개의 뉴스가 저장되었습니다.`);
  return saved;
}

// 다양한 국가에서 골고루 뉴스 선택
function selectDiverseNews(news: NewsItem[], maxTotal: number): NewsItem[] {
  // 국가별로 그룹화
  const byCountry: Record<string, NewsItem[]> = {};
  
  news.forEach(item => {
    const country = item.country || '기타';
    if (!byCountry[country]) byCountry[country] = [];
    byCountry[country].push(item);
  });
  
  const countries = Object.keys(byCountry);
  const result: NewsItem[] = [];
  
  // 라운드 로빈 방식으로 각 국가에서 골고루 선택
  let round = 0;
  while (result.length < maxTotal) {
    let addedThisRound = false;
    
    for (const country of countries) {
      if (result.length >= maxTotal) break;
      
      if (byCountry[country].length > round) {
        result.push(byCountry[country][round]);
        addedThisRound = true;
      }
    }
    
    if (!addedThisRound) break;
    round++;
  }
  
  return result;
}

// 메인 실행
const maxNews = parseInt(process.argv[2]) || 100;
collectLimitedNews(maxNews);
