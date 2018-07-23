const fs = require('fs');
const P = require('path');
const promisify = require('util').promisify;
const exists = promisify(fs.exists);

module.exports = async function findRedoDB(wd) {
    const path = P.join(wd, '.redo')
    if (await exists(path)) {
        return path;
    }

    const next = P.join(wd, '..');
    if (next === wd) {
        throw new Error('Couldn\'t find .redo directory');
    }

    return findRedoDB(next);
};