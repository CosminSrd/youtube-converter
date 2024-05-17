document.getElementById('download-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const url = document.getElementById('url').value;
    const format = document.getElementById('format').value;

    const response = await fetch(`/download?url=${encodeURIComponent(url)}&format=${format}`);

    if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `video.${format}`;
        link.click();
    } else {
        alert('Error al convertir el video.');
    }
});
