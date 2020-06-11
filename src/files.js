const { promises: fs } = require('fs');
const path = require('path');

const files = {
    all: async (root) => {
        let files = await fs.readdir(root);

        files = files.filter(item => !(/(^|\/)\.[^/.]/g).test(item));

        for (let i = 0; i < files.length; i++) {
            let stats = await fs.stat(path.join(root, files[i]));

            files[i] = {
                name: files[i],
                accessed: stats.atime,
                modified: stats.mtime,
                created: stats.birthtime
            };

            if (stats.isDirectory()) {
                files[i].type = 'directory';
            } else if (stats.isFile()) {
                files[i].type = 'file';
            }
        }

        return files;
    },
};

module.exports = files;
