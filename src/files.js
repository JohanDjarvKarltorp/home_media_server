const { promises: fs } = require('fs');
const path = require('path');

const files = {
    all: async (root) => {
        let all = await fs.readdir(root);
        let directories = [];
        let files = [];
        let images = [];
        let videos = [];

        all = all.filter(item => !(/(^|\/)\.[^/.]/g).test(item));

        for (let i = 0; i < all.length; i++) {
            let stats = await fs.stat(path.join(root, all[i]));

            all[i] = {
                name: all[i],
                size: convertBytes(stats.size),
                modified: stats.mtime,
                created: stats.birthtime
            };

            if (stats.isDirectory()) {
                all[i].type = 'directory';
                directories.push(all[i]);
            } else if (stats.isFile()) {
                if (isImage(all[i].name)) {
                    all[i].type = 'image';
                    images.push(all[i]);
                } else if (isVideo(all[i].name))  {
                    all[i].type = 'video';
                    videos.push(all[i]);
                } else {
                    all[i].type = 'file';
                    all[i].icon = getFileIcon(all[i].name);
                    files.push(all[i]);
                }
            }
        }

        return {directories: directories, images: images, videos: videos, files: files};
    },
};

module.exports = files;


const isImage = (file) => {
    let extensions = [".png", ".jpeg", ".jpg", ".gif", ".svg"];

    return extensions.includes(path.extname(file).toLowerCase());
};

const isVideo = (file) => {
    let extensions = [".mp4", ".mov"];

    return extensions.includes(path.extname(file).toLowerCase());
};

const getFileIcon = (file) => {
    let extensions = {
        archive: [".7z", ".arj", ".deb", ".pkg", ".rar", ".rpm", ".tar.gz", ".tgz", ".tar", ".z",
            ".zip"],

        excel: [".ods", ".xls", ".xlsm", ".xlsx", ".csv"],

        word: [".docx", ".doc"],

        pdf: [".pdf"],

        text: [".odt", ".rtf", ".tex", ".txt", ".wpd"],

        powerpoint: [".key", ".odp", ".pps", ".ppt", ".pptx"],

        audio: [".aif", ".cda", ".mid", ".midi", ".mp3", ".mpa", ".ogg", ".wav", ".wma", ".wpl"],

        code: [".html", ".xhtml", ".css", ".js", ".json", ".py", ".c", ".cpp", ".class", ".cs",
            ".h", ".java", ".ph", ".sh", ".swift", ".vb", ".php", ".apk", ".bat", ".bin", ".exe",
            ".wsf"]
    };

    for (const key in extensions) {
        if (extensions[key].includes(path.extname(file).toLowerCase())) {
            return key;
        }
    }
    return undefined;
};


const convertBytes = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes === 0) {
        return "n/a";
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    if (i === 0) {
        return bytes + " " + sizes[i];
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};
