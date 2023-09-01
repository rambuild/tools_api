const express = require('express');
const router = express.Router();
const upCategory = require('../db/model/upCategory');
const upFansStat = require('../db/model/upFansStat');
const upFansStatLog = require('../db/model/logs/UpFansStatLog');
const getCurrentTime = require('../utils/getCurrentTime');
const request = require('request');
// 定时任务
const schedule = require('node-schedule');
const dayjs = require('dayjs');
const delay = require('../utils/delay');
const uniqueArr = require('../utils/uniqueArr');
const scheduleRule = new schedule.RecurrenceRule();
// scheduleRule.minute = [0, 10, 20, 30, 40, 50];
scheduleRule.minute = 0;

// 定时记录
const fansStat = () => {
  schedule.scheduleJob(scheduleRule, async () => {
    let upList = await upCategory.find();
    for (let i = 0; i < upList.length; ++i) {
      request(
        {
          url: `https://api.bilibili.com/x/relation/followers?vmid=${upList[i].mid}&pn=1&ps=1&order=desc&callback=__jp19`,
        },
        async (err, result, body) => {
          let bodyObj = JSON.parse(body);
          let totalNum = bodyObj.data.total;
          await upFansStat.create({
            fromNickname: upList[i].nickname,
            from: upList[i]._id,
            fansNum: totalNum,
            recordTime: dayjs(new Date()).format('MM-DD HH:mm'),
            timestamp: new Date().getTime(),
          });
        }
      );
      // 延迟1秒再循环
      await delay(1000);
    }
  });
};

module.exports = {
  periodicTasks: fansStat,
  main(app) {
    // 获取用户点赞数量
    router.get('/praise', async (req, res) => {
      // 获取用户IP
      let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      // 获取点赞的数量
      let praisedArr = await upFansStatLog.find({ isPraised: true });
      let praisedMapArr = praisedArr.map(i => {
        return {
          isPraised: i.isPraised,
          uip: i.uip,
          visitedTime: i.visitedTime,
          praisedTime: i.praisedTime,
        };
      });
      let curUser = await upFansStatLog.find({ uip });
      // 当前用户是否点赞
      let curUserIsPraised = false;
      // 判断已记录的数量
      let recordedItems = await upFansStat.find();
      let recordedNum = recordedItems.length;
      curUser.forEach(i => {
        if (i.isPraised == true) {
          return (curUserIsPraised = true);
        }
      });
      res.send({
        status: 200,
        totalPraised: praisedMapArr,
        praisedNum: praisedArr.length,
        curUip: uip,
        curUserIsPraised,
        recordedNum,
      });
    });
    // 用户点赞接口
    router.post('/praise', async (req, res) => {
      //获取用户IP
      let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      upFansStatLog.update(
        { uip },
        {
          $set: {
            isPraised: true,
            praisedTime: getCurrentTime(),
          },
        },
        (err, data) => {
          if (err) {
            return res.send({
              status: 400,
              msg: '点赞失败',
            });
          } else {
            res.send({
              status: 200,
              msg: '点赞成功',
            });
          }
        }
      );
    });
    // 获取统计数据
    router.get('/fansStat', async (req, res) => {
      let { mid } = req.query;
      let curUp = await upCategory.find({ mid });
      let dataList = await upFansStat.find({ from: curUp[0].id });

      // let dataList = await upFansStat.find()
      let upList = await upCategory.find();
      let upNameList = upList.map(i => {
        return {
          nickname: i.nickname,
          mid: i.mid,
        };
      });
      let result = [];
      let timeList = [];
      dataList.forEach(i => {
        timeList.push(i.recordTime);
      });
      // 时间列表数组
      timeList = uniqueArr(timeList);
      let count = 0;
      for (let j = 0; j < timeList.length; ++j) {
        result[count] = {};
        dataList.forEach(i => {
          if (timeList[j] == i.recordTime) {
            result[count].日期 = i.recordTime;
            result[count][i.fromNickname] = i.fansNum;
          }
        });
        ++count;
      }

      res.send({
        data: result,
        upList: upNameList,
      });
    });

    // 添加要记录的UP主
    router.post('/addUp', async (req, res) => {
      let { nickname, mid, verify } = req.body;
      let upList = await upCategory.find();
      if (verify != '1024666') {
        return res.send({ status: 400, msg: '验证失败' });
      }
      if (upList.length >= 100) {
        return res.send({ status: 400, msg: '已达到最大记录数量' });
      } else {
        await upCategory.create(
          {
            nickname,
            mid,
            addTime: getCurrentTime(),
          },
          (err, data) => {
            if (!err) {
              res.send({
                status: 200,
                data: data,
                msg: '添加成功',
              });
            } else {
              res.send({ status: 400, msg: '该UP主已存在' });
            }
          }
        );
      }
    });

    // 获取B站粉丝接口及日志
    router.get('/fansQuery', (req, res, next) => {
      let { mid, pagenum, pagesize } = req.query;
      //获取用户ip
      let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      let time = getCurrentTime();
      request(
        {
          url: `https://api.bilibili.com/x/relation/followers?vmid=${mid}&pn=${pagenum}&ps=${pagesize}&order=desc&callback=__jp19`,
        },
        (err, result, body) => {
          request(
            {
              url: `https://api.bilibili.com/x/space/acc/info?mid=${mid}`,
            },
            (err, result2, body) => {
              // fs.appendFile(__dirname + '/../logs/bilifans_logs/bilifans.log', `${date}, ${uip} ,计次：${++biliFansTimes}\n`, (err) => { })
              var uname = '';
              if (JSON.parse(result2.body).data !== null) {
                uname = JSON.parse(result2.body).data.name;
              }
              res.send({
                data: result,
                uname,
              });
            }
          );
        }
      );
    });

    // 根据mid获取粉丝信息
    router.get('/fansInfo', (req, res) => {
      try {
        let mid = req.query.mid;
        request(
          {
            url: `https://api.bilibili.com/x/relation/stat?vmid=${mid}`, //用户关注和粉丝数
          },
          (err, result, body) => {
            let following = JSON.parse(result.body).data.following;
            let follower = JSON.parse(result.body).data.follower;
            request(
              {
                url: `https://api.bilibili.com/x/space/acc/info?mid=${mid}`, //用户各项数据
              },
              (err, result2, body) => {
                let sex = JSON.parse(result2.body).data.sex;
                let sign = JSON.parse(result2.body).data.sign;
                let face = JSON.parse(result2.body).data.face;
                let officialTitle = JSON.parse(result2.body).data.official.title;
                let top_photo = JSON.parse(result2.body).data.top_photo;
                let name = JSON.parse(result2.body).data.name;
                res.send({
                  name,
                  following,
                  follower,
                  sex,
                  sign,
                  face,
                  officialTitle,
                  top_photo,
                });
              }
            );
          }
        );
      } catch (e) {
        res.send({
          status: 500,
          msg: '未知错误',
        });
      }
    });

    app.use('/', router);
  },
};
