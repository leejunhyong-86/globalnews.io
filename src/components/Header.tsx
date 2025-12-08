'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  newsCount: number;
}

export default function Header({ newsCount }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
      <div className="flex items-start justify-between">
        {/* 로고 및 타이틀 */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-cosmos-500 to-cosmos-700 flex items-center justify-center shadow-glow">
              <span className="text-2xl">🌍</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-cosmos-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-cosmos-100 tracking-wider glow-text">
              NewsDashvorld
            </h1>
            <p className="text-xs md:text-sm text-cosmos-400">
              세계 뉴스를 한눈에
            </p>
          </div>
        </div>

        {/* 시간 및 통계 */}
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-display font-bold text-cosmos-100 tracking-wider">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs md:text-sm text-cosmos-400">
            {formatDate(currentTime)}
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-cosmos-800/80 border border-cosmos-600/50 text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-cosmos-300">LIVE</span>
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-cosmos-800/80 border border-cosmos-600/50 text-xs text-cosmos-300">
              📰 {newsCount}개 뉴스
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

