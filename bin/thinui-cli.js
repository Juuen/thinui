#!/usr/bin/env node
const parseArgs = require("minimist");
const path = require("path");
const { mkdir, access } = require("fs/promises");
const { constants } = require("fs");

async function main(argv) {
    let projectPath = path.resolve("./");
    if (!projectPath.endsWith("/")) projectPath = projectPath.concat("/");

    let thinDir = await checkThinDir(projectPath);

    console.log("this is a thin ui.");
    console.log("project path: ".concat(projectPath, ",argv:", argv));
}

async function checkThinDir(base) {
    let thinDir = "";

    try {
        await access(base.concat("thinbuilder"), constants.R_OK | constants.W_OK);
        thinDir = "thinbuilder";
    } catch {}
    if (thinDir) return thinDir;

    try {
        await access(base.concat("jsbuilder"), constants.R_OK | constants.W_OK);
        thinDir = "jsbuilder";
    } catch {}
    if (thinDir) return thinDir;

    try {
        await mkdir(base.concat("thinbuilder"), { recursive: true });
        return "thinbuilder";
    } catch (err) {
        console.error(err);
        return "";
    }
}

main(process.argv.slice(2));
