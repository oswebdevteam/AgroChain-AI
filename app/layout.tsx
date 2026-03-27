import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} min-h-full flex flex-col bg-(--color-forest) text-(--color-cream)`}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0a0f0a',
                color: '#fafaf5',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
