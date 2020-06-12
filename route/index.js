'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const config = require('../config/media_server');
const nhl = require('../src/nhl');
const files = require('../src/files');
const ffmpeg = require('../src/ffmpeg');
let data;

router.get('/', (req, res) => {
    data = {
        title: 'Home media server'
    };

    res.render('home', data);
});

router.get('/NHL', async (req, res) => {
    data = {
        title: 'Home media server | NHL'
    };

    data.res = await nhl.all();
    res.render('NHL', data);
});

router.get('/:root', async (req, res) => {
    let root = req.params.root;
    let directory = req.query.d === undefined ? [] : req.query.d.split(",");
    let page = req.query.p === undefined ? 1 : req.query.p;

    data = {
        title: `Home media server | ${root} | ${directory.join(" | ")} `,
        path: {
            root: root,
            directories: directory,
        },
        page: page
    };

    let fullPath = path.join(config[root].root, path.join(...directory));

    req.app.use('/static', express.static(fullPath));
    data.res = await files.all(fullPath);

    res.render('index', data);
});

router.get('/watch', (req, res) => {
    let id = req.query.v;
    let file = nhl.get(id);
    let path = path.join(config.NHL.root, file.filename);
    const stat = fs.statSync(path);
    const range = req.headers.range;
    const fileSize = stat.size;
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

        const chunkSize = (end-start)+1;
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(httpPartialContent, head);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(httpOK, head);
    }

    ffmpeg.convert(path, res);
});

module.exports = router;
