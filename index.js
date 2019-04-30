#!/usr/bin/env node
let program = require('commander');
let shell = require('shelljs');

program
    .version('2.0.8')
    .command('init <dir>')
    .option('-T , --typscript', 'Install with typescript')
    .action(function (dir, cmd) {
        console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
    })

program.parse(process.argv)

