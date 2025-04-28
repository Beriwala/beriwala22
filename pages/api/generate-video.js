import axios from 'axios';

export default async function handler(req, res) {
  // Authentication
  const API_KEY = process.env.FRAMPACK_API_KEY;
  const API_SECRET = process.env.FRAMPACK_API_SECRET;
  
  // Request Data
  const { prompt, imageUrl } = req.body;

  try {
    const response = await axios.post(
      'https://api.frampack.com/v1/generate', // Frampack API endpoint
      {
        prompt,
        image: imageUrl,
        parameters: {
          resolution: '1080p',
          duration: 15
        }
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({
      success: true,
      videoUrl: response.data.output.url // API response structure के अनुसार एडजस्ट करें
    });

  } catch (error) {
    console.error('Frampack API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Video generation failed'
    });
  }
}
