#!/usr/bin/env node

const parseArgs = require("minimist");
const path = require("path");
const { mkdir, access, readdir, copyFile, cp } = require("fs/promises");
const { constants } = require("fs");

const MODE_0666 = parseInt("0666", 8);
const MODE_0755 = parseInt("0755", 8);
const TEMPLATE_DIR = path.join(__dirname, "..", "templates");
const VERSION = require("../package").version;

// parse args
let unknown = [],
    options = parseArgs(process.argv.slice(2), {
        alias: {
            h: "help",
            v: "version"
        },
        unknown: function (s) {
            if (s.charAt(0) === "-") unknown.push(s);
        }
    });
options["!"] = unknown;

/**
 * 运行主程序
 */
main(options);

/**
 * 定义主程序
 * @param {Array} argv
 */
function main(argv) {
    if (argv["!"].length > 0) {
        console.error(`unknown option "${options["!"][0]}"`);
    } else if (argv.version) {
        console.log(VERSION);
    } else if (argv.help) {
        help();
    } else {
        doCLI();
    }
}

/**
 * 脚手架
 */
async function doCLI() {
    let projectPath = path.resolve("./");
    if (!projectPath.endsWith("/")) projectPath = projectPath.concat("/");

    let thinDir = await checkThinDir(projectPath),
        typesDir = projectPath.concat("node_modules/@types/thinui2"),
        stylesDir = projectPath.concat("public/thinui"),
        scriptDir = thinDir ? `${thinDir}/thinui` : `${projectPath}/thinbuilder/thinui`;

    try {
        await mkdir(scriptDir, { recursive: true, mode: MODE_0755 });
        await loadTemplate(scriptDir);

        await mkdir(stylesDir, { recursive: true, mode: MODE_0755 });
        await loadStyles(stylesDir);

        await mkdir(typesDir, { recursive: true, mode: MODE_0755 });
        await loadTypes(typesDir);
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

/**
 * 加载UI模板
 * @param {String} destpath
 */
async function loadTemplate(destpath) {
    let js_path = path.join(TEMPLATE_DIR, "js");
    await cp(js_path, destpath, { recursive: true });
}

/**
 * 加载样式模板
 * @param {String} destpath
 */
async function loadStyles(destpath) {
    let css_path = path.join(TEMPLATE_DIR, "css");
    const files = await readdir(css_path, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) await copyFile(`${css_path}/${file.name}`, `${destpath}/${file.name}`);
    }
}

/**
 * 加载类型文件
 * @param {String} destpath
 */
async function loadTypes(destpath) {
    let js_path = path.join(TEMPLATE_DIR, "types");
    const files = await readdir(js_path, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) await copyFile(`${js_path}/${file.name}`, `${destpath}/${file.name}`);
    }
}

/**
 * 帮助信息
 */
function help() {
    console.log("");
    console.log("  Usage: thinui [options]");
    console.log("");
    console.log("  Options:");
    console.log("");
    console.log("    -v, --version           output the version number");
    console.log("    -h, --help              output the help information");
}
