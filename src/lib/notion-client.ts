import { Client } from '@notionhq/client';
import { config } from '../config/env.js';

export const notion = new Client({
  auth: config.notion.apiKey,
});

/**
 * Notion 데이터베이스에 페이지 추가
 */
export async function createPage(properties: Record<string, any>) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: config.notion.databaseId,
      },
      properties,
    });
    return response;
  } catch (error) {
    console.error('Notion 페이지 생성 실패:', error);
    throw error;
  }
}

/**
 * 데이터베이스 스키마 확인
 */
export async function getDatabase() {
  try {
    const response = await notion.databases.retrieve({
      database_id: config.notion.databaseId,
    });
    return response;
  } catch (error) {
    console.error('데이터베이스 조회 실패:', error);
    throw error;
  }
}

/**
 * 데이터베이스의 모든 페이지 조회
 */
export async function getAllPages() {
  try {
    const pages: any[] = [];
    let cursor: string | undefined = undefined;
    
    do {
      const response: any = await notion.databases.query({
        database_id: config.notion.databaseId,
        start_cursor: cursor,
        page_size: 100,
      });
      
      pages.push(...response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);
    
    return pages;
  } catch (error) {
    console.error('페이지 조회 실패:', error);
    throw error;
  }
}

/**
 * 페이지 아카이브 (삭제)
 */
export async function archivePage(pageId: string) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    return response;
  } catch (error) {
    console.error('페이지 아카이브 실패:', error);
    throw error;
  }
}

/**
 * 데이터베이스의 모든 페이지 삭제 (아카이브)
 */
export async function clearDatabase() {
  try {
    console.log('📋 데이터베이스 페이지 조회 중...');
    const pages = await getAllPages();
    
    console.log(`🗑️ 총 ${pages.length}개의 페이지를 삭제합니다...`);
    
    let deleted = 0;
    for (const page of pages) {
      await archivePage(page.id);
      deleted++;
      
      // 진행 상황 표시 (10개마다)
      if (deleted % 10 === 0) {
        console.log(`   ${deleted}/${pages.length} 삭제 완료...`);
      }
      
      // Rate limit 방지를 위한 지연
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ ${deleted}개의 페이지가 삭제되었습니다.`);
    return deleted;
  } catch (error) {
    console.error('데이터베이스 비우기 실패:', error);
    throw error;
  }
}

