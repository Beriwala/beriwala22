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
      // Upload Image
      const uploadForm = new FormData();
      uploadForm.append('image', image);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      const { imageUrl } = await uploadRes.json();

      // Generate Video
      const videoRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageUrl }),
      });

      const { videoUrl } = await videoRes.json();
      setVideoUrl(videoUrl);

    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Video Generator</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter video description"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Create Video'}
        </button>
      </form>

      {videoUrl && (
        <div className="video-container">
          <video controls src={videoUrl} />
          <a href={videoUrl} download>Download Video</a>
        </div>
      )}
    </div>
  );
}
