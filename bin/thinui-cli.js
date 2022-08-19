#!/usr/bin/env node
const parseArgs = require("minimist");
const path = require("path");
const { mkdir, access } = require("fs/promises");
const { constants } = require("fs");

main(process.argv.slice(2));

async function main(argv) {
    let projectPath = path.resolve("./");
    if (!projectPath.endsWith("/")) projectPath = projectPath.concat("/");

    let thinDir = await checkThinDir(projectPath),
        thinuiDir = "";
    console.log(thinDir);
    thinuiDir = thinDir ? `${thinDir}/thinui` : `${projectPath}/thinbuilder/thinui`;
    console.log(thinuiDir);
    try {
        await mkdir(thinuiDir, { recursive: true });
    } catch (err) {
        console.error(err);
    }
    console.log(thinDir);
    console.log("project path: ".concat(projectPath, ",argv:", argv));
}

async function checkThinDir(base) {
    let thinDir = "";

    try {
        await access(base.concat("thinbuilder"), constants.R_OK | constants.W_OK);
        thinDir = base.concat("thinbuilder");
    } catch {}
    if (thinDir) return thinDir;

    try {
        await access(base.concat("jsbuilder"), constants.R_OK | constants.W_OK);
        thinDir = base.concat("jsbuilder");
    } catch {}

    return thinDir;
}
