#!/usr/bin/env node
const parseArgs = require("minimist");
const path = require("path");
const { mkdir, access, readdir, copyFile } = require("fs/promises");
const { constants } = require("fs");
const { version } = require("process");

const MODE_0666 = parseInt("0666", 8);
const MODE_0755 = parseInt("0755", 8);
const TEMPLATE_DIR = path.join(__dirname, "..", "templates");
const VERSION = require("../package").version;

// parse args
let unknown = [];
let options = parseArgs(process.argv.slice(2), {
    alias: {
        h: "help",
        v: "version"
    },
    unknown: function (s) {
        if (s.charAt(0) === "-") unknown.push(s);
    }
});

options["!"] = unknown;

main(options);

async function main(argv) {
    if (argv["!"].length > 0) {
        console.error(`unknown option "${options["!"][0]}"`);
    } else if (argv.version) {
        console.log(VERSION);
    } else if (argv.help) {
        help();
    } else {
        let projectPath = path.resolve("./");
        if (!projectPath.endsWith("/")) projectPath = projectPath.concat("/");

        let thinDir = await checkThinDir(projectPath),
            thinuiDir = "";

        thinuiDir = thinDir ? `${thinDir}/thinui` : `${projectPath}/thinbuilder/thinui`;

        try {
            await mkdir(thinuiDir, { recursive: true, mode: MODE_0755 });
            await loadTemplate(thinuiDir);
        } catch (err) {
            console.error(err);
        }
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

/**
 * 加载UI模板
 * @param {String} destpath
 */
async function loadTemplate(destpath) {
    let js_path = path.join(TEMPLATE_DIR, "js");
    const files = await readdir(js_path, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) await copyFile(`${js_path}/${file.name}`, `${destpath}/${file.name}`);
    }
}

function help() {
    console.log("");
    console.log("  Usage: thinui [options] [dir]");
    console.log("");
    console.log("  Options:");
    console.log("");
    console.log("    -v, --version           output the version number");
    console.log("    -h, --help              output help information");
}
