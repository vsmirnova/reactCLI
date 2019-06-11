const inquirer = require('inquirer');
let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');
let colors = require('colors');

function addModules(appDirectory) {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'modules',
                    message: 'add modules',
                    choices: [
                        { name: 'router', short: '1', value: 'react-router-dom', checked: true },
                        { name: 'axios', short: '2', value: 'axios', checked: true },
                        { name: 'redux', short: '3', value: 'react-redux', checked: true },
                        { name: 'saga', short: '4', value: 'redux-saga', checked: true },
                    ]
                }
            ])
            .then(answers => {
                console.log(answers.modules)
                shell.exec(`npm install`, { cwd: appDirectory });
                shell.exec(`npm install -S ${answers.modules.join(' ')}`, { cwd: appDirectory });
            })
    })
}

module.exports = addModules;
