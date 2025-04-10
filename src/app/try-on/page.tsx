// src/app/try-on/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface ItemData {
  id: number
  image: string
  name: string
}

export default function TryOn() {
  const [userImage, setUserImage] = useState<File | null>(null)
  const [clothingImage, setClothingImage] = useState<File | null>(null)
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null)
  const [clothingImagePreview, setClothingImagePreview] = useState<string | null>(null)
  const [clothingName, setClothingName] = useState<string | null>(null)
  const [garmentDescription, setGarmentDescription] = useState<string>('')
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isDraggingUser, setIsDraggingUser] = useState(false)
  const [isDraggingClothing, setIsDraggingClothing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const itemParam = searchParams.get('item')
    if (itemParam) {
      try {
        const itemData: ItemData = JSON.parse(decodeURIComponent(itemParam))
        setClothingImagePreview(itemData.image)
        setClothingName(itemData.name)
        fetch(itemData.image)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'clothing.jpg', { type: 'image/jpeg' })
            setClothingImage(file)
          })
          .catch(err => {
            console.error('Error loading clothing image:', err)
            setError('Failed to load clothing image')
          })
      } catch (error) {
        console.error('Error parsing item data:', error)
        setError('Failed to parse item data')
      }
    }
  }, [searchParams])

  const handleImageUpload = async (file: File, type: 'user' | 'clothing') => {
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'user') {
          setUserImage(file)
          setUserImagePreview(reader.result as string)
        } else {
          setClothingImage(file)
          setClothingImagePreview(reader.result as string)
        }
      }
      reader.onerror = () => {
        throw new Error('Failed to read file')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image')
    }
  }

  const handleDragOver = (e: React.DragEvent, type: 'user' | 'clothing') => {
    e.preventDefault()
    if (type === 'user') {
      setIsDraggingUser(true)
    } else {
      setIsDraggingClothing(true)
    }
  }

  const handleDragLeave = (type: 'user' | 'clothing') => {
    if (type === 'user') {
      setIsDraggingUser(false)
    } else {
      setIsDraggingClothing(false)
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'user' | 'clothing') => {
    e.preventDefault()
    if (type === 'user') {
      setIsDraggingUser(false)
    } else {
      setIsDraggingClothing(false)
    }

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, type)
    }
  }

  const processImages = async () => {
    try {
      if (!userImage || !clothingImage || !garmentDescription.trim()) {
        setError('Missing required fields')
        return
      }

      setIsProcessing(true)
      setError(null)

      const formData = new FormData()
      formData.append('personImage', userImage)
      formData.append('clothingImage', clothingImage)
      formData.append('garmentDescription', garmentDescription)

      const response = await fetch('/api/process-tryon', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details?.message || 'Failed to process images')
      }

      if (!data.result) {
        throw new Error('No result received')
      }

      setProcessedImage(data.result)
      console.log("Processed Image:", data.result)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Processing error:', error.message)
        setError(error.message)
      } else {
        console.error('Unknown error:', error)
        setError('An unexpected error occurred')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Virtual Try-On</h1>
        <p className="mt-2 text-gray-600">Upload your photo and the clothing item you want to try on</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* User Photo Upload Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Photo</h2>
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDraggingUser ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => handleDragOver(e, 'user')}
            onDragLeave={() => handleDragLeave('user')}
            onDrop={(e) => handleDrop(e, 'user')}
          >
            {!userImagePreview ? (
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">Drag and drop your photo or</p>
                <label className="mt-2 cursor-pointer text-blue-500 hover:text-blue-600">
                  Browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'user')
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={userImagePreview}
                  alt="User preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
                  onClick={() => {
                    setUserImage(null)
                    setUserImagePreview(null)
                  }}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clothing Item Upload Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Clothing Item
            {clothingName && <span className="text-gray-600 text-sm ml-2">({clothingName})</span>}
          </h2>
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDraggingClothing ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => handleDragOver(e, 'clothing')}
            onDragLeave={() => handleDragLeave('clothing')}
            onDrop={(e) => handleDrop(e, 'clothing')}
          >
            {!clothingImagePreview ? (
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">Drag and drop clothing item or</p>
                <label className="mt-2 cursor-pointer text-blue-500 hover:text-blue-600">
                  Browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'clothing')
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={clothingImagePreview}
                  alt="Clothing preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
                  onClick={() => {
                    setClothingImage(null)
                    setClothingImagePreview(null)
                    setClothingName(null)
                  }}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clothing Description Input */}
      <div className="mb-6">
        <label htmlFor="garmentDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Describe the clothing
        </label>
        <input
          name="garmentDescription"
          type="text"
          placeholder="Describe the clothing (e.g. blue jacket)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          value={garmentDescription}
          onChange={(e) => setGarmentDescription(e.target.value)}
        />
      </div>

      {/* Process Button */}
      <div className="text-center mb-8">
        <button
          onClick={processImages}
          disabled={!userImage || !clothingImage || isProcessing}
          className={`px-8 py-3 rounded-lg text-white font-medium ${
            userImage && clothingImage && !isProcessing
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Generate Try-On'
          )}
        </button>
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
      </div>

      {/* Result Section */}
{processedImage ? (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">Result</h2>
    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
      {typeof processedImage === 'string' && (
        <img
          src={
            processedImage.startsWith('data:image')
              ? processedImage
              : processedImage.startsWith('http')
              ? processedImage
              : `data:image/jpeg;base64,${processedImage}`
          }
          alt="Processed try-on result"
          className="w-full h-auto rounded-lg object-cover"
        />
      )}
    </div>
  </div>
) : (
  userImage && clothingImage && !isProcessing && (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Result</h2>
      <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-600">
          <p className="mb-2">Click Generate Try-On to see the result</p>
          <p className="text-sm">
            The AI will process your images and show the virtual try-on result here.
          </p>
        </div>
      </div>
    </div>
        )
      )}
    </div>
  )
}
