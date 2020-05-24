const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const names = require('./team-names.json');

let videos = getAllVideos();

/*videos = videos.concat(getAllVideos()); */

const files = {
    all: () => videos,
    get: (id) => videos.find(element => element.id === id),
};

module.exports = files;


function getAllVideos() {
    let result = [];
    const videoPath = '/home/talos/Videos/NHL/';
    const extension = '.mkv';

    let fileNames = fs.readdirSync(videoPath)
        .filter(function(element) {
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

        temp.id = crypto.createHash('SHA1', ).update(file).digest('base64');
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
