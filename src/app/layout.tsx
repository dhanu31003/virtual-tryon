// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Camera, Shirt, History } from 'lucide-react'
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Virtual Try-On',
  description: 'Try clothes virtually before you buy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script 
          type="module" 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        ></script>
      </head>
      <body className={inter.className}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center">
                  <span className="animate-gradient font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 text-2xl tracking-tight hover:scale-105 transition-transform duration-300">
                    Virtual<span className="text-blue-500">Try</span>On
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/try-on" 
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform duration-300"
                >
                  <Camera className="w-4 h-4" />
                  <span>2D -Try On</span>
                </Link>
                <Link 
                  href="/3d-tryon" 
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform duration-300"
                >
                  <Camera className="w-4 h-4" />
                  <span>3D - Try On</span>
                </Link>
                <Link 
                  href="/wardrobe" 
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform duration-300"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Wardrobe</span>
                </Link>
                <Link 
                  href="/history" 
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:scale-105 transition-transform duration-300"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}