import axios from "axios";

export default async function handler(req, res) {
  // API Credentials
  const API_KEY = process.env.FRAMPACK_API_KEY;
  const API_SECRET = process.env.FRAMPACK_API_SECRET;

  try {
    // Input Data
    const { prompt, imageUrl } = req.body;

    // Frampack API Call
    const response = await axios.post(
      "https://api.frampack.com/v2/video/create", // ✅ सही Endpoint
      {
        text_prompt: prompt,
        source_image: imageUrl,
        config: {
          quality: "hd",
          duration: 15
        }
      },
      {
        headers: {
          "X-API-Key": API_KEY, // ✅ सही Header
          "X-API-Secret": API_SECRET,
          "Content-Type": "application/json"
        }
      }
    );

    // Success Response
    res.status(200).json({
      success: true,
      videoUrl: response.data.output.url 
    });

  } catch (error) {
    // Error Debugging
    console.log("🚨 Error Details:", {
      status: error.response?.status,
      message: error.message,
      apiError: error.response?.data
    });
    
    // User-Friendly Response
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || "Video बनाने में असफल"
    });
  }
}
