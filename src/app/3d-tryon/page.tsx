'use client'

import { useState } from 'react'

export default function ThreeDTryOnPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setLoading(true)
    setModelUrl(null)

    try {
      const res = await fetch('/api/pifuhd', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setModelUrl(data.objUrl) // ← path to .obj file from backend
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">🧍‍♂️ 3D Try-On</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-64 h-auto rounded shadow mb-4"
        />
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Generate 3D Model'}
      </button>

      {modelUrl && (
        <div className="mt-8 w-full h-[500px]">
          <model-viewer
            src={modelUrl}
            alt="3D Model"
            auto-rotate
            camera-controls
            style={{ width: '100%', height: '100%' }}
          ></model-viewer>
        </div>
      )}
    </main>
  )
}
