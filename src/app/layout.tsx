import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NewsDashvorld - 세계 뉴스 대시보드',
  description: '실시간 세계지도와 3D 지구본에서 글로벌 뉴스를 한눈에',
  keywords: ['뉴스', '세계지도', '글로벌', '대시보드', '지구본'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}

