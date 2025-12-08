'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { NewsItem } from '@/types/news';
import { 
  getCountryCoordinates, 
  assignCountryToNews,
  COUNTRY_COORDINATES 
} from '@/lib/country-utils';

interface WorldMap2DProps {
  news: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
  onNewsHover: (news: NewsItem | null) => void;
}

// 간단한 세계지도 GeoJSON (대륙 윤곽)
const SIMPLE_WORLD_DATA = {
  type: 'FeatureCollection',
  features: [
    // 북미
    {
      type: 'Feature',
      properties: { name: 'North America' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-170, 70], [-60, 70], [-60, 15], [-100, 15], [-120, 30], [-170, 50], [-170, 70]
        ]]
      }
    },
    // 남미
    {
      type: 'Feature',
      properties: { name: 'South America' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-80, 15], [-35, 5], [-35, -55], [-75, -55], [-80, 15]
        ]]
      }
    },
    // 유럽
    {
      type: 'Feature',
      properties: { name: 'Europe' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-10, 70], [50, 70], [50, 35], [-10, 35], [-10, 70]
        ]]
      }
    },
    // 아프리카
    {
      type: 'Feature',
      properties: { name: 'Africa' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-20, 35], [50, 35], [50, -35], [10, -35], [-20, 5], [-20, 35]
        ]]
      }
    },
    // 아시아
    {
      type: 'Feature',
      properties: { name: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [50, 70], [180, 70], [180, 5], [100, 5], [50, 35], [50, 70]
        ]]
      }
    },
    // 오세아니아
    {
      type: 'Feature',
      properties: { name: 'Oceania' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [110, 5], [180, 5], [180, -50], [110, -50], [110, 5]
        ]]
      }
    },
  ]
};

// 낮/밤 경계 계산
function getDayNightTerminator(): [number, number][] {
  const now = new Date();
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
  // 태양의 경도 (12시 UTC = 경도 0도)
  const sunLng = ((12 - hours) * 15 + 360) % 360 - 180;
  // 계절에 따른 태양 적위
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = 23.45 * Math.cos((dayOfYear - 172) * 2 * Math.PI / 365);
  
  const points: [number, number][] = [];
  
  // 밤 영역의 경계선 생성
  for (let lat = -90; lat <= 90; lat += 2) {
    // 간단한 근사: 태양 반대편이 밤
    const nightLng = (sunLng + 180 + 360) % 360 - 180;
    
    // 위도에 따른 밤 영역 조정
    const adjustedLng = nightLng + Math.sin(lat * Math.PI / 180) * 30;
    points.push([adjustedLng, lat]);
  }
  
  return points;
}

