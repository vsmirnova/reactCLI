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
            .then(async answers => {
                if (!fs.existsSync(`${appDirectory}/node_modules`)) {
                    await shell.exec(`npm install`, { cwd: appDirectory });
                }
                await shell.exec(`npm install -S ${answers.modules.join(' ')}`, { cwd: appDirectory });
                await resolve({isRouter: answers.modules.includes('react-router-dom'), isRedux: answers.modules.includes('react-redux')})
            });
    })
}

module.exports = addModules;
