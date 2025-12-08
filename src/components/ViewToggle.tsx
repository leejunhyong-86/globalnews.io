'use client';

interface ViewToggleProps {
  viewMode: '3d' | '2d';
  onToggle: (mode: '3d' | '2d') => void;
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 p-1 bg-cosmos-900/80 backdrop-blur-md rounded-full border border-cosmos-700/50 shadow-lg">
        <button
          onClick={() => onToggle('3d')}
          className={`toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span className="text-sm font-medium">3D 지구본</span>
        </button>
        <button
          onClick={() => onToggle('2d')}
          className={`toggle-btn ${viewMode === '2d' ? 'active' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-sm font-medium">2D 지도</span>
        </button>
      </div>
    </div>
  );
}

