export const analyzeMudraApi = async (selectedFile, setResults, setResultImageData, setError) => {
  try {
    const formData = new FormData();
    formData.append('image', selectedFile);

    const resp = await fetch('https://mudradetect.onrender.com/post', { method: 'POST', body: formData });
    if (!resp.ok) throw new Error(`API returned status ${resp.status}`);

    const data = await resp.json();
    setResults(data); // For simplicity, pass full API response
    setResultImageData(data.image_base64 || null);
  } catch (err) {
    setError(err.message);
  }
};
