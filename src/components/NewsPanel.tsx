'use client';

import { NewsItem } from '@/types/news';

interface NewsPanelProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  allNews: NewsItem[];
  onNewsSelect: (news: NewsItem) => void;
}

export default function NewsPanel({
  news,
  isOpen,
  onClose,
  allNews,
  onNewsSelect,
}: NewsPanelProps) {
  // 국가별로 뉴스 그룹화
  const newsByCountry = allNews.reduce((acc, item) => {
    const country = item.country || '기타';
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(item);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-cosmos-950/95 backdrop-blur-xl border-l border-cosmos-700/50 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-cosmos-700/50">
          <h2 className="text-xl font-display font-bold text-cosmos-100">
            {news ? '뉴스 상세' : '전체 뉴스'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cosmos-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-cosmos-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="h-[calc(100%-64px)] overflow-y-auto p-4">
          {news ? (
            // 선택된 뉴스 상세
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-cosmos-700/50 rounded-full text-cosmos-300">
                  📍 {news.country || '전세계'}
                </span>
                <span className="px-2 py-1 bg-cosmos-700/50 rounded-full text-cosmos-300">
                  {news.source}
                </span>
                {news.date && (
                  <span className="text-cosmos-400">
                    {new Date(news.date).toLocaleDateString('ko-KR')}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-cosmos-100 leading-tight">
                {news.title}
              </h3>

              {news.summary && (
                <div className="p-4 bg-cosmos-800/50 rounded-xl border border-cosmos-600/30">
                  <p className="text-sm text-cosmos-400 mb-1">📝 AI 요약</p>
                  <p className="text-cosmos-200">{news.summary}</p>
                </div>
              )}

              {news.description && (
                <p className="text-cosmos-300 leading-relaxed">
                  {news.description}
                </p>
              )}

              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>원문 보기</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* 같은 국가의 다른 뉴스 */}
              {news.country && newsByCountry[news.country]?.length > 1 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-cosmos-400 mb-3">
                    {news.country}의 다른 뉴스
                  </h4>
                  <div className="space-y-2">
                    {newsByCountry[news.country]
                      .filter((n) => n.id !== news.id)
                      .slice(0, 3)
                      .map((n) => (
                        <button
                          key={n.id}
                          onClick={() => onNewsSelect(n)}
                          className="w-full text-left p-3 bg-cosmos-800/30 hover:bg-cosmos-700/30 rounded-lg transition-colors"
                        >
                          <p className="text-sm text-cosmos-200 line-clamp-2">
                            {n.title}
                          </p>
                          <p className="text-xs text-cosmos-500 mt-1">
                            {n.source}
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 전체 뉴스 목록 (국가별 그룹)
            <div className="space-y-6">
              {Object.entries(newsByCountry).map(([country, newsItems]) => (
                <div key={country}>
                  <h3 className="text-sm font-semibold text-cosmos-400 mb-2 flex items-center gap-2">
                    <span>📍 {country}</span>
                    <span className="px-1.5 py-0.5 bg-cosmos-700/50 rounded text-xs">
                      {newsItems.length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {newsItems.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => onNewsSelect(n)}
                        className="news-card w-full text-left"
                      >
                        <p className="text-sm font-medium text-cosmos-100 line-clamp-2">
                          {n.title}
                        </p>
                        {n.summary && (
                          <p className="text-xs text-cosmos-400 mt-1 line-clamp-1">
                            {n.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-cosmos-500">
                          <span>{n.source}</span>
                          {n.date && (
                            <>
                              <span>•</span>
                              <span>{new Date(n.date).toLocaleDateString('ko-KR')}</span>
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 뉴스 목록 열기 버튼 */}
      {!isOpen && (
        <button
          onClick={() => onClose()}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-cosmos-800/80 backdrop-blur-md rounded-l-xl border border-r-0 border-cosmos-600/50 hover:bg-cosmos-700/80 transition-colors"
          title="뉴스 목록 열기"
        >
          <svg className="w-5 h-5 text-cosmos-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </button>
      )}
    </>
  );
}

