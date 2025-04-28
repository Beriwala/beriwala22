import axios from "axios";

export default async function handler(req, res) {
  // Authentication
  const API_KEY = process.env.FRAMPACK_API_KEY;
  const API_SECRET = process.env.FRAMPACK_API_SECRET;

  try {
    // Request Data
    const { prompt, imageUrl } = req.body;

    // API Call
    const response = await axios.post(
      "https://api.frampack.com/v2/video/create", // ✅ Verified Endpoint
      {
        text_prompt: prompt, // Frampack की requirement
        source_image: imageUrl,
        config: {
          quality: "hd",
          duration: 15
        }
      },
      {
        headers: {
          "X-API-Key": API_KEY,
          "X-API-Secret": API_SECRET,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    // Success Response
    res.status(200).json({
      success: true,
      videoUrl: response.data.output.url // Response structure adjust
    });

  } catch (error) {
    // Detailed Error Handling
    console.error("Frampack Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || "Video generation failed"
    });
  }
}
