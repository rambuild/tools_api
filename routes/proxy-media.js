module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const fs = require('fs');

  router.get('/static/media/*', (req, res, next) => {
    const splitUrl = req.url.split('/');
    const filename = splitUrl[splitUrl.length - 1];
    let path = __dirname + '/../../static/local/media/' + filename;
    if (fs.existsSync(path)) {
      let stat = fs.statSync(path);
      let fileSize = stat.size;
      let range = req.headers.range;
      if (range) {
        //有range头才使用206状态码

        let parts = range.replace(/bytes=/, '').split('-');
        let start = parseInt(parts[0], 10);
        let end = parts[1] ? parseInt(parts[1], 10) : start + 1599999; // 分段传输大小为1.6M

        // end 在最后取值为 fileSize - 1
        end = end > fileSize - 1 ? fileSize - 1 : end;

        let chunksize = end - start + 1;
        let file = fs.createReadStream(path, { start, end });
        let head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        let head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    } else {
      next();
    }
  });

  app.use('/', router);
};
