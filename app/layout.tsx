import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroChain AI",
  description:
    "Building Trust, Intelligence, and Financial Identity for Africa's Agricultural Trade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
