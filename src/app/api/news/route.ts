import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { NewsItem } from '@/types/news';
import { assignCountryToNews, getCountryCoordinates } from '@/lib/country-utils';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export async function GET() {
  try {
    if (!DATABASE_ID) {
      return NextResponse.json(
        { error: 'NOTION_DATABASE_ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // Notion 데이터베이스에서 뉴스 조회
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'date',
          direction: 'descending',
        },
      ],
      page_size: 100,
    });

    // 결과 파싱
    const news: NewsItem[] = response.results.map((page: any) => {
      const properties = page.properties;

      // 각 속성에서 값 추출
      const title = properties['name']?.title?.[0]?.text?.content || '제목 없음';
      const url = properties['URL']?.url || '';
      const description = properties['설명']?.rich_text?.[0]?.text?.content || '';
      const source = properties['출처']?.rich_text?.[0]?.text?.content || '';
      const date = properties['date']?.date?.start || '';
      const summary = properties['한 줄 요약']?.rich_text?.[0]?.text?.content || '';
      
      // 국가 필드가 있으면 사용, 없으면 출처에서 추정
      let country = properties['국가']?.rich_text?.[0]?.text?.content || '';
      if (!country) {
        country = assignCountryToNews({ source });
      }

      // 좌표 가져오기
      const coords = getCountryCoordinates(country);

      return {
        id: page.id,
        title,
        url,
        description,
        source,
        date,
        summary,
        country,
        coordinates: coords ? { lat: coords.lat, lng: coords.lng } : undefined,
      };
    });

    return NextResponse.json({ 
      news,
      total: news.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('뉴스 조회 실패:', error);
    return NextResponse.json(
      { 
        error: '뉴스를 불러오는데 실패했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 캐시 무효화 설정 (실시간 데이터)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

