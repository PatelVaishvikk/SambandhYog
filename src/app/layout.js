// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { PostsProvider } from '@/context/PostsContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SambandhYog - Positive Social Connections',
  description: 'AI-powered positive social media platform promoting mindful connections',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-indigo-50 to-cyan-50 min-h-screen`}>
        <AuthProvider>
          <PostsProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#1f2937',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }} 
            />
          </PostsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}