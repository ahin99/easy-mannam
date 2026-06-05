import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모일날",
  description: "친구들과 가능한 날짜를 모아 최적의 모임 날짜를 찾는 웹앱"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
