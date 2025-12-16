'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import SunCalc from 'suncalc';
import { NewsItem } from '@/types/news';
import { 
  getCountryCoordinates, 
  assignCountryToNews,
  getDetailedCoordinates,
  MAJOR_CITIES,
  CityData,
} from '@/lib/country-utils';

interface WorldMap2DProps {
  news: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
  onNewsHover: (news: NewsItem | null) => void;
  onCountryClick?: (country: string, newsItems: NewsItem[]) => void;
}

// TopoJSON 데이터 URL (Natural Earth 110m)
const WORLD_TOPOJSON_URL = 'https://unpkg.com/world-atlas@2/countries-110m.json';

// 뉴스 클러스터 타입
interface NewsCluster {
  country: string;
  newsItems: NewsItem[];
  coords: { lat: number; lng: number };
}

// 텍스처 로딩 훅
function useEarthTextures() {
  const [dayTexture, setDayTexture] = useState<HTMLImageElement | null>(null);
  const [nightTexture, setNightTexture] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let loadedCount = 0;
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= 2) setLoading(false);
    };

    const dayImg = new Image();
    dayImg.crossOrigin = 'anonymous';
    dayImg.onload = () => { 
      console.log('Day texture loaded:', dayImg.width, 'x', dayImg.height);
      setDayTexture(dayImg); 
      checkComplete(); 
    };
    dayImg.onerror = (e) => { 
      console.error('Failed to load day texture:', e);
      setError('Day texture failed');
      checkComplete(); 
    };
    dayImg.src = '/textures/earth-day.jpg';

    const nightImg = new Image();
    nightImg.crossOrigin = 'anonymous';
    nightImg.onload = () => { 
      console.log('Night texture loaded:', nightImg.width, 'x', nightImg.height);
      setNightTexture(nightImg); 
      checkComplete(); 
    };
    nightImg.onerror = (e) => { 
      console.error('Failed to load night texture:', e);
      setError('Night texture failed');
      checkComplete(); 
    };
    nightImg.src = '/textures/earth-night.jpg';
  }, []);

  return { dayTexture, nightTexture, loading, error };
}

// TopoJSON 데이터 로딩 훅
function useWorldGeoData() {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(WORLD_TOPOJSON_URL)
      .then(res => res.json())
      .then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        setGeoData(countries);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load world data:', err);
        setLoading(false);
      });
  }, []);

  return { geoData, loading };
}

// 태양 위치 계산 (suncalc 기반)
function getSunPosition(): { lat: number; lng: number } {
  const now = new Date();
  
  // UTC 기준 시간 계산
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  
  // 태양 경도 계산: UTC 12:00에 태양은 경도 0° (그리니치) 위에 있음
  // 태양은 시간당 15° 서쪽으로 이동 (지구 자전 반대 방향으로 보임)
  // UTC 00:00 → 경도 180° (날짜변경선)
  // UTC 12:00 → 경도 0° (본초자오선)
  const sunLng = (12 - hours) * 15;
  
  // 태양 적위 (계절에 따른 위도)
  // 하지(6월 21일경, 172일째): +23.45°
  // 동지(12월 21일경, 355일째): -23.45°
  // 춘분/추분: 0°
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const sunLat = 23.45 * Math.sin((dayOfYear - 81) * 2 * Math.PI / 365);
  
  return { lat: sunLat, lng: sunLng };
}

// 특정 위치가 낮인지 밤인지 계산 (0 = 밤, 1 = 낮, 중간값 = 황혼)
function getDayFactor(lat: number, lng: number, sunPos: { lat: number; lng: number }): number {
  // 태양과의 각도 거리 계산 (구면 코사인 법칙)
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;
  const sunLatRad = sunPos.lat * Math.PI / 180;
  const sunLngRad = sunPos.lng * Math.PI / 180;
  
  const cosAngle = Math.sin(latRad) * Math.sin(sunLatRad) +
                   Math.cos(latRad) * Math.cos(sunLatRad) * Math.cos(lngRad - sunLngRad);
  
  // cosAngle > 0 이면 낮, < 0 이면 밤
  // -0.1 ~ 0.1 사이를 황혼 구간으로
  const twilightWidth = 0.15;
  return Math.max(0, Math.min(1, (cosAngle + twilightWidth) / (2 * twilightWidth)));
}

