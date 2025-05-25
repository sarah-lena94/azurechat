import { AI_DESCRIPTION, AI_NAME } from "@/features/theme/theme-config";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: AI_NAME,
  description: AI_DESCRIPTION,
}

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-inter`}>
          {children}
      </body>
    </html>
  )
}
