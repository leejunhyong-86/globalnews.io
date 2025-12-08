import Parser from 'rss-parser';
import { createPage } from '../lib/notion-client.js';
import { summarizeNewsInKorean, extractCountryFromNews, processNewsWithAI } from './news-summarizer.js';

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source?: string;
  summary?: string; // 한글 요약
  country?: string; // 관련 국가
}

/**
 * RSS 피드에서 뉴스 수집
 */
export async function collectNewsFromRSS(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const newsItems: NewsItem[] = [];

    feed.items.forEach((item) => {
      newsItems.push({
        title: item.title || '제목 없음',
        link: item.link || '',
        description: item.contentSnippet || item.content || '',
        pubDate: item.pubDate || new Date().toISOString(),
        source: sourceName,
      });
    });

    return newsItems;
  } catch (error) {
    console.error(`RSS 피드 수집 실패 (${feedUrl}):`, error);
    return [];
  }
}

/**
 * 뉴스를 Notion에 저장
 */
export async function saveNewsToNotion(newsItem: NewsItem) {
  try {
    const properties: Record<string, any> = {
      'name': {
        title: [
          {
            text: {
              content: newsItem.title,
            },
          },
        ],
      },
      'URL': {
        url: newsItem.link,
      },
    };

    if (newsItem.description) {
      properties['설명'] = {
        rich_text: [
          {
            text: {
              content: newsItem.description.substring(0, 2000), // Notion 제한 고려
            },
          },
        ],
      };
    }

    if (newsItem.source) {
      properties['출처'] = {
        rich_text: [
          {
            text: {
              content: newsItem.source,
            },
          },
        ],
      };
    }

    if (newsItem.pubDate) {
      // RSS 날짜 형식을 ISO 8601 형식으로 변환
      let isoDate: string;
      try {
        const date = new Date(newsItem.pubDate);
        if (isNaN(date.getTime())) {
          // 날짜 파싱 실패 시 현재 날짜 사용
          isoDate = new Date().toISOString().split('T')[0];
        } else {
          isoDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        }
      } catch {
        // 오류 발생 시 현재 날짜 사용
        isoDate = new Date().toISOString().split('T')[0];
      }
      
      properties['date'] = {
        date: {
          start: isoDate,
        },
      };
    }

    // 한글 요약 추가 (있는 경우)
    if (newsItem.summary) {
      properties['한 줄 요약'] = {
        rich_text: [
          {
            text: {
              content: newsItem.summary,
            },
          },
        ],
      };
    }

    // 국가 정보 추가 (있는 경우)
    if (newsItem.country) {
      properties['국가'] = {
        rich_text: [
          {
            text: {
              content: newsItem.country,
            },
          },
        ],
      };
    }

    await createPage(properties);
    console.log(`✓ 뉴스 저장 완료: ${newsItem.title}`);
  } catch (error) {
    console.error(`뉴스 저장 실패 (${newsItem.title}):`, error);
    throw error;
  }
}

/**
 * 여러 뉴스 소스에서 수집하여 Notion에 저장
 */
export async function collectAndSaveNews(feedConfigs: Array<{ url: string; name: string }>) {
  const allNews: NewsItem[] = [];

  // 모든 피드에서 뉴스 수집
  for (const config of feedConfigs) {
    const news = await collectNewsFromRSS(config.url, config.name);
    allNews.push(...news);
  }

  // 중복 제거 (링크 기준)
  const uniqueNews = Array.from(
    new Map(allNews.map((item) => [item.link, item])).values()
  );

  // Notion에 저장
  for (const newsItem of uniqueNews) {
    try {
      // AI로 요약과 국가 동시 추출 (설명이 있는 경우)
      if (newsItem.description) {
        console.log(`📝 AI 분석 중: ${newsItem.title.substring(0, 50)}...`);
        
        const { summary, country } = await processNewsWithAI(
          newsItem.title, 
          newsItem.description,
          newsItem.source
        );
        
        if (summary) {
          newsItem.summary = summary;
          console.log(`✓ 요약 완료: ${summary}`);
        }
        
        newsItem.country = country;
        console.log(`✓ 국가 추출: ${country}`);
        
        // API rate limit 고려하여 약간의 지연
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await saveNewsToNotion(newsItem);
      // API rate limit 고려하여 약간의 지연
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error('뉴스 저장 중 오류:', error);
    }
  }

  console.log(`\n총 ${uniqueNews.length}개의 뉴스를 수집하고 저장했습니다.`);
  return uniqueNews;
}
