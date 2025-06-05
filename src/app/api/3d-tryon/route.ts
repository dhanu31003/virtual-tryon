import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { randomUUID } from 'crypto'
import os from 'os'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const personFile = formData.get('person') as File

    if (!personFile) {
      return NextResponse.json({ error: 'Missing person image' }, { status: 400 })
    }

    // Save files to disk
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    fs.mkdirSync(uploadDir, { recursive: true })
    const personPath = path.join(uploadDir, `${randomUUID()}_person.jpg`)
    
    try {
      fs.writeFileSync(personPath, Buffer.from(await personFile.arrayBuffer()))
    } catch (err) {
      console.error('File write error:', err)
      return NextResponse.json({ error: 'Failed to save uploaded file' }, { status: 500 })
    }

    // Output directory for 3D model
    const modelDir = path.join(process.cwd(), 'public', 'models', randomUUID())
    fs.mkdirSync(modelDir, { recursive: true })

    // Run PIFuHD with better error handling
    const pythonPath = process.env.PYTHON_PATH || 'python'  // Change python3 to python
    const scriptPath = path.join(process.cwd(), 'pifuhd', 'run_pifuhd.py')
    
    try {
      await new Promise<void>((resolve, reject) => {
        const proc = spawn(pythonPath, [
          '-c',
          'import torch, cv2, trimesh, numpy, dill; print("Dependencies OK")'
        ])

        proc.on('close', (code) => {
          if (code !== 0) {
            reject(new Error('Python dependencies missing. Please install required packages.'))
            return
          }

          const pifuProc = spawn(pythonPath, [
            scriptPath,
            '--image', personPath,
            '--out', modelDir
          ])
          
          let stdout = ''
          let stderr = ''
          
          pifuProc.stdout?.on('data', (data) => { 
            stdout += data.toString()
            console.log('PIFuHD output:', data.toString())
          })
          
          pifuProc.stderr?.on('data', (data) => { 
            stderr += data.toString()
            console.error('PIFuHD error:', data.toString())
          })
          
          pifuProc.on('close', (code) => {
            if (code === 0) resolve()
            else reject(new Error(`PIFuHD failed.\nStderr: ${stderr}\nStdout: ${stdout}`))
          })
        })
      })
    } catch (err) {
      console.error('PIFuHD execution error:', err)
      return NextResponse.json({ 
        error: 'Failed to generate 3D model. Check Python dependencies.',
        details: err instanceof Error ? err.message : String(err)
      }, { status: 500 })
    }

    // Find output.obj
    const objPath = path.join(modelDir, 'output.obj')
    if (!fs.existsSync(objPath)) {
      return NextResponse.json({ error: '3D model not generated' }, { status: 500 })
    }

    // Return the OBJ URL (relative to public/)
    const objUrl = `/models/${path.basename(modelDir)}/output.obj`
    
    // Also check if we have materials and textures
    const mtlPath = path.join(modelDir, 'output.mtl')
    const hasMaterials = fs.existsSync(mtlPath)
    
    return NextResponse.json({ 
      models: [objUrl],
      hasMaterials,
      message: '3D model generated successfully'
    })
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}