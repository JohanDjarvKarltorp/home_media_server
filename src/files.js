const { promises: fs } = require('fs');
const path = require('path');

const files = {
    all: async (root) => {
        let all = await fs.readdir(root);
        let directories = [];
        let files = [];

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
                if (getImage(all[i].name)) {
                    all[i].type = 'image';
                } else {
                    all[i].type = 'file';
                }

                files.push(all[i]);
            }
        }

        return {directories: directories, files: files};
    },
};

module.exports = files;


const getImage = (element) => {
    let extensions = [".png", ".jpeg", ".jpg", ".gif", ".svg"];

    return extensions.includes(path.extname(element).toLowerCase());
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
