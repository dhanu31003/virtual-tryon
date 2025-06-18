// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Shirt, Camera, SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div 
          className={`mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Animated Logo */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
              <SparklesIcon className="w-16 h-16 mx-auto text-blue-500 animate-bounce" />
            </div>
            <h1 className="mt-6 text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-transparent bg-clip-text animate-gradient">
              VirtualTryOn
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in">
              Experience the future of shopping with our virtual fitting room
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="feature-card group h-[250px] cursor-pointer"
              onClick={() => router.push('/try-on')}
            >
              <div className="relative p-6 bg-white rounded-xl shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Camera className="w-12 h-12 mb-4 text-blue-500 group-hover:animate-bounce" />
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-gray-900">Upload Photo</h3>
                  <p className="text-gray-600 text-center group-hover:text-gray-800">Start with your photo to begin the virtual try-on experience</p>
                </div>
              </div>
            </div>

            <div 
              className="feature-card group h-[250px] cursor-pointer"
              onClick={() => router.push('/wardrobe')}
            >
              <div className="relative p-6 bg-white rounded-xl shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Shirt className="w-12 h-12 mb-4 text-purple-500 group-hover:animate-bounce" />
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-gray-900">Select Clothes</h3>
                  <p className="text-gray-600 text-center group-hover:text-gray-800">Browse our collection and pick items to try on</p>
                </div>
              </div>
            </div>

            <div 
              className="feature-card group h-[250px] cursor-pointer"
              onClick={() => router.push('/history')}
            >
              <div className="relative p-6 bg-white rounded-xl shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <SparklesIcon className="w-12 h-12 mb-4 text-pink-500 group-hover:animate-bounce" />
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-gray-900">See Results</h3>
                  <p className="text-gray-600 text-center group-hover:text-gray-800">Experience how clothes look on you instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 text-center">
            <Link 
              href="/try-on"
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-gradient"
            >
              Start Virtual Try-On
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">About This Project</h2>
          <p className="text-gray-700 text-lg mb-4">
            VirtualTryOn is a smart virtual fitting room built using advanced AI technology to help users visualize clothing on themselves without ever entering a store.
          </p>
          <p className="text-gray-600 mb-2">
            Upload your photo, select a garment from the wardrobe, and instantly view the try-on result. Our model is powered by image synthesis AI and optimized for upper body, lower body, and dress garments.
          </p>
          <p className="text-gray-500">
            Designed and developed with ❤️ by <span className="font-semibold text-purple-500">Dhanush Pujari</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
