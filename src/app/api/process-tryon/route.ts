import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const personImage = formData.get('personImage') as File;
    const clothingImage = formData.get('clothingImage') as File;
    const garmentDescription = formData.get('garmentDescription') as string;

    if (!personImage || !clothingImage || !garmentDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fileToBase64 = async (file: File): Promise<string> => {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const binary = bytes.reduce((data, byte) => data + String.fromCharCode(byte), '');
      return `data:${file.type};base64,${btoa(binary)}`;
    };

    const humanBase64 = await fileToBase64(personImage);
    const clothBase64 = await fileToBase64(clothingImage);

    const prediction = await replicate.predictions.create({
      version: '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985',
      input: {
        human_img: humanBase64,
        garm_img: clothBase64,
        garment_des: garmentDescription,
        category: 'upper_body',
      },
    });

    let output = null;

    while (!output && prediction.status !== 'failed') {
      const finalResult = await replicate.predictions.get(prediction.id);
      if (finalResult.output) {
        output = finalResult.output;
        break;
      }
      await new Promise((res) => setTimeout(res, 2000));
    }

    if (!output) {
      throw new Error('Failed to get output from replicate.');
    }

    console.log("✅ Final output from Replicate:", output);

    return NextResponse.json({ result: Array.isArray(output) ? output[0] : output });
  } catch (error: any) {
    console.error('Replicate error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}