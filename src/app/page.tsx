'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { NewsItem } from '@/types/news';
import NewsPanel from '@/components/NewsPanel';
import ViewToggle from '@/components/ViewToggle';
import Header from '@/components/Header';

// Three.js 컴포넌트는 클라이언트에서만 로드
const Globe3D = dynamic(() => import('@/components/Globe3D'), { 
  ssr: false,
  loading: () => <GlobeLoading />
});

const WorldMap2D = dynamic(() => import('@/components/WorldMap2D'), { 
  ssr: false,
  loading: () => <MapLoading />
});

function GlobeLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 border-4 border-cosmos-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cosmos-300 font-display">지구본 로딩 중...</p>
      </div>
    </div>
  );
}

function MapLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 border-4 border-cosmos-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cosmos-300 font-display">세계지도 로딩 중...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [hoveredNews, setHoveredNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // 뉴스 데이터 fetch
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data.news || []);
      } catch (error) {
        console.error('뉴스 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsPanelOpen(true);
  };

  const handleNewsHover = (newsItem: NewsItem | null) => {
    setHoveredNews(newsItem);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 헤더 */}
      <Header newsCount={news.length} />

      {/* 뷰 토글 버튼 */}
      <ViewToggle viewMode={viewMode} onToggle={setViewMode} />

      {/* 메인 지도/지구본 영역 */}
      <div className="absolute inset-0 z-0">
        {viewMode === '3d' ? (
          <Globe3D
            news={news}
            onNewsClick={handleNewsClick}
            onNewsHover={handleNewsHover}
          />
        ) : (
          <WorldMap2D
            news={news}
            onNewsClick={handleNewsClick}
            onNewsHover={handleNewsHover}
          />
        )}
      </div>

      {/* 호버 툴팁 */}
      {hoveredNews && (
        <div 
          className="tooltip"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          <p className="font-semibold text-cosmos-100">{hoveredNews.title}</p>
          {hoveredNews.summary && (
            <p className="text-cosmos-300 mt-1 text-xs">{hoveredNews.summary}</p>
          )}
          <p className="text-cosmos-400 mt-1 text-xs">
            📍 {hoveredNews.country || '전세계'} • {hoveredNews.source}
          </p>
        </div>
      )}

      {/* 뉴스 상세 패널 */}
      <NewsPanel
        news={selectedNews}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        allNews={news}
        onNewsSelect={handleNewsClick}
      />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-cosmos-950/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-32 h-32 border-4 border-cosmos-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-display text-cosmos-100 mb-2">NewsDashvorld</h2>
            <p className="text-cosmos-400">전 세계 뉴스를 불러오는 중...</p>
          </div>
        </div>
      )}
    </main>
  );
}

