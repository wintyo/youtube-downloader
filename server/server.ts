import Express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import { exec } from 'child_process';

const app = Express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// static以下に配置したファイルは直リンクで見れるようにする
app.use(Express.static(path.resolve(__dirname, 'static')));

// tmpディレクトリを作成する
fs.mkdir(path.resolve(__dirname, './tmp/'), (err) => {
  if (err) {
    console.error(err);
  }
});

// 疎通テスト用のレスポンス
app.get('/api/health', (req, res) => {
  return res.send('I am OK!');
});

// Youtubeのダウンロード
app.get('/api/youtube/:youtubeId', (req, res) => {
  const { youtubeId } = req.params;
  const fileType = (req.query.fileType || 'mp4') as 'mp4' | 'mp3';

  const destFilePath = path.resolve(__dirname, `./tmp/${youtubeId}.mp4`);

  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  const stream = ytdl(url, { quality: 'highest' });

  stream.pipe(fs.createWriteStream(destFilePath));

  stream.on('error', (err) => {
    console.error(err);
    res.status(400).send('download error!');
  });

  stream.on('end', () => {
    console.log(`youtube file (${youtubeId}.mp4) downloaded.`);

    // mp4の場合はそのまま返す
    if (fileType === 'mp4') {
      res.download(destFilePath);
      return;
    }

    // mp3の場合は変換してから返す
    console.log('transform mp4 -> mp3.');
    const mp3FilePath = path.resolve(__dirname, `./tmp/${youtubeId}.mp3`);
    exec(`ffmpeg -y -i ${destFilePath} ${mp3FilePath}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).send('movie translation error!');
        return;
      }
      console.log(stdout);
      console.log(stderr);
      res.download(mp3FilePath);
    });
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
