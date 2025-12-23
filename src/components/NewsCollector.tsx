'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface CollectedNews {
  title: string;
  summary: string;
  country: string;
  source: string;
}

interface NewsCollectorProps {
  onNewsCollected?: () => void; // 수집 완료 후 뉴스 목록 새로고침
}

export default function NewsCollector({ onNewsCollected }: NewsCollectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [selectedCount, setSelectedCount] = useState<number>(50);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [status, setStatus] = useState<string>('');
  const [recentNews, setRecentNews] = useState<CollectedNews[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const newsListRef = useRef<HTMLDivElement>(null);

  // 새 뉴스가 추가될 때 스크롤
  useEffect(() => {
    if (newsListRef.current && recentNews.length > 0) {
      newsListRef.current.scrollTop = newsListRef.current.scrollHeight;
    }
  }, [recentNews]);

  const startCollection = useCallback(async () => {
    setIsCollecting(true);
    setProgress({ current: 0, total: 0 });
    setRecentNews([]);
    setError(null);
    setStatus('수집 준비 중...');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/news/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: selectedCount }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('응답 스트림을 읽을 수 없습니다.');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              handleSSEMessage(data);
            } catch (e) {
              console.error('SSE 파싱 오류:', e);
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setStatus('수집이 취소되었습니다.');
      } else {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
        setStatus('오류가 발생했습니다.');
      }
    } finally {
      setIsCollecting(false);
      abortControllerRef.current = null;
    }
  }, [selectedCount]);

  const handleSSEMessage = (data: any) => {
    switch (data.type) {
      case 'start':
        setStatus(data.message);
        break;
      case 'feed':
        setStatus(data.message);
        break;
      case 'feed_done':
        setStatus(`${data.source}: ${data.count}개 수집 완료`);
        break;
      case 'feed_error':
        setStatus(`${data.source}: 수집 실패`);
        break;
      case 'collected':
        setStatus(`총 ${data.total}개 수집됨 (중복 제거)`);
        break;
      case 'selected':
        setProgress({ current: 0, total: data.count });
        setStatus(`${data.count}개 뉴스 저장 시작...`);
        break;
      case 'processing':
        setProgress({ current: data.current, total: data.total });
        setStatus(`AI 분석 중: ${data.title}`);
        break;
      case 'saved':
        setProgress({ current: data.current, total: data.total });
        setRecentNews(prev => [...prev, data.news].slice(-10)); // 최근 10개만 유지
        setStatus(`저장 완료 (${data.current}/${data.total})`);
        break;
      case 'save_error':
        setStatus(`저장 실패: ${data.title}`);
        break;
      case 'complete':
        setStatus(data.message);
        if (onNewsCollected) {
          setTimeout(onNewsCollected, 1000);
        }
        break;
      case 'error':
        setError(data.message);
        setStatus('오류 발생');
        break;
    }
  };

  const stopCollection = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const countOptions = [30, 50, 100];

  return (
    <div 
      className="fixed right-4 z-[9999]"
      style={{ 
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)',
      }}
    >
      {/* 메인 버튼 - 모바일에서 더 크고 눈에 띄게 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-2xl
          flex items-center justify-center
          transition-all duration-300
          border-2 border-white/30
          ${isOpen 
            ? 'bg-cosmos-700 rotate-45' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500'}
          ${isCollecting ? 'animate-pulse' : ''}
        `}
        title="뉴스 수집"
        style={{ 
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5)',
        }}
      >
        {isCollecting ? (
          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
        )}
      </button>

      {/* 패널 */}
      {isOpen && (
        <div 
          className="fixed right-4 w-[calc(100vw-2rem)] max-w-80 bg-cosmos-900/95 backdrop-blur-md rounded-xl border border-cosmos-700/50 shadow-2xl overflow-hidden animate-slideUp z-[9999]"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 170px)',
            maxHeight: 'calc(100vh - 200px)',
          }}
        >
          {/* 헤더 */}
          <div className="p-4 border-b border-cosmos-700/50 bg-gradient-to-r from-cosmos-800/50 to-cosmos-900/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-cosmos-100 flex items-center gap-2">
                  <span className="text-xl">📰</span>
                  뉴스 수집
                </h3>
                <p className="text-xs text-cosmos-400 mt-1">
                  전 세계 뉴스를 실시간으로 수집합니다
                </p>
              </div>
              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg 
                         bg-cosmos-800/50 hover:bg-cosmos-700/50 
                         text-cosmos-400 hover:text-cosmos-100
                         transition-all duration-200"
                title="닫기"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="p-4 space-y-4">
            {/* 개수 선택 */}
            <div>
              <label className="block text-sm text-cosmos-300 mb-2">수집할 뉴스 개수</label>
              <div className="flex gap-2">
                {countOptions.map(count => (
                  <button
                    key={count}
                    onClick={() => setSelectedCount(count)}
                    disabled={isCollecting}
                    className={`
                      flex-1 py-2 px-3 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${selectedCount === count
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                        : 'bg-cosmos-800 text-cosmos-300 hover:bg-cosmos-700 hover:text-cosmos-100'}
                      ${isCollecting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {count}개
                  </button>
                ))}
              </div>
            </div>

            {/* 진행 상태 */}
            {(isCollecting || progress.total > 0) && (
              <div className="space-y-2">
                {/* 프로그레스 바 */}
                <div className="h-2 bg-cosmos-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%' }}
                  />
                </div>
                
                {/* 상태 메시지 */}
                <p className="text-xs text-cosmos-400 truncate">
                  {status}
                </p>

                {/* 진행률 */}
                {progress.total > 0 && (
                  <p className="text-sm text-cosmos-300 font-medium">
                    {progress.current} / {progress.total} ({Math.round((progress.current / progress.total) * 100)}%)
                  </p>
                )}
              </div>
            )}

            {/* 최근 수집된 뉴스 */}
            {recentNews.length > 0 && (
              <div>
                <p className="text-xs text-cosmos-400 mb-2">최근 수집된 뉴스</p>
                <div 
                  ref={newsListRef}
                  className="max-h-32 overflow-y-auto space-y-1.5 pr-1"
                >
                  {recentNews.map((news, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 bg-cosmos-800/50 rounded-lg text-xs animate-fadeIn"
                    >
                      <p className="text-cosmos-200 font-medium line-clamp-1">
                        {news.title}
                      </p>
                      {news.summary && (
                        <p className="text-cosmos-400 line-clamp-1 mt-0.5">
                          {news.summary}
                        </p>
                      )}
                      <p className="text-cosmos-500 mt-0.5">
                        📍 {news.country} • {news.source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-2">
              {isCollecting ? (
                <button
                  onClick={stopCollection}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 
                           text-white font-medium transition-all duration-200"
                >
                  수집 중지
                </button>
              ) : (
                <button
                  onClick={startCollection}
                  className="flex-1 py-2.5 px-4 rounded-lg 
                           bg-gradient-to-r from-emerald-500 to-teal-600 
                           hover:from-emerald-400 hover:to-teal-500
                           text-white font-medium transition-all duration-200
                           shadow-lg shadow-emerald-500/30"
                >
                  🚀 수집 시작
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