export default function WorldMap2D({ news, onNewsClick, onNewsHover }: WorldMap2DProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNews, setHoveredNews] = useState<NewsItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 화면 크기 감지
  useEffect(() => {
    function handleResize() {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 뉴스를 국가별로 그룹화하고 좌표 추가
  const newsWithCoords = useMemo(() => {
    const result: Array<NewsItem & { lat: number; lng: number }> = [];
    const countryOffsets: Record<string, number> = {};
    
    news.forEach((item) => {
      const country = assignCountryToNews(item);
      const coords = getCountryCoordinates(country);
      
      if (coords && coords.code !== 'GLOBAL') {
        // 같은 국가의 뉴스가 겹치지 않도록 오프셋 추가
        if (!countryOffsets[country]) {
          countryOffsets[country] = 0;
        }
        const offset = countryOffsets[country]++ * 3;
        
        result.push({
          ...item,
          country,
          lat: coords.lat + (Math.random() - 0.5) * 5 + offset % 10,
          lng: coords.lng + (Math.random() - 0.5) * 5,
        });
      }
    });
    
    return result;
  }, [news]);

  // 지도 렌더링
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    
    // 투영 설정
    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // 배경 그라디언트
    const defs = svg.append('defs');
    
    // 바다 그라디언트
    const oceanGradient = defs.append('radialGradient')
      .attr('id', 'oceanGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '70%');
    oceanGradient.append('stop').attr('offset', '0%').attr('stop-color', '#1e3a5f');
    oceanGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0c1445');

    // 바다 배경
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#oceanGradient)');

    // 격자선 (위도/경도)
    const graticule = d3.geoGraticule();
    svg.append('path')
      .datum(graticule())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(97, 114, 243, 0.15)')
      .attr('stroke-width', 0.5);

    // 대륙 렌더링
    svg.selectAll('.continent')
      .data(SIMPLE_WORLD_DATA.features)
      .enter()
      .append('path')
      .attr('class', 'continent')
      .attr('d', path as any)
      .attr('fill', '#1a4a3a')
      .attr('stroke', '#2d5a45')
      .attr('stroke-width', 1);

    // 낮/밤 영역 표시
    const nightArea = getDayNightTerminator();
    const nightPath = d3.line<[number, number]>()
      .x(d => projection(d)?.[0] || 0)
      .y(d => projection(d)?.[1] || 0)
      .curve(d3.curveCardinal);

    // 밤 영역 오버레이 (반투명 검정)
    const now = new Date();
    const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const nightCenterLng = ((12 - hours) * 15 + 180 + 360) % 360 - 180;
    
    // 밤 영역을 나타내는 반원
    svg.append('ellipse')
      .attr('cx', projection([nightCenterLng, 0])?.[0] || width / 2)
      .attr('cy', height / 2)
      .attr('rx', width / 4)
      .attr('ry', height / 2)
      .attr('fill', 'rgba(5, 10, 26, 0.6)')
      .attr('filter', 'blur(30px)');

  }, [dimensions]);

  // 뉴스 마커 렌더링 (별도 레이어)
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || newsWithCoords.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    
    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.5)
      .translate([width / 2, height / 2]);

    // 기존 마커 제거
    svg.selectAll('.news-marker-group').remove();

    // 마커 그룹 생성
    const markerGroup = svg.append('g').attr('class', 'news-marker-group');

    // 뉴스 마커 추가
    newsWithCoords.forEach((item) => {
      const pos = projection([item.lng, item.lat]);
      if (!pos) return;

      const g = markerGroup.append('g')
        .attr('transform', `translate(${pos[0]}, ${pos[1]})`)
        .style('cursor', 'pointer');

      // 펄스 효과 (외곽 원)
      g.append('circle')
        .attr('r', 12)
        .attr('fill', 'rgba(239, 68, 68, 0.2)')
        .attr('class', 'pulse-ring');

      // 마커 본체
      g.append('circle')
        .attr('r', 6)
        .attr('fill', '#ef4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('filter', 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))');

      // 이벤트 핸들러
      g.on('click', () => {
        onNewsClick(item);
      });

      g.on('mouseenter', (event) => {
        setHoveredNews(item);
        setTooltipPos({ x: event.pageX, y: event.pageY });
        g.select('circle:last-child')
          .transition()
          .duration(200)
          .attr('r', 9)
          .attr('fill', '#fbbf24');
      });

      g.on('mouseleave', () => {
        setHoveredNews(null);
        onNewsHover(null);
        g.select('circle:last-child')
          .transition()
          .duration(200)
          .attr('r', 6)
          .attr('fill', '#ef4444');
      });

      g.on('mousemove', (event) => {
        setTooltipPos({ x: event.pageX, y: event.pageY });
      });
    });

    // 펄스 애니메이션 CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-animation {
        0% { r: 8; opacity: 0.6; }
        100% { r: 20; opacity: 0; }
      }
      .pulse-ring {
        animation: pulse-animation 2s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [dimensions, newsWithCoords, onNewsClick, onNewsHover]);

  return (
    <div className="relative w-full h-full bg-cosmos-950">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="block"
      />

      {/* 툴팁 */}
      {hoveredNews && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 10,
          }}
        >
          <div className="bg-cosmos-900/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-cosmos-600/50 shadow-lg max-w-[300px]">
            <p className="text-sm font-semibold text-cosmos-100 line-clamp-2">
              {hoveredNews.title}
            </p>
            {hoveredNews.summary && (
              <p className="text-xs text-cosmos-400 mt-1 line-clamp-2">
                {hoveredNews.summary}
              </p>
            )}
            <p className="text-xs text-cosmos-500 mt-2">
              📍 {hoveredNews.country || '전세계'} • {hoveredNews.source}
            </p>
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className="absolute bottom-20 left-4 bg-cosmos-900/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-cosmos-700/50">
        <p className="text-xs text-cosmos-400 mb-2">범례</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="text-xs text-cosmos-300">뉴스 위치</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded bg-gradient-to-r from-[#1e3a5f] to-[#050a1a]" />
            <span className="text-xs text-cosmos-300">낮 → 밤</span>
          </div>
        </div>
      </div>
    </div>
  );
}

