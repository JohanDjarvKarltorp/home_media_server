const { spawn } = require('child_process');

const ffmpeg = {
    convert: (input, res) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', input,
            '-c', 'copy',
            '-f',  'ismv',
            'pipe:'
        ]);

        ffmpeg.stdout.pipe(res);

        ffmpeg.stderr.on('data', (line) => {
            if (line.includes("frame")) {
                console.log(line.toString());
            }
        });

        ffmpeg.on('close', () => {
            console.log("Finished converting video");
        });
    },
};

module.exports = ffmpeg;
