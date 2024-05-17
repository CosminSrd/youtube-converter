const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Puerto para Heroku

app.use(express.static('public'));

app.get('/download', async (req, res) => {
    const url = req.query.url;
    const format = req.query.format;

    if (!url || !format) {
        return res.status(400).send('Falta URL o formato.');
    }

    try {
        const info = await ytdl.getInfo(url);
        let audioFormat;
        let videoFormat;

        if (format === 'mp3') {
            audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            const audioBitrate = audioFormat.audioBitrate || 128; // Default to 128 if not available

            const video = ytdl(url, { format: audioFormat });

            res.header('Content-Disposition', `attachment; filename="audio.mp3"`);

            ffmpeg(video)
                .audioBitrate(audioBitrate)
                .toFormat('mp3')
                .pipe(res, { end: true });
        } else if (format === 'mp4') {
            videoFormat = ytdl.chooseFormat(info.formats, { quality: '137' }); // 1080p is format 137
            if (!videoFormat) {
                videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            }

            res.header('Content-Disposition', `attachment; filename="video.mp4"`);

            ytdl(url, { format: videoFormat }).pipe(res);
        } else {
            res.status(400).send('Formato no soportado.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar la solicitud.');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});



