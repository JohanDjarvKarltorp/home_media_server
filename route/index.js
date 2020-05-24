'use strict';
const express = require('express');
const fs = require('fs');
const router = express.Router();
const files = require('../src/files.js');
let data;



router.get('/', async (req, res) => {
    data = {
        title: 'Home media server'
    };

    data.res = await files.all();
    res.render('index', data);
});

router.get('/watch', (req, res) => {
    let id = req.query['v'];
    let file = files.get(id);
    const path = `/home/talos/Videos/NHL/${file.filename}`;
    const stat = fs.statSync(path);
    const range = req.headers.range;
    const fileSize = stat.size;
    // eslint-disable-next-line no-magic-numbers
    const belowFileSize = fileSize-1;
    const httpOK = 200;
    const httpRangeNotSatisfiable = 416;
    const httpPartialContent = 206;
    const startIndex = 0;
    const endIndex = 1;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[startIndex]);
        const end = parts[endIndex] ? parseInt(parts[endIndex]) : belowFileSize;

        if (start >= fileSize) {
            res.status(httpRangeNotSatisfiable)
                .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);

            return;
        }

        // eslint-disable-next-line no-magic-numbers
        const chunkSize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(httpPartialContent, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(httpOK, head);
        fs.createReadStream(path).pipe(res);
    }
});

module.exports = router;
