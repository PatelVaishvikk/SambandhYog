import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { PostsProvider } from "@/context/PostsContext";
import { StoriesProvider } from "@/context/StoriesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ConnectionsProvider } from "@/context/ConnectionsContext";
import MobileNav from "@/components/layout/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SambandhYog | Positive Professional Networking",
  description:
    "SambandhYog is a career-first social platform for sharing achievements, discovering mentors, and building meaningful professional relationships.",
  keywords: [
    "SambandhYog",
    "professional network",
    "career growth",
    "mentorship",
    "positive social media",
  ],
  openGraph: {
    title: "SambandhYog",
    description:
      "A positivity-driven community for professionals to connect, learn, and grow together.",
    url: "https://sambandh-yog.com",
    siteName: "SambandhYog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SambandhYog",
    description:
      "A positivity-driven community for professionals to connect, learn, and grow together.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} gradient-accent min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ConnectionsProvider>
                <StoriesProvider>
                  <PostsProvider>
                    <ToastContainer />
                    <div className="pb-24 md:pb-0">{children}</div>
                    <MobileNav />
                  </PostsProvider>
                </StoriesProvider>
              </ConnectionsProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
