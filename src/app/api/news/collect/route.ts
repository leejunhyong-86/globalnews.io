import { NextRequest } from 'next/server';
import Parser from 'rss-parser';
import { Client } from '@notionhq/client';
import { newsFeeds } from '@/config/feeds';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

// Gemini API 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const parser = new Parser();

interface NewsItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source?: string;
  country?: string;
}

// AI로 뉴스 처리
async function processNewsWithAI(
  title: string,
  description?: string,
  source?: string
): Promise<{ summary: string; country: string; region?: string; city?: string }> {
  if (!GEMINI_API_KEY) {
    return { summary: '', country: source || '전세계' };
  }

  const prompt = `다음 뉴스를 분석해주세요:

제목: ${title}
내용: ${description || '(내용 없음)'}
출처: ${source || '(출처 없음)'}

다음 형식으로 JSON만 반환해주세요 (다른 설명 없이):
{
  "summary": "한국어로 된 한 줄 요약 (50자 이내)",
  "country": "뉴스가 발생한 국가명 (한국어)",
  "region": "지역/주/도 (있는 경우만, 없으면 빈 문자열)",
  "city": "도시명 (있는 경우만, 없으면 빈 문자열)"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // JSON 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || '',
        country: parsed.country || '전세계',
        region: parsed.region || undefined,
        city: parsed.city || undefined,
      };
    }
  } catch (error) {
    console.error('AI 처리 오류:', error);
  }

  return { summary: '', country: source || '전세계' };
}

// Notion에 저장
async function saveToNotion(newsItem: NewsItem, aiResult: { summary: string; country: string }) {
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

  if (aiResult.summary) {
    properties['한 줄 요약'] = {
      rich_text: [{ text: { content: aiResult.summary } }],
    };
  }

  properties['국가'] = {
    rich_text: [{ text: { content: aiResult.country || newsItem.country || '전세계' } }],
  };

  await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties,
  });
}

// 다양한 국가에서 골고루 뉴스 선택
function selectDiverseNews(news: NewsItem[], maxTotal: number): NewsItem[] {
  const byCountry: Record<string, NewsItem[]> = {};
  
  news.forEach(item => {
    const country = item.country || '기타';
    if (!byCountry[country]) byCountry[country] = [];
    byCountry[country].push(item);
  });
  
  const countries = Object.keys(byCountry);
  const result: NewsItem[] = [];
  
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

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // SSE 스트림 생성
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // 요청 파라미터 파싱
        const body = await request.json();
        const maxNews = body.count || 50;

        send({ type: 'start', message: `뉴스 수집을 시작합니다 (최대 ${maxNews}개)` });

        // 모든 피드에서 뉴스 수집
        const allNews: NewsItem[] = [];
        
        for (const feed of newsFeeds) {
          try {
            send({ type: 'feed', message: `${feed.name} (${feed.country}) 수집 중...` });
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
            send({ type: 'feed_done', source: feed.name, count: items.length });
          } catch (error) {
            send({ type: 'feed_error', source: feed.name });
          }
        }

        // 중복 제거
        const uniqueNews = Array.from(
          new Map(allNews.map(item => [item.link, item])).values()
        );

        send({ type: 'collected', total: uniqueNews.length });

        // 다양한 국가에서 골고루 선택
        const selectedNews = selectDiverseNews(uniqueNews, maxNews);
        
        send({ type: 'selected', count: selectedNews.length });

        // 뉴스 저장
        let saved = 0;
        for (const newsItem of selectedNews) {
          try {
            send({ 
              type: 'processing', 
              current: saved + 1, 
              total: selectedNews.length,
              title: newsItem.title.substring(0, 50) + (newsItem.title.length > 50 ? '...' : ''),
            });

            // AI로 요약과 위치 정보 추출
            const aiResult = await processNewsWithAI(
              newsItem.title,
              newsItem.description,
              newsItem.source
            );

            // Notion에 저장
            await saveToNotion(newsItem, aiResult);
            saved++;

            send({ 
              type: 'saved', 
              current: saved, 
              total: selectedNews.length,
              news: {
                title: newsItem.title,
                summary: aiResult.summary,
                country: aiResult.country,
                source: newsItem.source,
              }
            });

            // Rate limit 방지
            await new Promise(resolve => setTimeout(resolve, 1200));
          } catch (error) {
            send({ 
              type: 'save_error', 
              title: newsItem.title.substring(0, 30),
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        send({ type: 'complete', saved, message: `완료! ${saved}개의 뉴스가 저장되었습니다.` });
      } catch (error) {
        send({ 
          type: 'error', 
          message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export const dynamic = 'force-dynamic';
