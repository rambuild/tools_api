module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const YasmineStatModel = require('../db/model/yasmine-stat');
  const dayjs = require('dayjs');
  const request = require('request');

  router.get('/yasmine-stat', (req, res) => {
    YasmineStatModel.find({}).then(result => {
      const formatTimeStamp = result.map(item => ({
        ...item._doc,
        remarks: item.remarks || '-',
        timestamp: dayjs(+item.timestamp).format('M-D HH:mm'),
      }));
      const separateDatas = formatTimeStamp.reduce(
        (accur, cur) => [
          ...accur,
          {
            日期: cur.timestamp,
            remarks: cur.remarks,
            字数: cur.wordNum,
            时长: cur.studyTime,
          },
        ],
        []
      );
      // const stats = {};
      // separateDatas.forEach(item => {
      //   if (stats[item['日期']]) {
      //     stats[item['日期']] = { ...stats[item['日期']], ...item };
      //   } else {
      //     stats[item['日期']] = item;
      //   }
      // });
      // const formatArr = [];
      // Object.values(stats).forEach(item => {
      //   formatArr.push(item);
      // });
      res.send({
        status: 200,
        result: separateDatas,
      });
    });
  });
  router.post('/yasmine-stat/add', (req, res) => {
    const { name, wordNum, remarks, studyTime } = req.body;
    if (!name) {
      return res.send({
        status: 401,
        msg: '请求参数错误',
      });
    }
    YasmineStatModel.create({
      timestamp: new Date().getTime(),
      name,
      wordNum,
      remarks,
      studyTime,
    })
      .then(() => {
        // 方糖微信推送
        const textInfo = `字数${wordNum || 0}时长${studyTime || 0}${remarks || '-'}`;
        const url = `https://sctapi.ftqq.com/SCT126202TxJAfd3wMPfbXHjrjSEFUbMXZ.send?title=${textInfo.replace(
          /\n/g,
          ''
        )}`;
        try {
          request(
            {
              url: encodeURI(url),
            },
            (err, data, body) => {
              res.send({
                status: 200,
                msg: 'ok',
              });
            }
          );
        } catch {
          res.send({
            status: 200,
            msg: 'ok',
          });
        }
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
