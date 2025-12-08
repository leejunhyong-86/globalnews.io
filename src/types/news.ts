export interface NewsItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  source?: string;
  date?: string;
  summary?: string;
  country?: string;
  // 지도 표시용 좌표
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CountryCoordinates {
  name: string;
  code: string;
  lat: number;
  lng: number;
}

export interface NewsMarkerData {
  news: NewsItem;
  position: [number, number, number]; // Three.js 좌표
}

