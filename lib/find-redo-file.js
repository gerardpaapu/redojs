const fs = require('fs');
const P = require('path');
const promisify = require('util').promisify;
const exists = promisify(fs.exists);

module.exports = async function (wd, filename) {
    const ext = P.extname(filename);
    const forFile = `${filename}.do.js`;
    const forExt = `default.${ext}.do.js`;
    const forAll = 'default.do.js';

    if (await exists(forFile)) {
        return forFile;
    }

    if (await exists(forExt)) {
        return forExt;
    }

    if (await exists(forAll)) {
        return forAll;
    }

    // TODO: start looking up the folder hierarchy
    throw new Error('No do-file found');
}; 