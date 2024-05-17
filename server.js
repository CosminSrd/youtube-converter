const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const bodyParser = require('body-parser');
const youtubeDl = require('youtube-dl-exec');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === '/download' && req.method === 'POST') {
            let data = '';
            req.on('data', chunk => {
                data += chunk.toString();
            });
            req.on('end', () => {
                const { url, formato } = JSON.parse(data);
                const options = ['--format', 'best'];
                if (formato === 'mp3') {
                    options.push('--extract-audio', '--audio-format', 'mp3');
                }
                youtubeDl(url, options)
                    .then(output => {
                        console.log(output);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success' }));
                    })
                    .catch(error => {
                        console.error(error);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'error' }));
                    });
            });
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(process.env.PORT || 3000, err => {
        if (err) throw err;
        console.log(`Servidor escuchando en http://localhost:${process.env.PORT || 3000}`);
    });
});
