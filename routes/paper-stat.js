module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const PaperStatModel = require('../db/model/paper-stat');
  const dayjs = require('dayjs');

  router.get('/paper-stat', (req, res) => {
    PaperStatModel.find({}).then(result => {
      const formatTimeStamp = result.map(item => ({
        name: item.name,
        wordNum: item.wordNum,
        timestamp: dayjs(+item.timestamp).format('M-D'),
      }));
      const separateDatas = formatTimeStamp.reduce(
        (accur, cur) => [
          ...accur,
          {
            日期: cur.timestamp,
            [cur.name]: cur.wordNum,
          },
        ],
        []
      );
      const stats = {};
      separateDatas.forEach(item => {
        if (stats[item['日期']]) {
          stats[item['日期']] = { ...stats[item['日期']], ...item };
        } else {
          stats[item['日期']] = item;
        }
      });
      const formatArr = [];
      Object.values(stats).forEach(item => {
        formatArr.push(item);
      });
      res.send({
        status: 200,
        result: formatArr,
      });
    });
  });
  router.post('/paper-stat/add', (req, res) => {
    const { name, wordNum } = req.body;
    if (!name || !wordNum) {
      return res.send({
        status: 401,
        msg: '请求参数错误',
      });
    }
    PaperStatModel.create({
      timestamp: new Date().getTime(),
      name,
      wordNum,
    })
      .then(() => {
        res.send({
          status: 200,
          msg: 'ok',
        });
      })
      .catch(e => {
        res.send({
          status: 400,
          msg: e.message,
        });
      });
  });
  app.use('/', router);
};
