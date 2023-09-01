module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const LinuxLoginLog = require('../db/model/linux-login-log');
  const dayjs = require('dayjs');
  const request = require('request');

  router.post('/linux-log', (req, res) => {
    try {
      const { ip, user } = req.body;
      let ipAddress = '';
      // 获取IP归属地
      request(
        {
          url: `https://ip.cn/api/index?ip=${ip}&type=1`,
          headers: {
            Accept: '*/*',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
          },
        },
        (err, data, body) => {
          if (!err) {
            ipAddress = JSON.parse(body).address;
          }
          LinuxLoginLog.create({
            user,
            ip,
            ipAddress,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            timestamp: new Date().getTime(),
          });
        }
      );
      res.send('');
    } catch {
      res.send('');
    }
  });

  app.use('/', router);
};
