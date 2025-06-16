import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Claw Machine Game", // 更改標題以符合您的應用
  description: "A simple claw machine game built with Next.js and Three.js", // 更改描述
};

export default function RootLayout({ children }) {
  // 在這裡添加 useEffect 來處理預載入器的隱藏邏輯
  // 由於這是 Server Component，useEffect 必須在 Client Component 中使用
  // 我們將在 app/page.js 中處理隱藏邏輯，這裡只提供 HTML 結構

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✨ Preloader DIV ✨ */}
        <div id="page-preloader" className="preloader">
          <div className="loader"></div> {/* CSS 動畫載入符號 */}
          {/* 如果你想用 GIF 作為載入符號，可以這樣： */}
          {/* <img src="/no.gif" alt="Loading..." className="loader-gif" /> */}
        </div>
        
        {children}
      </body>
    </html>
  );
}