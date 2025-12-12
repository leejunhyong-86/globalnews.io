/**
 * 노션 데이터베이스의 모든 페이지를 삭제하는 스크립트
 * 
 * 실행 방법:
 * npx tsx src/scripts/clear-database.ts
 */

import { clearDatabase, getAllPages } from '../lib/notion-client.js';

async function main() {
  console.log('🚨 노션 데이터베이스 비우기 스크립트');
  console.log('=====================================\n');
  
  try {
    // 먼저 현재 페이지 수 확인
    const pages = await getAllPages();
    
    if (pages.length === 0) {
      console.log('✅ 데이터베이스가 이미 비어있습니다.');
      return;
    }
    
    console.log(`⚠️  현재 ${pages.length}개의 뉴스가 있습니다.`);
    console.log('⚠️  이 작업은 되돌릴 수 없습니다!\n');
    
    // 5초 대기 (취소 기회 제공)
    console.log('5초 후 삭제를 시작합니다... (Ctrl+C로 취소)');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 삭제 실행
    const deletedCount = await clearDatabase();
    
    console.log('\n=====================================');
    console.log(`🎉 완료! ${deletedCount}개의 뉴스가 삭제되었습니다.`);
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
