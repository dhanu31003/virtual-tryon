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
        <div className="mt-8 w-full">
          <div className="relative bg-gray-100 rounded-xl shadow-lg overflow-hidden">
            {/* Loading indicator */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            <model-viewer
              src={modelUrls[0]}
              alt="3D Try-on Model"
              loading="eager"
              camera-controls
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              environment-image="neutral"
              shadow-intensity="1"
              exposure="0.75"
              camera-orbit="-30deg 75deg 105%"
              min-camera-orbit="auto auto 5%"
              max-camera-orbit="auto auto 200%"
              camera-target="0m 0m 0m"
              field-of-view="30deg"
              interaction-prompt="none"
              style={{
                width: '100%',
                height: '70vh',
                backgroundColor: '#f3f4f6',
              }}
              onError={() => setError('Failed to load 3D model.')}
              onLoad={() => setLoading(false)}
            >
              {/* Progress bar */}
              <div slot="progress-bar" className="progress-bar">
                <div className="update-bar"></div>
              </div>
              {/* AR button */}
              <button slot="ar-button" className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
                👀 View in AR
              </button>
              {/* Fallback for browsers that don't support model-viewer */}
              <div className="text-center text-gray-500 mt-4" slot="fallback">
                <p>
                  Your browser does not support 3D model viewing.<br />
                  <a
                    href={modelUrls[0]}
                    download="output.obj"
                    className="text-blue-600 underline"
                  >
                    Download the OBJ file
                  </a> and open it in a 3D viewer like Blender or Meshlab.
                </p>
              </div>
            </model-viewer>
          </div>
          {/* Controls help */}
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">🎮 Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 p-1 rounded">🖱️ Left Click + Drag</span>
                <span>Rotate the model</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 p-1 rounded">🖱️ Right Click + Drag</span>
                <span>Pan the view</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 p-1 rounded">⚡ Mouse Wheel</span>
                <span>Zoom in/out</span>
              </div>
            </div>
            {/* Download link for OBJ */}
            <div className="mt-4 text-center">
              <a
                href={modelUrls[0]}
                download="output.obj"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                ⬇️ Download 3D Model (OBJ)
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}