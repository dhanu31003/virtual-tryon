'use client'

import { useState } from 'react'

export default function ThreeDTryOnPage() {
  const [personFile, setPersonFile] = useState<File | null>(null)
  const [clothFile, setClothFile] = useState<File | null>(null)
  const [personPreview, setPersonPreview] = useState<string | null>(null)
  const [clothPreview, setClothPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modelUrls, setModelUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handlePersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setPersonFile(file)
    if (file) setPersonPreview(URL.createObjectURL(file))
  }

  const handleClothChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setClothFile(file)
    if (file) setClothPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!personFile) return
    setLoading(true)
    setModelUrls([])
    setError(null)
    const formData = new FormData()
    formData.append('person', personFile)
    // Only append cloth if provided
    if (clothFile) formData.append('cloth', clothFile)
    try {
      const res = await fetch('/api/3d-tryon', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.models && Array.isArray(data.models)) {
        setModelUrls(data.models)
      } else if (res.ok && data.model) {
        setModelUrls([data.model])
      } else {
        setError(data.error || 'Failed to generate 3D model')
      }
    } catch (err) {
      setError('Failed to generate 3D model')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">🧍‍♂️ 3D Try-On</h1>
      <div className="flex flex-col md:flex-row gap-8 mb-6">
        <div>
          <label className="block mb-2 font-semibold">Person Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePersonChange}
            className="mb-2"
          />
          {personPreview && (
            <img
              src={personPreview}
              alt="Person Preview"
              className="w-40 h-auto rounded shadow"
            />
          )}
        </div>
        <div>
          <label className="block mb-2 font-semibold">Cloth Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleClothChange}
            className="mb-2"
          />
          {clothPreview && (
            <img
              src={clothPreview}
              alt="Cloth Preview"
              className="w-40 h-auto rounded shadow"
            />
          )}
        </div>
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        disabled={loading || !personFile}
      >
        {loading ? 'Processing...' : 'Generate 3D Try-On'}
      </button>
      {error && (
        <div className="mt-4 text-red-500">{error}</div>
      )}
      {modelUrls.length > 0 && (
        <div className="mt-8 w-full overflow-x-auto">
          <div className="flex gap-8">
            {modelUrls.map((url, idx) => (
              <div key={idx} className="min-w-[350px] h-[500px] flex-shrink-0 bg-gray-100 rounded-lg shadow-lg">
                <model-viewer
                  src={url}
                  alt="3D Model"
                  auto-rotate
                  camera-controls
                  ar
                  shadow-intensity="1"
                  environment-image="neutral"
                  exposure="0.2"
                  camera-orbit="0deg 75deg 105%"
                  min-camera-orbit="auto auto 50%"
                  max-camera-orbit="auto auto 200%"
                  style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
                ></model-viewer>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-gray-600">
            ✨ Drag to rotate • Pinch to zoom • Double-click to reset view
          </div>
        </div>
      )}
    </main>
  )
}