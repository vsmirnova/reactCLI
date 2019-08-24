const inquirer = require('inquirer');
let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');
let colors = require('colors');

function addModules(appDirectory) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(`${appDirectory}/node_modules`)) {
            shell.exec(`npm install`, { cwd: appDirectory });
        }
        shell.exec(`npm install -S react-router-dom axios react-redux redux-saga connected-react-router history redux-logger reselect`, { cwd: appDirectory }, (error, stdout, stderr) => {
            console.log('error', error);
            if (error) {
                reject()
            } else resolve()
        });

    })
}

module.exports = addModules;
