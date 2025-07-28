import { useState } from "react";

export default function BrijnScan() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async () => {
    if (!image || !text) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("text", text);

    try {
      const res = await fetch("https://brijn-backend.onrender.com/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Frontend error:", err);
      setResult({
        verdict: "❌ Error",
        summary: "Could not connect to backend or process the input.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <h1>🐶 BRIJN DATING SCAN</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <textarea
        placeholder="Paste message or bio here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ width: "100%", marginTop: "1rem" }}
      />
      <button onClick={handleSubmit} disabled={loading || !image || !text}>
        {loading ? "Scanning..." : "Skanuj"}
      </button>
      {result && (
        <div style={{ marginTop: "1rem", background: "#eee", padding: "1rem" }}>
          <h2>Wynik:</h2>
          <p>{result.verdict}</p>
          <p style={{ opacity: 0.7 }}>{result.summary}</p>
        </div>
      )}
    </div>
  );
}
