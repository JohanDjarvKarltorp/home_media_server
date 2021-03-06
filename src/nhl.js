const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config/media_server');
const names = require('./team-names.json');

let videos = getAllVideos();

const nhl = {
    all: () => videos,
    get: (id) => videos.find(element => element.id === id),
};

module.exports = nhl;


function getAllVideos() {
    let result = [];
    const extension = '.mkv';

    let fileNames = fs.readdirSync(config.NHL.root).filter(function(element) {
        return path.extname(element) === extension;
    });

    fileNames.forEach(file => {
        let temp = {};
        let singleSplit = 0;
        let ThreeCapitalLetters = /[A-Z][A-Z][A-Z]/g;
        let awayIndex = 0;
        let homeIndex = 1;
        let start = 0;
        let end = 11;
        let teams = file.match(ThreeCapitalLetters);

        temp.id = crypto.createHash('SHA1', ).update(file).digest('hex');
        temp.id = temp.id.slice(start, end);
        temp.filename = file;
        temp.date = file.split('_')[singleSplit];
        temp.teams = {};
        temp.teams.home = { name: names[teams[homeIndex]], abbr: teams[homeIndex] };
        temp.teams.away = { name: names[teams[awayIndex]], abbr: teams[awayIndex] };

        result.push(temp);
    });
    return result.reverse();
}
