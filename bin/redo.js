#!/usr/bin/env node
const P = require('path');
const C = require('crypto');
const OS = require('os');
const F = require('fs');
const U = require('util');

const findRedoFile = require('../lib/find-redo-file');
const findRedoDB = require('../lib/find-redo-db');
const rename = U.promisify(F.rename);

async function main(target) {
    process.env.REDO_DB = await findRedoDB();
    const basename = P.basename(target);
    const redoFile = await findRedoFile(
        process.cwd(),
        target
    );

    const temp = P.join(OS.tmpdir(), C.randomBytes(4).readUInt32LE(0).toString());
    const doFunction = require(P.resolve(process.cwd(), redoFile));

    await doFunction(target, basename, temp);
    await rename(temp, target);
}

const USAGE = `redo target; rebuild target and target's dependencies
redo -h or --help; show usage info
redo -v or --version; show version info
`;
const VERSION_INFO = `redo v1.0.0
`;

const [_, __, $2] = process.argv;
switch ($2) {
    case undefined: case null:
        process.exitCode = 1;
        process.stderr.write('No target provided\n');
        process.stderr.write(USAGE);
        break;

    case '-h': case '--help':
        process.stdout.write(USAGE);
        break;

    case '-v': case '--version':
        process.stdout.write(VERSION_INFO);
        break;

    default:
        main($2).catch(err => {
            process.exitCode = 1;
            process.stderr.write(`REDO Failed: ${err}\n`);
        });
}