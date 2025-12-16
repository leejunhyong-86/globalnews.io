'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NewsItem } from '@/types/news';
import { 
  getCountryCoordinates, 
  latLngToVector3, 
  assignCountryToNews,
  MAJOR_CITIES,
} from '@/lib/country-utils';

interface Globe3DProps {
  news: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
  onNewsHover: (news: NewsItem | null) => void;
  onCountryClick?: (country: string, newsItems: NewsItem[]) => void;
}

// 텍스처 URL 설정
const TEXTURE_SOURCES = {
  day: ['/textures/earth-day.jpg'],
  night: ['/textures/earth-night.jpg'],
  clouds: ['/textures/earth-clouds.jpg'],
};

// 태양 방향 계산 (실시간 낮/밤)
function getSunDirection(): THREE.Vector3 {
  const now = new Date();
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
  
  // 태양 경도: UTC 12시 = 경도 0 (그리니치)
  const sunLng = (12 - hours) * 15;
  
  // 태양 위도 (계절에 따라 -23.45 ~ +23.45)
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const sunLat = 23.45 * Math.cos((dayOfYear - 172) * 2 * Math.PI / 365);
  
  const latRad = sunLat * Math.PI / 180;
  const lngRad = sunLng * Math.PI / 180;
  
  // Three.js SphereGeometry UV 매핑: 경도 0 = +X 방향
  return new THREE.Vector3(
    Math.cos(latRad) * Math.cos(lngRad),
    Math.sin(latRad),
    -Math.cos(latRad) * Math.sin(lngRad)
  ).normalize();
}

// 위경도를 텍스처 좌표로 변환
function latLngToUV(lat: number, lng: number): { u: number; v: number } {
  const u = (lng + 180) / 360;
  const v = 1 - (lat + 90) / 180;
  return { u, v };
}

