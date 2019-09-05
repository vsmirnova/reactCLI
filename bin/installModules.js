const inquirer = require('inquirer');
let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');
let colors = require('colors');

function installModules(appDirectory) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(`${appDirectory}/node_modules`)) {
            shell.exec(`npm install`, { cwd: appDirectory });
        }
        shell.exec(`npm install -S react-router-dom axios redux react-redux redux-saga connected-react-router history redux-logger reselect prop-types`, { cwd: appDirectory }, (error, stdout, stderr) => {
            if (error) {
                reject()
            } else resolve()
        });

    })
}

module.exports = installModules;
