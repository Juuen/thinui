#!/usr/bin/env node
const parseArgs = require("minimist");
const path = require("path");
const { mkdir, access, readdir, copyFile } = require("fs/promises");
const { constants } = require("fs");

main(process.argv.slice(2));

async function main(argv) {
    let projectPath = path.resolve("./");
    if (!projectPath.endsWith("/")) projectPath = projectPath.concat("/");

    let thinDir = await checkThinDir(projectPath),
        thinuiDir = "";

    thinuiDir = thinDir ? `${thinDir}/thinui` : `${projectPath}/thinbuilder/thinui`;

    try {
        await mkdir(thinuiDir, { recursive: true });
        await loadTemplate(thinuiDir);
    } catch (err) {
        console.error(err);
    }
}

/**
 * 检查THINJS目录
 * @param {String} base
 * @returns
 */
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

async function loadTemplate(destpath) {
    let js_path = path.join(__dirname, "..", "templates/js");
    const files = await readdir(js_path, { withFileTypes: true });
    for (const file of files) {
        file.isFile() && (await copyFile(`${js_path}/${file.name}`, `${destpath}/${file.name}`));
    }
}