// Canvas 기반 낮 텍스처 (Fallback)
function createDayTextureCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 1200);
  oceanGradient.addColorStop(0, '#1a5a8a');
  oceanGradient.addColorStop(0.5, '#1a4d7c');
  oceanGradient.addColorStop(1, '#102840');
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 대륙 (간소화)
  ctx.fillStyle = '#4a9a66';
  [[180, 80, 400, 180], [380, 380, 480, 480], [980, 120, 1120, 200], 
   [1000, 300, 1180, 440], [1140, 100, 1800, 200], [1640, 580, 1880, 680]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.ellipse((x1+x2)/2, (y1+y2)/2, Math.abs(x2-x1)/2, Math.abs(y2-y1)/2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// Canvas 기반 밤 텍스처 (Fallback)
function createNightTextureCanvas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#050a15';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#0f1a28';
  [[180, 80, 400, 180], [380, 380, 480, 480], [980, 120, 1120, 200], 
   [1000, 300, 1180, 440], [1140, 100, 1800, 200], [1640, 580, 1880, 680]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.ellipse((x1+x2)/2, (y1+y2)/2, Math.abs(x2-x1)/2, Math.abs(y2-y1)/2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 도시 불빛
  MAJOR_CITIES.forEach(city => {
    const { u, v } = latLngToUV(city.lat, city.lng);
    const x = u * canvas.width;
    const y = v * canvas.height;
    const size = Math.min(20, Math.max(5, Math.log10(city.population) * 3));
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, 'rgba(255, 200, 100, 0.95)');
    gradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 텍스처 로더 훅
function useEarthTextures() {
  const [dayTexture, setDayTexture] = useState<THREE.Texture | null>(null);
  const [nightTexture, setNightTexture] = useState<THREE.Texture | null>(null);
  const [cloudsTexture, setCloudsTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    
    let loadedCount = 0;
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= 3) setLoading(false);
    };

    // 낮 텍스처
    loader.load(
      TEXTURE_SOURCES.day[0],
      (texture) => { texture.colorSpace = THREE.SRGBColorSpace; setDayTexture(texture); checkComplete(); },
      undefined,
      () => { setDayTexture(createDayTextureCanvas()); checkComplete(); }
    );

    // 밤 텍스처
    loader.load(
      TEXTURE_SOURCES.night[0],
      (texture) => { texture.colorSpace = THREE.SRGBColorSpace; setNightTexture(texture); checkComplete(); },
      undefined,
      () => { setNightTexture(createNightTextureCanvas()); checkComplete(); }
    );

    // 구름 텍스처
    loader.load(
      TEXTURE_SOURCES.clouds[0],
      (texture) => { setCloudsTexture(texture); checkComplete(); },
      undefined,
      () => { setCloudsTexture(null); checkComplete(); }
    );
  }, []);

  return { dayTexture, nightTexture, cloudsTexture, loading };
}

// 카메라 포커스 컨트롤러
interface CameraFocusState {
  targetPosition: THREE.Vector3 | null;
  targetZoom: number;
  isAnimating: boolean;
}

function CameraController({ 
  focusTarget, 
  onFocusComplete 
}: { 
  focusTarget: { lat: number; lng: number } | null;
  onFocusComplete: () => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const animationRef = useRef<CameraFocusState>({
    targetPosition: null,
    targetZoom: 2.5,
    isAnimating: false,
  });

  useEffect(() => {
    camera.position.set(0, 0, 2.5);
  }, [camera]);

  useEffect(() => {
    if (focusTarget) {
      // 위경도를 카메라 위치로 변환 (지구 밖에서 해당 지점을 바라봄)
      const [x, y, z] = latLngToVector3(focusTarget.lat, focusTarget.lng, 1.8);
      animationRef.current = {
        targetPosition: new THREE.Vector3(x, y, z),
        targetZoom: 1.8,
        isAnimating: true,
      };
    }
  }, [focusTarget]);

  useFrame(() => {
    const state = animationRef.current;
    if (state.isAnimating && state.targetPosition) {
      // 부드러운 카메라 이동
      camera.position.lerp(state.targetPosition, 0.05);
      
      // 목표 위치에 충분히 가까워지면 애니메이션 종료
      if (camera.position.distanceTo(state.targetPosition) < 0.01) {
        state.isAnimating = false;
        onFocusComplete();
      }
    }
  });

  return null;
}

// 지구 컴포넌트
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const earthRotationRef = useRef(0);
  
  const { dayTexture, nightTexture, cloudsTexture, loading } = useEarthTextures();
  const baseSunDirection = useMemo(() => getSunDirection(), []);

  const shaderMaterial = useMemo(() => {
    if (!dayTexture || !nightTexture) return null;
    
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunDirection: { value: baseSunDirection.clone() },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec3 normal = normalize(vNormal);
          float sunIntensity = dot(normal, sunDirection);
          float dayFactor = smoothstep(-0.15, 0.25, sunIntensity);
          
          vec4 dayColor = texture2D(dayTexture, vUv) * 1.15;
          vec4 nightColor = texture2D(nightTexture, vUv);
          
          float twinkle = 0.9 + 0.1 * sin(time * 3.0 + vUv.x * 80.0 + vUv.y * 60.0);
          vec4 nightWithLights = nightColor * 1.4 * twinkle;
          nightWithLights = clamp(nightWithLights, 0.0, 1.0);
          
          vec4 finalColor = mix(nightWithLights, dayColor, dayFactor);
          
          float dayLighting = 0.65 + 0.35 * max(0.0, sunIntensity);
          finalColor.rgb *= mix(1.0, dayLighting, dayFactor);
          
          float twilightZone = 1.0 - abs(sunIntensity * 2.5);
          twilightZone = pow(max(0.0, twilightZone), 2.0) * 0.25;
          finalColor.rgb += vec3(1.0, 0.5, 0.2) * twilightZone * (1.0 - dayFactor * 0.5);
          
          gl_FragColor = finalColor;
        }
      `,
    });
  }, [dayTexture, nightTexture, baseSunDirection]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.012;
      earthRotationRef.current = earthRef.current.rotation.y;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.018;
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      const rotY = earthRotationRef.current;
      const cosY = Math.cos(-rotY);
      const sinY = Math.sin(-rotY);
      
      const localSunDir = new THREE.Vector3(
        baseSunDirection.x * cosY - baseSunDirection.z * sinY,
        baseSunDirection.y,
        baseSunDirection.x * sinY + baseSunDirection.z * cosY
      );
      
      materialRef.current.uniforms.sunDirection.value.copy(localSunDir);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newSunDir = getSunDirection();
      baseSunDirection.copy(newSunDir);
    }, 60000);
    return () => clearInterval(interval);
  }, [baseSunDirection]);

  if (loading || !shaderMaterial) {
    return (
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#1a3a5c" wireframe />
      </mesh>
    );
  }

  return (
    <group>
      {/* 지구 본체 */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>

      {/* 구름 레이어 */}
      {cloudsTexture && (
        <Sphere ref={cloudsRef} args={[1.012, 48, 48]}>
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      )}

      {/* 대기 글로우 */}
      <Sphere args={[1.025, 48, 48]}>
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
              gl_FragColor = vec4(atmosphere, intensity * 0.4);
            }
          `}
        />
      </Sphere>
    </group>
  );
}

// 뉴스 클러스터 타입
interface NewsCluster {
  country: string;
  newsItems: NewsItem[];
  coords: { lat: number; lng: number };
}

// 향상된 클러스터 마커 컴포넌트 (애니메이션 + 숫자 표시)
function ClusterMarker({ 
  cluster, 
  onClick, 
  onHover,
  isSelected,
}: { 
  cluster: NewsCluster;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const clickAnimRef = useRef(0);

  const position = useMemo(() => {
    const [x, y, z] = latLngToVector3(cluster.coords.lat, cluster.coords.lng, 1.03);
    return new THREE.Vector3(x, y, z);
  }, [cluster.coords]);

  const baseSize = useMemo(() => {
    const count = cluster.newsItems.length;
    return Math.min(0.06, Math.max(0.025, 0.02 + count * 0.004));
  }, [cluster.newsItems.length]);

  const color = useMemo(() => {
    const count = cluster.newsItems.length;
    if (count >= 10) return new THREE.Color('#ef4444');
    if (count >= 5) return new THREE.Color('#f97316');
    if (count >= 3) return new THREE.Color('#eab308');
    return new THREE.Color('#22c55e');
  }, [cluster.newsItems.length]);

  // 색상 hex 값 (HTML 표시용)
  const colorHex = useMemo(() => {
    const count = cluster.newsItems.length;
    if (count >= 10) return '#ef4444';
    if (count >= 5) return '#f97316';
    if (count >= 3) return '#eab308';
    return '#22c55e';
  }, [cluster.newsItems.length]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    clickAnimRef.current = 1;
    onClick();
  }, [onClick]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // 기본 펄스 애니메이션
      const basePulse = 1 + Math.sin(time * 2 + cluster.coords.lng * 0.1) * 0.08;
      // 호버 확대
      const hoverScale = hovered ? 1.4 : 1;
      // 선택 시 확대
      const selectScale = isSelected ? 1.3 : 1;
      // 클릭 바운스 애니메이션
      const clickBounce = 1 + clickAnimRef.current * 0.3;
      
      meshRef.current.scale.setScalar(basePulse * hoverScale * selectScale * clickBounce);
      
      // 클릭 애니메이션 감쇠
      if (clickAnimRef.current > 0) {
        clickAnimRef.current *= 0.9;
        if (clickAnimRef.current < 0.01) clickAnimRef.current = 0;
      }
    }
    
    if (ringRef.current) {
      // 링 펄스 애니메이션
      const ringPulse = 1 + Math.sin(time * 3) * 0.3;
      ringRef.current.scale.setScalar(ringPulse);
      ringRef.current.rotation.z = time * 0.5;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 / ringPulse;
    }

    if (glowRef.current) {
      // 글로우 반짝임
      const glowIntensity = 0.3 + Math.sin(time * 4 + cluster.coords.lat * 0.1) * 0.15;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowIntensity;
    }
  });

  const newsCount = cluster.newsItems.length;

  return (
    <group position={position}>
      {/* 외곽 글로우 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[baseSize * 2.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* 펄스 링 */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[baseSize * 1.5, baseSize * 2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* 메인 마커 */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshBasicMaterial 
          color={hovered || isSelected ? '#fbbf24' : color} 
          transparent 
          opacity={0.95} 
        />
      </mesh>

      {/* 숫자 레이블 (항상 표시) */}
      <Html 
        position={[0, 0, 0]} 
        center 
        style={{ 
          pointerEvents: hovered || isSelected ? 'none' : 'auto',
          transform: 'scale(1)',
        }}
        distanceFactor={1.5}
      >
        <div 
          className="flex items-center justify-center cursor-pointer select-none"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colorHex}, ${colorHex}dd)`,
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: `0 0 10px ${colorHex}80, 0 2px 4px rgba(0,0,0,0.3)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onMouseEnter={() => {
            setHovered(true);
            onHover(true);
          }}
          onMouseLeave={() => {
            setHovered(false);
            onHover(false);
          }}
        >
          <span 
            className="text-white font-bold text-xs"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {newsCount}
          </span>
        </div>
      </Html>

      {/* 툴팁 (호버/선택 시) */}
      {(hovered || isSelected) && (
        <Html position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-cosmos-900/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-cosmos-600/50 shadow-2xl min-w-[240px] max-w-[320px] animate-fadeIn">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📍</span>
              <span className="font-bold text-cosmos-100 text-lg">{cluster.country}</span>
              <span className="ml-auto px-2 py-1 bg-gradient-to-r from-cosmos-700 to-cosmos-600 rounded-full text-xs font-semibold text-cosmos-100">
                {cluster.newsItems.length}개 뉴스
              </span>
            </div>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              {cluster.newsItems.slice(0, 4).map((news, i) => (
                <p key={i} className="text-xs text-cosmos-300 line-clamp-2 leading-relaxed">
                  • {news.title}
                </p>
              ))}
              {cluster.newsItems.length > 4 && (
                <p className="text-xs text-cosmos-500 font-medium">
                  +{cluster.newsItems.length - 4}개 더 보기...
                </p>
              )}
            </div>
            <p className="text-xs text-cosmos-400 mt-2 pt-2 border-t border-cosmos-700">
              🖱️ 클릭하여 상세 보기
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// 조명
function Lights() {
  const sunDirection = useMemo(() => getSunDirection(), []);
  const sunPosition = sunDirection.clone().multiplyScalar(5);
  
  return (
    <>
      <directionalLight position={sunPosition} intensity={1.5} color="#fff8e8" />
      <ambientLight intensity={0.12} color="#4a90d9" />
    </>
  );
}

// 별 배경
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      const r = 80 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      const twinkle = 0.75 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      (starsRef.current.material as THREE.PointsMaterial).opacity = twinkle;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#ffffff" transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

// 메인 Globe3D 컴포넌트
export default function Globe3D({ news, onNewsClick, onNewsHover, onCountryClick }: Globe3DProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number } | null>(null);

  const clusters = useMemo(() => {
    const countryMap: Record<string, NewsItem[]> = {};
    
    news.forEach(item => {
      const country = assignCountryToNews(item);
      if (!countryMap[country]) countryMap[country] = [];
      countryMap[country].push(item);
    });
    
    const result: NewsCluster[] = [];
    Object.entries(countryMap).forEach(([country, newsItems]) => {
      const coords = getCountryCoordinates(country);
      if (coords && country !== '전세계') {
        result.push({ country, newsItems, coords: { lat: coords.lat, lng: coords.lng } });
      }
    });
    
    return result;
  }, [news]);

  const handleClusterClick = useCallback((cluster: NewsCluster) => {
    setSelectedCountry(cluster.country);
    setFocusTarget(cluster.coords);
    
    if (onCountryClick) {
      onCountryClick(cluster.country, cluster.newsItems);
    } else if (cluster.newsItems.length > 0) {
      onNewsClick(cluster.newsItems[0]);
    }
  }, [onCountryClick, onNewsClick]);

  const handleFocusComplete = useCallback(() => {
    // 포커스 완료 후 처리
  }, []);

  return (
    <div className="w-full h-full bg-[#000510] relative">
      {/* 포커스 해제 버튼 */}
      {selectedCountry && (
        <button
          onClick={() => {
            setSelectedCountry(null);
            setFocusTarget(null);
          }}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-cosmos-800/90 hover:bg-cosmos-700/90 
                     text-cosmos-100 text-sm rounded-lg border border-cosmos-600/50 
                     backdrop-blur-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          전체 보기
        </button>
      )}

      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CameraController focusTarget={focusTarget} onFocusComplete={handleFocusComplete} />
        <Lights />
        <Stars />
        <Earth />
        
        {clusters.map((cluster) => (
          <ClusterMarker
            key={cluster.country}
            cluster={cluster}
            isSelected={selectedCountry === cluster.country}
            onClick={() => handleClusterClick(cluster)}
            onHover={(hovered) => {
              if (hovered && cluster.newsItems.length > 0) onNewsHover(cluster.newsItems[0]);
              else onNewsHover(null);
            }}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.3}
          maxDistance={4}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
