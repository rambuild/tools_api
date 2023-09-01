// 引包
const express = require('express');
const router = express.Router();
const request = require('request');
const path = require('path');
const fs = require('fs');
const picModel = require('../db/model/pic-everyday');
// 定时任务
const schedule = require('node-schedule');

const BING_REQUEST_URL =
  'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1586183781119&pid=hp&uhd=1&uhdwidth=2880&uhdheight=1620';

const basePicUrl = 'https://cn.bing.com';

const getPic = () => {
  request({ method: 'GET', url: BING_REQUEST_URL }, (err, data, body) => {
    if (!err) {
      const imageInfo = body ? JSON.parse(body).images[0] : '';
      const imgPath = imageInfo.url.split('&')[0];
      const allPath = basePicUrl + imgPath;

      const readStream = request(allPath);
      const writeStream = fs.createWriteStream(
        path.join(__dirname, `/../../static/local/pic-everyday/${imageInfo.fullstartdate}.jpg`)
      );
      readStream.pipe(writeStream);
      readStream.on('end', () => {
        writeStream.end();
        // 复制当前图片到today.jpg中
        fs.writeFileSync(
          path.join(__dirname, `/../../static/local/pic-everyday/today.jpg`),
          fs.readFileSync(path.join(__dirname, `/../../static/local/pic-everyday/${imageInfo.fullstartdate}.jpg`))
        );
      });

      picModel
        .create({
          remoteUrl: allPath,
          localUrl: `https://api.fastro.cn/tools/static/local/pic-everyday/${imageInfo.fullstartdate}.jpg`,
        })
        .catch(() => {});
    }
  });
};
// 定时记录,每天的00:00:30
const statFunc = () => {
  schedule.scheduleJob('30 0 0 * * *', getPic);
};

module.exports = {
  periodicTasks: statFunc,
  main(app) {
    router.get('/pic-everyday', async (req, res) => {
      const pics = await picModel.find({});
      if (pics.length) {
        const { remoteUrl, localUrl } = pics[pics.length - 1];
        res.send({
          status: 200,
          remoteUrl,
          localUrl,
        });
      } else {
        res.send({ status: 400, url: '' });
      }
    });
    router.get('/get-bing-pic', async (req, res) => {
      const pics = await picModel.find({});
      if (pics.length) {
        const { remoteUrl } = pics[pics.length - 1];
        res.send(remoteUrl);
      } else {
        res.send('');
      }
    });
    app.use('/', router);
  },
};
