from flask import Flask, render_template, request, jsonify
import youtube_dl

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    formato = request.form['formato']
    opciones = {
        'format': 'bestvideo[ext={}]'.format(formato),
        'outtmpl': 'static/%(title)s.{}'.format(formato),
    }
    with youtube_dl.YoutubeDL(opciones) as ydl:
        ydl.download([url])
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
