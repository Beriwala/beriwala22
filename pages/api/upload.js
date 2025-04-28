import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload Image
      const formData = new FormData();
      formData.append('image', image);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const { imageUrl } = await uploadRes.json();

      // Step 2: Generate Video
      const videoRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageUrl }),
      });

      const { videoUrl } = await videoRes.json();
      setVideoUrl(videoUrl);

    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Video Maker</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Video का विवरण लिखें"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ background: loading ? 'gray' : 'blue' }}
        >
          {loading ? 'बना रहा है...' : 'Video बनाएं'}
        </button>
      </form>

      {videoUrl && (
        <div>
          <video controls src={videoUrl} style={{ width: '100%' }} />
          <a href={videoUrl} download>Download Video</a>
        </div>
      )}
    </div>
  );
}
