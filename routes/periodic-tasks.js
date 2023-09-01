const { periodicTasks: recordBingPicTasks } = require('./pic-everyday');
const { periodicTasks: biliFansStat } = require('./bilibili-fans-tools');

// 必应每日壁纸统计
recordBingPicTasks();
// B站粉丝统计
biliFansStat();
