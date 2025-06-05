import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import formidable, { IncomingForm, File as FormidableFile } from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = new IncomingForm({
    uploadDir: './public/uploads',
    keepExtensions: true,
  })

  form.parse(req, async (err, fields, files: { image?: FormidableFile[] | FormidableFile }) => {
    if (err) return res.status(500).json({ error: 'File upload failed' })

    const imageEntry = files.image
    if (!imageEntry) return res.status(400).json({ error: 'No image file uploaded' })

    const imageFile = Array.isArray(imageEntry) ? imageEntry[0] : imageEntry
    const inputPath = imageFile.filepath

    // Create output path for generated .obj
    const outputName = path.basename(inputPath, path.extname(inputPath))
    const outputDir = path.join(process.cwd(), 'public', 'models', outputName)

    fs.mkdirSync(outputDir, { recursive: true })

    // Execute PIFuHD script
    const command = `python ./pifuhd/run_pifuhd.py --image "${inputPath}" --out "${outputDir}"`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('PIFuHD error:', stderr)
        return res.status(500).json({ error: 'PIFuHD failed to run' })
      }

      const objUrl = `/models/${outputName}/output.obj`
      return res.status(200).json({ objUrl })
    })
  })
}
