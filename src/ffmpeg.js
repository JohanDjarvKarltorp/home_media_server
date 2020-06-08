const { spawn } = require('child_process');

const ffmpeg = {
    convert: async (input, res) => {
        const ffmpegChild = spawn('ffmpeg', [
            '-i', input,
            '-c', 'copy',
            '-f',  'ismv',
            'pipe:'
        ]);

        let duration = await ffmpeg.getDuration(input);
        let oldPercentage = 0;

        ffmpegChild.stdout.pipe(res);
        ffmpegChild.stderr.on('data', (line) => {
            if (line.includes("frame")) {
                let progress = parseProgressLine(line.toString());
                let bufferTime = timeToSeconds(progress.time);
                let percentage = Math.round(bufferTime / timeToSeconds(duration) * 100);

                if (percentage > oldPercentage) {
                    oldPercentage = percentage;
                    console.log('Progress: \x1b[33m%s%\x1b[0m', percentage);
                }
            }
        });

        ffmpegChild.on('close', () => {
            console.log("Finished converting video");
        });
    },
    getDuration: (input) => {
        const ffprobe = spawn('ffprobe', [input]);

        return new Promise(function(resolve) {
            ffprobe.stderr.on('data', (data) => {
                if (data.includes("Input")) {
                    let output  = data.toString();
                    let regex = /\d+:\d+:\d+.\d+/;
                    let matched = 0;

                    resolve(RegExp(regex, 'g').exec(output)[matched]);
                }
            });
        });
    }
};

module.exports = ffmpeg;

function parseProgressLine(line) {
    let progress = {};

    // Remove all spaces after = and trim
    let string  = line.replace(/=\s+/g, '=').trim();

    let data = string.split(' ');

    for (let i = 0; i < data.length; i++) {
        let stringSplit = data[i].split('=');
        let key = stringSplit[0];
        let value = stringSplit[1];

        progress[key] = value;
    }

    return progress;
}

/**
 * Convert a [[hh:]mm:]ss[.xxx] time into seconds
 */
let timeToSeconds = function(time) {
    let parts = time.split(':');

    // add seconds
    let secs = Number(parts.pop());

    if (parts.length) {
        // add minutes
        secs += Number(parts.pop()) * 60;
    }

    if (parts.length) {
        // add hours
        secs += Number(parts.pop()) * 3600;
    }

    return secs;
};
