import ytdl from 'ytdl-core';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const BASE_URL = 'https://www.youtube.com/watch?v=';

const YOUTUBE_ID = 'bnc1NjaFDXA';

const url = `${BASE_URL}${YOUTUBE_ID}`;

const video = ytdl(url, { quality: '18' });

video.pipe(fs.createWriteStream(path.resolve(__dirname, `./tmp/${YOUTUBE_ID}.mp4`)));

video.on('end', () => {
  console.log('end');
  const inputFilePath = path.resolve(__dirname, `./tmp/${YOUTUBE_ID}.mp4`);
  const outputFilePath = path.resolve(__dirname, `./tmp/${YOUTUBE_ID}.mp3`);
  exec(`ffmpeg -y -i ${inputFilePath} ${outputFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
});
