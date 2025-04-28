import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { image } = req.body;
  
  try {
    // Generate unique filename
    const filename = `upload_${uuidv4()}.${image.type.split('/')[1]}`;
    
    // Upload to Frampack storage
    const uploadResponse = await axios.post(
      'https://api.frampack.com/v1/upload',
      createReadStream(image.path),
      {
        headers: {
          'Content-Type': image.type,
          'X-API-Key': process.env.FRAMPACK_API_KEY,
          'X-API-Secret': process.env.FRAMPACK_API_SECRET
        }
      }
    );

    res.status(200).json({ 
      success: true, 
      imageUrl: uploadResponse.data.url 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Image upload failed' 
    });
  }
}
