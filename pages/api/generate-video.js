import axios from "axios";

export default async function handler(req, res) {
  const API_KEY = process.env.FRAMPACK_API_KEY;
  const API_SECRET = process.env.FRAMPACK_API_SECRET;

  try {
    const { prompt, imageUrl } = req.body;

    const response = await axios.post(
      "https://api.frampack.com/v3/generations",
      {
        model: "video-xl-1.0",
        prompt: prompt,
        init_image: imageUrl,
        steps: 25
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}:${API_SECRET}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json({
      videoUrl: response.data.output[0].url // ✅ नया response format
    });

  } catch (error) {
    console.log("🚨 Full Error Trace:", {
      url_used: "https://api.frampack.com/v3/generations",
      headers_sent: error.config?.headers,
      error_data: error.response?.data
    });
    
    res.status(500).json({
      error: error.response?.data?.error || "API configuration issue"
    });
  }
}
