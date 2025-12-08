'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NewsItem } from '@/types/news';
import { 
  getCountryCoordinates, 
  latLngToVector3, 
  assignCountryToNews 
} from '@/lib/country-utils';

interface Globe3DProps {
  news: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
  onNewsHover: (news: NewsItem | null) => void;
}

// 태양 위치 계산 (실시간 낮/밤)
function getSunPosition(): THREE.Vector3 {
  const now = new Date();
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60;
  // 태양은 경도 기준으로 이동 (12시 UTC = 경도 0도)
  const sunLng = (12 - hours) * 15;
  // 계절에 따른 태양 위도 (간단화)
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const sunLat = 23.45 * Math.cos((dayOfYear - 172) * 2 * Math.PI / 365);
  
  const [x, y, z] = latLngToVector3(sunLat, sunLng, 5);
  return new THREE.Vector3(x, y, z);
}

// 지구 컴포넌트
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // 자동 회전
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.02;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.025;
    }
  });

  // 텍스처 생성 (단색 기반)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // 바다 색상
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 대륙 근사치 (간단한 패턴)
    ctx.fillStyle = '#2d5a45';
    // 북미
    ctx.beginPath();
    ctx.ellipse(200, 150, 100, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    // 남미
    ctx.beginPath();
    ctx.ellipse(280, 350, 50, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    // 유럽/아프리카
    ctx.beginPath();
    ctx.ellipse(520, 200, 60, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    // 아시아
    ctx.beginPath();
    ctx.ellipse(750, 150, 150, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    // 호주
    ctx.beginPath();
    ctx.ellipse(850, 350, 50, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  return (
    <group>
      {/* 지구 본체 */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      {/* 구름 레이어 */}
      <Sphere ref={cloudsRef} args={[1.01, 32, 32]}>
        <meshStandardMaterial
          transparent
          opacity={0.15}
          color="#ffffff"
        />
      </Sphere>

      {/* 대기권 글로우 */}
      <Sphere ref={atmosphereRef} args={[1.05, 32, 32]}>
        <meshBasicMaterial
          color="#4a90d9"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// 뉴스 마커 컴포넌트
function NewsMarker({ 
  news, 
  onClick, 
  onHover 
}: { 
  news: NewsItem; 
  onClick: () => void; 
  onHover: (hovered: boolean) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const country = assignCountryToNews(news);
  const coords = getCountryCoordinates(country);
  
  if (!coords) return null;

  // 약간의 랜덤 오프셋 추가 (같은 국가의 뉴스가 겹치지 않도록)
  const offset = useMemo(() => ({
    lat: (Math.random() - 0.5) * 5,
    lng: (Math.random() - 0.5) * 5,
  }), []);

  const position = latLngToVector3(
    coords.lat + offset.lat, 
    coords.lng + offset.lng, 
    1.02
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
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
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? '#fbbf24' : '#ef4444'} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* 펄스 효과 */}
      <mesh>
        <ringGeometry args={[0.02, 0.04, 32]} />
        <meshBasicMaterial 
          color="#ef4444" 
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 호버 시 툴팁 */}
      {hovered && (
        <Html
          position={[0, 0.1, 0]}
          center
          style={{
            pointerEvents: 'none',
          }}
        >
          <div className="bg-cosmos-900/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-cosmos-600/50 shadow-lg min-w-[200px] max-w-[280px]">
            <p className="text-sm font-semibold text-cosmos-100 line-clamp-2">{news.title}</p>
            {news.summary && (
              <p className="text-xs text-cosmos-400 mt-1 line-clamp-2">{news.summary}</p>
            )}
            <p className="text-xs text-cosmos-500 mt-1">
              📍 {country} • {news.source}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// 조명 설정
function Lights() {
  const sunPosition = useMemo(() => getSunPosition(), []);
  
  return (
    <>
      {/* 태양광 (실시간 위치) */}
      <directionalLight
        position={sunPosition}
        intensity={2}
        color="#fff5e6"
        castShadow
      />
      {/* 환경광 (밤 영역도 약간 보이도록) */}
      <ambientLight intensity={0.15} color="#4a90d9" />
      {/* 배경 보조광 */}
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#6366f1" />
    </>
  );
}

// 별 배경
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
      const r = 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

// 카메라 설정
function CameraController() {
  const { camera } = useThree();
  
  useMemo(() => {
    camera.position.set(0, 0, 3);
  }, [camera]);

  return null;
}

export default function Globe3D({ news, onNewsClick, onNewsHover }: Globe3DProps) {
  return (
    <div className="w-full h-full bg-cosmos-950">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraController />
        <Lights />
        <Stars />
        
        <Earth />
        
        {/* 뉴스 마커들 */}
        {news.map((item) => (
          <NewsMarker
            key={item.id}
            news={item}
            onClick={() => onNewsClick(item)}
            onHover={(hovered) => onNewsHover(hovered ? item : null)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

