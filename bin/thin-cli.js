#!/usr/bin/env node

const path = require("path");

main({}, exit);

/**
 * Graceful exit for async STDIO
 */

function exit(code) {
    // flush output for Node.js Windows pipe bug
    // https://github.com/joyent/node/issues/6247 is just one bug example
    // https://github.com/visionmedia/mocha/issues/333 has a good discussion
    function done() {
        if (!draining--) process.exit(code);
    }

    var draining = 0;
    var streams = [process.stdout, process.stderr];

    exit.exited = true;

    streams.forEach(function (stream) {
        // submit empty write request and wait for completion
        draining += 1;
        stream.write("", done);
    });

    done();
}

function main(options, done) {
    let url = path.resolve("./");
    console.log("this is a thin ui.");
    console.log("project path: ".concat(url));
    done(0);
}
