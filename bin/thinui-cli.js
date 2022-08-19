#!/usr/bin/env node
const parseArgs = require("minimist");
const path = require("path");

function main(argv) {
    let url = path.resolve("./");
    console.log("this is a thin ui.");
    console.log("project path: ".concat(url, ",argv:", argv));
}

main(process.argv.slice(2));
