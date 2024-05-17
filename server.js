const express = require('express');
const bodyParser = require('body-parser');
const youtubeDl = require('youtube-dl-exec');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/download', (req, res) => {
    const { url, formato } = req.body;
    const options = ['--format', 'best'];
    if (formato === 'mp3') {
        options.push('--extract-audio', '--audio-format', 'mp3');
    }
    youtubeDl(url, options)
        .then(output => {
            console.log(output);
            res.json({ status: 'success' });
        })
        .catch(error => {
            console.error(error);
            res.json({ status: 'error' });
        });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
