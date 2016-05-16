#!/usr/bin/env node

'use strict';
var jtests = require('./');
var optimist = require('optimist');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var util = require('util');

var argv = optimist
  .usage('$0 input1.js [input2.js] -o output')
  .alias('d', 'desc')
  .describe('desc', 'describe text.')
  .string('d')

  .alias('t', 'timeout')
  .describe('t', 'timeout.')
  .string('t')

  .alias('o', 'output')
  .describe('o', 'output file.')
  .string('o')

  .alias('h', 'head')
  .describe('h', 'head file.')
  .string('h')

  .alias('v', 'version')
  .describe('v', 'Print version number and exit.')
  .wrap(80)
  .argv;

if (argv.version) {
  var json = require('./package.json');
  console.log(json.name + ' ' + json.version);
  return;
}

if (argv._.length < 1) {
  console.error('The input file is not specified.');
  return;
}

var contents = [];
var filenames = [];
var header;
if (argv.head) {
  header = String(fs.readFileSync(argv.head));
}
argv._.forEach(function (filename) {
  filenames.push(filename);
  contents.push(jtests.build(fs.readFileSync(filename), {
    desc: argv.desc || filename,
    timeout: argv.timeout,
    header: header
  }), null, '  ');
});
var content = contents.join('\n');
if (argv.output) {
  mkdirp(path.dirname(argv.output));
  fs.writeFileSync(argv.output, content);
  console.log(util.format('%j jtests output complete.', filenames));
}
else {
  console.log(content);
}