// 위경도를 캔버스 좌표로 변환 (Equirectangular 투영)
function latLngToCanvas(
  lat: number, 
  lng: number, 
  width: number, 
  height: number,
  transform: { x: number; y: number; scale: number }
): { x: number; y: number } {
  const baseX = ((lng + 180) / 360) * width;
  const baseY = ((90 - lat) / 180) * height;
  
  return {
    x: (baseX - width / 2) * transform.scale + width / 2 + transform.x,
    y: (baseY - height / 2) * transform.scale + height / 2 + transform.y
  };
}

// 캔버스 좌표를 위경도로 변환
function canvasToLatLng(
  x: number, 
  y: number, 
  width: number, 
  height: number,
  transform: { x: number; y: number; scale: number }
): { lat: number; lng: number } {
  const baseX = (x - transform.x - width / 2) / transform.scale + width / 2;
  const baseY = (y - transform.y - height / 2) / transform.scale + height / 2;
  
  const lng = (baseX / width) * 360 - 180;
  const lat = 90 - (baseY / height) * 180;
  
  return { lat, lng };
}

export default function WorldMap2D({ news, onNewsClick, onNewsHover, onCountryClick }: WorldMap2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredCluster, setHoveredCluster] = useState<NewsCluster | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const { dayTexture, nightTexture, loading: texturesLoading, error: textureError } = useEarthTextures();
  const { geoData, loading: geoLoading } = useWorldGeoData();
  
  // 드래그 상태
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startTransformX: 0, startTransformY: 0 });

  // 화면 크기 감지
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 줌 레벨에 따른 클러스터링 정밀도 결정
  // 줌이 높을수록 더 세밀하게 클러스터링 (개별 마커는 사용하지 않음)
  const clusterPrecision = useMemo(() => {
    if (transform.scale >= 6) return 2;      // 매우 높은 줌: 소수점 2자리 (약 1km 단위)
    if (transform.scale >= 4) return 1.5;    // 높은 줌: 소수점 1.5자리
    if (transform.scale >= 2) return 1;      // 중간 줌: 소수점 1자리 (약 10km 단위)
    return 0.5;                               // 기본: 소수점 0.5자리 (약 50km 단위)
  }, [transform.scale]);

  // 뉴스를 위치별로 클러스터링 (지역/도시 정보 활용, 줌 레벨에 따라 정밀도 조절)
  const clusters = useMemo(() => {
    const locationMap: Record<string, { newsItems: NewsItem[]; coords: { lat: number; lng: number }; displayName: string }> = {};
    
    news.forEach(item => {
      const country = assignCountryToNews(item);
      if (country === '전세계') return;
      
      // 상세 좌표 우선 사용
      let coords = getDetailedCoordinates(country, item.region, item.city);
      let displayName = country;
      
      // 지역/도시 정보가 있으면 표시 이름에 포함
      if (item.city) {
        displayName = `${item.city}, ${country}`;
      } else if (item.region) {
        displayName = `${item.region}, ${country}`;
      }
      
      // 상세 좌표가 없으면 국가 좌표 사용
      if (!coords) {
        const countryCoords = getCountryCoordinates(country);
        if (countryCoords && countryCoords.code !== 'GLOBAL') {
          coords = { lat: countryCoords.lat, lng: countryCoords.lng };
        }
      }
      
      if (coords) {
        // 줌 레벨에 따른 클러스터링 정밀도 적용
        // clusterPrecision이 높을수록 더 세밀하게 분리
        const precision = clusterPrecision;
        const latKey = (Math.round(coords.lat * precision) / precision).toFixed(2);
        const lngKey = (Math.round(coords.lng * precision) / precision).toFixed(2);
        const locationKey = `${latKey}_${lngKey}`;
        
        if (!locationMap[locationKey]) {
          locationMap[locationKey] = {
            newsItems: [],
            coords: coords,
            displayName: displayName
          };
        }
        locationMap[locationKey].newsItems.push(item);
        
        // 더 구체적인 이름으로 업데이트 (도시 > 지역 > 국가)
        if (item.city && !locationMap[locationKey].displayName.includes(item.city)) {
          locationMap[locationKey].displayName = `${item.city}, ${country}`;
        }
      }
    });
    
    const result: NewsCluster[] = [];
    Object.values(locationMap).forEach(({ newsItems, coords, displayName }) => {
      result.push({ country: displayName, newsItems, coords });
    });
    
    return result;
  }, [news, clusterPrecision]);

  // 낮/밤 텍스처 블렌딩 렌더링
  useEffect(() => {
    console.log('Background render effect:', { 
      hasCanvas: !!backgroundCanvasRef.current, 
      dimensions, 
      hasDayTexture: !!dayTexture, 
      hasNightTexture: !!nightTexture 
    });
    
    if (!backgroundCanvasRef.current || dimensions.width === 0) return;
    
    const canvas = backgroundCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const sunPos = getSunPosition();
    console.log('Sun position:', sunPos);
    
    // 배경 그라디언트 (우주)
    const spaceGradient = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width
    );
    spaceGradient.addColorStop(0, '#0a0f1c');
    spaceGradient.addColorStop(1, '#000510');
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // 텍스처 크기 계산 (줌/팬 적용)
    const texWidth = dimensions.width * transform.scale;
    const texHeight = dimensions.height * transform.scale;
    const texX = (dimensions.width - texWidth) / 2 + transform.x;
    const texY = (dimensions.height - texHeight) / 2 + transform.y;

    // 텍스처가 로드되지 않은 경우 대체 렌더링
    if (!dayTexture || !nightTexture) {
      console.log('Textures not loaded, rendering fallback');
      
      // 대체 바다/땅 렌더링
      const offscreen = document.createElement('canvas');
      offscreen.width = 1024;
      offscreen.height = 512;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;
      
      // 바다 색상
      const oceanGradient = offCtx.createLinearGradient(0, 0, 0, offscreen.height);
      oceanGradient.addColorStop(0, '#1a4a7a');
      oceanGradient.addColorStop(0.5, '#1a5a8a');
      oceanGradient.addColorStop(1, '#1a4a7a');
      offCtx.fillStyle = oceanGradient;
      offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
      
      // 간단한 대륙 그리기
      offCtx.fillStyle = '#3a7a5a';
      // 북미
      offCtx.beginPath();
      offCtx.ellipse(200, 180, 120, 80, 0, 0, Math.PI * 2);
      offCtx.fill();
      // 남미
      offCtx.beginPath();
      offCtx.ellipse(280, 350, 50, 100, 0, 0, Math.PI * 2);
      offCtx.fill();
      // 유럽/아프리카
      offCtx.beginPath();
      offCtx.ellipse(520, 200, 60, 100, 0, 0, Math.PI * 2);
      offCtx.fill();
      offCtx.beginPath();
      offCtx.ellipse(540, 320, 70, 80, 0, 0, Math.PI * 2);
      offCtx.fill();
      // 아시아
      offCtx.beginPath();
      offCtx.ellipse(750, 180, 150, 100, 0, 0, Math.PI * 2);
      offCtx.fill();
      // 호주
      offCtx.beginPath();
      offCtx.ellipse(850, 380, 60, 40, 0, 0, Math.PI * 2);
      offCtx.fill();
      
      ctx.drawImage(offscreen, texX, texY, texWidth, texHeight);
      return;
    }

    // 오프스크린 캔버스에서 블렌딩 처리
    const offscreen = document.createElement('canvas');
    offscreen.width = 1024;
    offscreen.height = 512;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // 낮 텍스처 그리기
    offCtx.drawImage(dayTexture, 0, 0, offscreen.width, offscreen.height);
    const dayImageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    
    // 밤 텍스처 그리기
    offCtx.drawImage(nightTexture, 0, 0, offscreen.width, offscreen.height);
    const nightImageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    
    // 블렌딩된 결과
    const resultImageData = offCtx.createImageData(offscreen.width, offscreen.height);
    
    for (let y = 0; y < offscreen.height; y++) {
      for (let x = 0; x < offscreen.width; x++) {
        const idx = (y * offscreen.width + x) * 4;
        
        // 픽셀 위치를 위경도로 변환
        const lng = (x / offscreen.width) * 360 - 180;
        const lat = 90 - (y / offscreen.height) * 180;
        
        // 낮/밤 팩터 계산
        const dayFactor = getDayFactor(lat, lng, sunPos);
        
        // 블렌딩
        resultImageData.data[idx] = dayImageData.data[idx] * dayFactor + nightImageData.data[idx] * (1 - dayFactor);
        resultImageData.data[idx + 1] = dayImageData.data[idx + 1] * dayFactor + nightImageData.data[idx + 1] * (1 - dayFactor);
        resultImageData.data[idx + 2] = dayImageData.data[idx + 2] * dayFactor + nightImageData.data[idx + 2] * (1 - dayFactor);
        resultImageData.data[idx + 3] = 255;
        
        // 황혼 효과 (주황/붉은 색조 추가)
        if (dayFactor > 0.2 && dayFactor < 0.8) {
          const twilightIntensity = 1 - Math.abs(dayFactor - 0.5) * 2;
          resultImageData.data[idx] = Math.min(255, resultImageData.data[idx] + twilightIntensity * 30);
          resultImageData.data[idx + 1] = Math.min(255, resultImageData.data[idx + 1] + twilightIntensity * 15);
        }
      }
    }
    
    // 도시 불빛 추가 (밤 영역에만)
    MAJOR_CITIES.forEach((city: CityData) => {
      const dayFactor = getDayFactor(city.lat, city.lng, sunPos);
      if (dayFactor < 0.5) { // 밤 또는 황혼
        const nightIntensity = 1 - dayFactor * 2;
        const cx = Math.floor(((city.lng + 180) / 360) * offscreen.width);
        const cy = Math.floor(((90 - city.lat) / 180) * offscreen.height);
        
        // 도시 크기 (인구 기반)
        const size = Math.max(2, Math.min(8, Math.log10(city.population) - 4));
        
        // 불빛 그리기 (방사형 그라데이션)
        for (let dy = -size * 2; dy <= size * 2; dy++) {
          for (let dx = -size * 2; dx <= size * 2; dx++) {
            const px = cx + dx;
            const py = cy + dy;
            if (px < 0 || px >= offscreen.width || py < 0 || py >= offscreen.height) continue;
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > size * 2) continue;
            
            const intensity = Math.pow(1 - dist / (size * 2), 2) * nightIntensity;
            const idx = (py * offscreen.width + px) * 4;
            
            // 따뜻한 황금색 불빛
            resultImageData.data[idx] = Math.min(255, resultImageData.data[idx] + 255 * intensity * 0.9);
            resultImageData.data[idx + 1] = Math.min(255, resultImageData.data[idx + 1] + 200 * intensity * 0.7);
            resultImageData.data[idx + 2] = Math.min(255, resultImageData.data[idx + 2] + 100 * intensity * 0.4);
          }
        }
      }
    });
    
    offCtx.putImageData(resultImageData, 0, 0);
    
    // 최종 캔버스에 그리기
    ctx.drawImage(offscreen, texX, texY, texWidth, texHeight);
    console.log('Background rendered successfully');
    
  }, [dimensions, dayTexture, nightTexture, transform]);

  // 주기적 업데이트 (1분마다 태양 위치 갱신)
  useEffect(() => {
    const interval = setInterval(() => {
      // 강제 리렌더링을 위해 transform 업데이트
      setTransform(prev => ({ ...prev }));
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // 국가 경계선 렌더링
  useEffect(() => {
    if (!overlayCanvasRef.current || dimensions.width === 0 || !geoData) return;
    
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Equirectangular 투영 설정
    const projection = d3.geoEquirectangular()
      .scale((dimensions.width / (2 * Math.PI)) * transform.scale)
      .translate([
        dimensions.width / 2 + transform.x,
        dimensions.height / 2 + transform.y
      ]);

    const path = d3.geoPath().projection(projection).context(ctx);

    // 국가 경계선 그리기
    ctx.beginPath();
    path(geoData);
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 격자선 (위도/경도)
    const graticule = d3.geoGraticule().step([30, 30]);
    ctx.beginPath();
    path(graticule());
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.15)';
    ctx.lineWidth = 0.3;
    ctx.stroke();

  }, [dimensions, geoData, transform]);

  // 팬(이동) 제한 함수 - 지도가 화면 밖으로 나가지 않도록
  const clampTransform = useCallback((x: number, y: number, scale: number) => {
    if (scale <= 1) {
      // 100% 이하에서는 이동 불가
      return { x: 0, y: 0 };
    }
    
    // 지도가 화면을 벗어나지 않도록 제한
    const mapWidth = dimensions.width * scale;
    const mapHeight = dimensions.height * scale;
    
    // 최대 이동 가능 범위 계산
    const maxX = (mapWidth - dimensions.width) / 2;
    const maxY = (mapHeight - dimensions.height) / 2;
    
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  }, [dimensions]);

  // 드래그 가능 여부 (줌 레벨이 1보다 클 때만)
  const canDrag = transform.scale > 1;

  // 마우스/터치 이벤트 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canDrag) return; // 100% 줌에서는 드래그 불가
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startTransformX: transform.x,
      startTransformY: transform.y
    };
  }, [transform, canDrag]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canDrag || !dragRef.current.isDragging) return;
    
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    const newX = dragRef.current.startTransformX + dx;
    const newY = dragRef.current.startTransformY + dy;
    
    // 팬 제한 적용
    const clamped = clampTransform(newX, newY, transform.scale);
    
    setTransform(prev => ({
      ...prev,
      x: clamped.x,
      y: clamped.y
    }));
  }, [canDrag, clampTransform, transform.scale]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.isDragging = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    // 최소 줌 레벨을 1로 설정 (지도가 화면을 완전히 채움)
    const newScale = Math.max(1, Math.min(8, transform.scale * delta));
    
    // 마우스 위치 기준으로 줌 (마우스 포인터 아래 지점이 고정되도록)
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      // 마우스의 화면 내 좌표
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 화면 중심점
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      // 마우스 위치의 중심 기준 상대 좌표
      const relX = mouseX - centerX;
      const relY = mouseY - centerY;
      
      // 현재 마우스가 가리키는 지도 상의 위치 (정규화된 좌표)
      const mapX = (relX - transform.x) / transform.scale;
      const mapY = (relY - transform.y) / transform.scale;
      
      // 새로운 스케일에서 같은 지도 위치가 마우스 아래에 오도록 transform 계산
      let newX = relX - mapX * newScale;
      let newY = relY - mapY * newScale;
      
      // 팬 제한 적용
      const clamped = clampTransform(newX, newY, newScale);
      
      setTransform({
        x: clamped.x,
        y: clamped.y,
        scale: newScale
      });
    }
  }, [transform, clampTransform, dimensions]);

  // 클러스터 클릭 핸들러
  const handleClusterClick = useCallback((cluster: NewsCluster) => {
    setSelectedCountry(cluster.country);
    
    if (onCountryClick) {
      onCountryClick(cluster.country, cluster.newsItems);
    } else if (cluster.newsItems.length > 0) {
      onNewsClick(cluster.newsItems[0]);
    }
  }, [onCountryClick, onNewsClick]);

  // 리셋 버튼
  const handleReset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
    setSelectedCountry(null);
  }, []);

  // 로딩 상태 체크
  const isLoading = texturesLoading || geoLoading;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-cosmos-950 overflow-hidden ${canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-cosmos-950/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cosmos-600 border-t-cosmos-300 rounded-full animate-spin" />
            <p className="text-cosmos-400 text-sm">지도 로딩 중...</p>
          </div>
        </div>
      )}
      {/* 배경 캔버스 (텍스처 + 낮/밤) */}
      <canvas
        ref={backgroundCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* 오버레이 캔버스 (국가 경계선) */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 마커 레이어 */}
      <div ref={markersRef} className="absolute inset-0 pointer-events-none">
        {clusters.map((cluster, idx) => {
          const pos = latLngToCanvas(cluster.coords.lat, cluster.coords.lng, dimensions.width, dimensions.height, transform);
          const isSelected = selectedCountry === cluster.country;
          const isHovered = hoveredCluster?.country === cluster.country;
          
          // 뉴스 개수
          const count = cluster.newsItems.length;
          
          // 줌 레벨에 따른 마커 크기 조정
          const baseSize = transform.scale >= 4 ? 28 : transform.scale >= 2 ? 32 : 36;
          const size = Math.min(52, Math.max(baseSize, baseSize - 4 + count * 1.5));
          
          // 색상 그라디언트 (뉴스 개수에 따라)
          let gradientColors = 'from-emerald-400 to-emerald-600';
          let glowColor = 'shadow-emerald-500/50';
          if (count >= 10) {
            gradientColors = 'from-rose-400 to-rose-600';
            glowColor = 'shadow-rose-500/50';
          } else if (count >= 5) {
            gradientColors = 'from-amber-400 to-orange-500';
            glowColor = 'shadow-amber-500/50';
          } else if (count >= 3) {
            gradientColors = 'from-yellow-400 to-yellow-500';
            glowColor = 'shadow-yellow-500/50';
          }

          return (
            <div
              key={`cluster-${idx}-${cluster.country}`}
              className="absolute pointer-events-auto"
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
              }}
            >
              {/* 글로우 효과 */}
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientColors} opacity-40 blur-sm`}
                style={{ transform: 'scale(1.3)' }}
              />
              
              {/* 펄스 효과 (선택/호버 시 또는 뉴스 5개 이상) */}
              {(isSelected || isHovered || count >= 5) && (
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientColors} opacity-30 animate-ping`}
                  style={{ animationDuration: '2s' }}
                />
              )}
              
              {/* 메인 마커 */}
              <button
                className={`
                  absolute inset-0 rounded-full 
                  bg-gradient-to-br ${gradientColors}
                  flex items-center justify-center
                  transition-all duration-200 cursor-pointer
                  border-2 border-white/70 
                  shadow-lg ${glowColor}
                  backdrop-blur-sm
                  ${isSelected || isHovered ? 'scale-110 ring-2 ring-white/80' : 'hover:scale-105'}
                `}
                onClick={() => handleClusterClick(cluster)}
                onMouseEnter={(e) => {
                  setHoveredCluster(cluster);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                  if (cluster.newsItems.length > 0) onNewsHover(cluster.newsItems[0]);
                }}
                onMouseLeave={() => {
                  setHoveredCluster(null);
                  onNewsHover(null);
                }}
              >
                <span className="text-white font-bold text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {count}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 툴팁 */}
      {hoveredCluster && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 10,
          }}
        >
          <div className="bg-cosmos-900/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-cosmos-600/50 shadow-2xl min-w-[240px] max-w-[320px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📍</span>
              <span className="font-bold text-cosmos-100 text-lg">{hoveredCluster.country}</span>
              <span className="ml-auto px-2 py-1 bg-gradient-to-r from-cosmos-700 to-cosmos-600 rounded-full text-xs font-semibold text-cosmos-100">
                {hoveredCluster.newsItems.length}개 뉴스
              </span>
            </div>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              {hoveredCluster.newsItems.slice(0, 4).map((news, i) => (
                <p key={i} className="text-xs text-cosmos-300 line-clamp-2 leading-relaxed">
                  • {news.title}
                </p>
              ))}
              {hoveredCluster.newsItems.length > 4 && (
                <p className="text-xs text-cosmos-500 font-medium">
                  +{hoveredCluster.newsItems.length - 4}개 더 보기...
                </p>
              )}
            </div>
            <p className="text-xs text-cosmos-400 mt-2 pt-2 border-t border-cosmos-700">
              🖱️ 클릭하여 상세 보기
            </p>
          </div>
        </div>
      )}

      {/* 컨트롤 버튼 - 헤더 아래에 위치 */}
      <div className="absolute top-24 right-4 flex flex-col gap-2 z-10">
        {/* 줌 인 */}
        <button
          onClick={() => {
            const newScale = Math.min(8, transform.scale * 1.3);
            const clamped = clampTransform(transform.x, transform.y, newScale);
            setTransform({ ...clamped, scale: newScale });
          }}
          className="w-10 h-10 bg-cosmos-800/90 hover:bg-cosmos-700/90 text-cosmos-100 
                     rounded-lg border border-cosmos-600/50 backdrop-blur-sm 
                     flex items-center justify-center transition-all shadow-lg"
          title="확대 (Zoom In)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
          </svg>
        </button>
        {/* 줌 아웃 */}
        <button
          onClick={() => {
            const newScale = Math.max(1, transform.scale * 0.7);
            const clamped = clampTransform(transform.x, transform.y, newScale);
            setTransform({ ...clamped, scale: newScale });
          }}
          className="w-10 h-10 bg-cosmos-800/90 hover:bg-cosmos-700/90 text-cosmos-100 
                     rounded-lg border border-cosmos-600/50 backdrop-blur-sm 
                     flex items-center justify-center transition-all shadow-lg"
          title="축소 (Zoom Out)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        {/* 초기화 */}
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-cosmos-800/90 hover:bg-cosmos-700/90 text-cosmos-100 
                     rounded-lg border border-cosmos-600/50 backdrop-blur-sm 
                     flex items-center justify-center transition-all shadow-lg"
          title="초기화 (Reset View)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* 선택된 국가 해제 버튼 */}
      {selectedCountry && (
        <button
          onClick={() => setSelectedCountry(null)}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-cosmos-800/90 hover:bg-cosmos-700/90 
                     text-cosmos-100 text-sm rounded-lg border border-cosmos-600/50 
                     backdrop-blur-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {selectedCountry} 선택 해제
        </button>
      )}

      {/* 범례 */}
      <div className="absolute bottom-20 left-4 bg-cosmos-900/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-cosmos-700/50 z-10">
        <p className="text-xs text-cosmos-400 mb-2">범례</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-cosmos-300">1-2개</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-cosmos-300">3-4개</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-cosmos-300">5-9개</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-cosmos-300">10개+</span>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-1 border-t border-cosmos-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 rounded bg-gradient-to-r from-[#4a9a66] to-[#1a4a3a]" />
              <span className="text-xs text-cosmos-300">낮</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 rounded bg-gradient-to-r from-[#1a2a3a] to-[#050a15]" />
              <span className="text-xs text-cosmos-300">밤</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_4px_#fbbf24]" />
              <span className="text-xs text-cosmos-300">도시</span>
            </div>
          </div>
        </div>
      </div>

      {/* 줌 레벨 표시 */}
      <div className="absolute bottom-4 right-20 bg-cosmos-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-cosmos-700/50 z-10">
        <p className="text-xs text-cosmos-400">
          줌: {(transform.scale * 100).toFixed(0)}%
          {transform.scale >= 2 && <span className="ml-2 text-cosmos-300">• 상세 보기</span>}
        </p>
      </div>
    </div>
  );
}
