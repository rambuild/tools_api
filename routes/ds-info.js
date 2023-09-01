module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const DsInfo = require('../db/model/supervisor-info');
  const AllInfos = require('../db/model/school-unit-info');

  router.post('/getInfos', (req, res) => {
    judgeRunning(res, async () => {
      const { pagenum, pagesize, ...queryParams } = req.body;
      if (!pagenum || !pagesize) {
        res.send({
          status: 401,
          msg: '缺少pagenum或pagesize参数',
        });
        return;
      }
      const formatParams = {};
      Object.keys(queryParams).forEach(key => {
        queryParams[key] && (formatParams[key] = queryParams[key]);
      });
      const total = await DsInfo.find({ ...formatParams }).countDocuments();

      DsInfo.find({ ...formatParams })
        .skip(+pagesize * (+pagenum - 1))
        .limit(+pagesize)
        .then(result => {
          res.send({
            status: 200,
            msg: '获取成功',
            result,
            total,
          });
        })
        .catch(e => {
          res.send({
            status: 400,
            msg: e.message,
          });
        });
    });
  });

  router.get('/getAllColleges', (req, res) => {
    judgeRunning(res, () => {
      AllInfos.find({}).then(result => {
        res.send({
          status: 200,
          msg: '获取成功',
          lists: result[0].universities,
        });
      });
    });
  });

  router.get('/getAllSchoolCates', (req, res) => {
    judgeRunning(res, () => {
      AllInfos.find({}).then(result => {
        res.send({
          status: 200,
          msg: '获取成功',
          lists: result[0].school_cates,
        });
      });
    });
  });

  // 接口开关控制
  router.post('/switchRunning', (req, res) => {
    const { verifyCode, runningFlag } = req.body;
    if (!verifyCode || verifyCode !== '1024666') {
      res.send({
        status: 401,
        msg: 'not authorized',
      });
    } else {
      AllInfos.updateOne({ _id: '61f65e0c2a1db921e7982b50' }, { runningFlag }).then(result => {
        if (result.nModified) {
          res.send({
            status: 200,
            msg: 'ok',
          });
        } else {
          res.send({
            status: 400,
            msg: 'not modified',
          });
        }
      });
    }
  });

  router.get('/runningStatus', (req, res) => {
    AllInfos.find({ _id: '61f65e0c2a1db921e7982b50' }).then(result => {
      if (result.length) {
        res.send(result[0].runningFlag || false);
      } else {
        res.send(false);
      }
    });
  });

  const judgeRunning = (res, cb) => {
    AllInfos.find({ _id: '61f65e0c2a1db921e7982b50' }).then(result => {
      if (result.length) {
        if (!result[0].runningFlag) {
          res.send({
            status: 500,
            msg: 'Service not running',
          });
        } else {
          cb && cb();
        }
      }
    });
  };
  app.use('/ds-info', router);
};
