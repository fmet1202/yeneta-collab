import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yeneta - የኔታ | AI Study Assistant",
  description: "AI-powered study assistant for Ethiopian students. Upload materials, get explanations, and take quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-[#1a1a2e]">
        {children}
      </body>
    </html>
  );
}
