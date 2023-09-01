module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const fs = require('fs');

  const descMap = [
    '国（境）外人员培训量',
    '在校生服务“走出去”企业国（境）外实习时间',
    '教师赴国（境）外指导和开展培训',
    '国（境）外专业性组织担任职务',
    '开发并被国（境）外采用的专业教学标准数',
    '开发并被国（境）外采用的课程标准数',
    '国（境）外技能大赛获奖数量',
    '国（境）外办学点数量',
  ];

  const yearMap = [2017, 2018, 2019, 2020];
  // 获取每年统计数据
  function getYearData(tableData, index) {
    const arr = [];
    for (let i of descMap) {
      let insertFlag = false;
      for (let j = 0; j < tableData.length; j++) {
        for (let k = 0; k < tableData[j].length; k++) {
          if (tableData[j][k] && tableData[j][k].includes(i)) {
            insertFlag = true;
            if (tableData[j][index] && tableData[j][index].length < 9) {
              arr.push(tableData[j][index]);
            } else {
              arr.push('N');
            }
            break;
          }
        }
      }
      !insertFlag && arr.push('—');
    }
    return arr;
  }
  // 获取大学名称
  function getCollege(tableData) {
    const collegeIndex = [];
    for (let i = 0; i < tableData[0].length; i++) {
      if (tableData[0][i] && tableData[0][i].includes('院校')) {
        collegeIndex.push(i);
      }
    }
    for (let i = 1; i < tableData.length; i++) {
      for (let j of collegeIndex) {
        if (tableData[i][j] && (tableData[i][j].includes('大学') || tableData[i][j].includes('学院'))) {
          return tableData[i][j];
        }
      }
    }
    return null;
  }

  // 表格去重
  function uniqueTable(tableData) {
    const tmpArr = [];
    for (let i of tableData) {
      let insertFlag = true;
      for (let j of i) {
        for (let m of tmpArr) {
          if (m instanceof Array) {
            for (let n of m) {
              if (j && n && n.length > 6 && j === n) {
                insertFlag = false;
                break;
              }
            }
          }
        }
      }
      insertFlag && tmpArr.push(i);
    }
    // for (let i = 1; i < tmpArr.length; i++) {
    //   if (tmpArr[i] && tmpArr[i].length !== tmpArr[0].length) {
    //     tmpArr.splice(i, 1);
    //     i--
    //   }
    // }
    return tmpArr;
  }

  // 获取CSV内容
  function getCsvContent(tableData, filename) {
    const csvArr = [];
    for (let i = 0; i < tableData[0].length; i++) {
      for (let j of yearMap) {
        if (tableData[0][i] && tableData[0][i].includes(j)) {
          csvArr.push([filename, getCollege(tableData), tableData[0][i], ...getYearData(tableData, i)]);
        }
      }
    }
    return csvArr;
  }

  app.get('/pdf-analyse', (req, res) => {
    const tableData = JSON.parse(req.query.data);
    fs.writeFileSync('./convert/test.txt', req.query.data);
    let csvStr = '';
    const csvArr = getCsvContent(uniqueTable(tableData), req.query.filename);
    for (let item of csvArr) {
      csvStr += item.join(',') + '\n';
    }

    fs.appendFile(`./convert/${req.query.cate || 'noCate'}.csv`, csvStr, function (err) {
      if (err) console.log(err, '---->csv<---');
    });
    res.send('ok');
  });

  app.use('/', router);
};
