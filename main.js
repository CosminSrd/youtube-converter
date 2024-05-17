function descargar() {
    var url = document.getElementById('url').value;
    var formato = document.getElementById('formato').value;

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url, formato: formato })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('message').textContent = 'Descarga completada.';
        } else {
            document.getElementById('message').textContent = 'Error en la descarga.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Error en la descarga.';
    });
}
