const inquirer = require('inquirer');
let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');
let colors = require('colors');

let questions = require('./questions');


function generatePackage(projectName, projectDirectory) {
    return new Promise((resolve, reject) => {
        console.log('Generate package.json'.yellow);
        fs.emptyDir(projectDirectory)
            .then(() => {
                fs.copy(path.resolve(__dirname, '../', 'templates', 'package.json'), `${projectDirectory}/package.json`)
                    .then(() => {
                        console.log('Copy')
                        inquirer
                            .prompt(questions(projectName))
                            .then(answers => {
                                console.log(answers)
                                let packageJsonStr = fs.readFileSync(`${projectDirectory}/package.json`, 'utf-8');
                                packageJsonStr = packageJsonStr.replace(/{{projectName}}/g, answers.name);
                                packageJsonStr = packageJsonStr.replace(/{{version}}/g, answers.version);
                                packageJsonStr = packageJsonStr.replace(/{{author}}/g, answers.author);
                                packageJsonStr = packageJsonStr.replace(/{{description}}/g, answers.description);
                                fs.writeFile(`${projectDirectory}/package.json`, packageJsonStr)
                                    .then(() => {
                                        resolve();
                                    })
                                    .catch(() => {
                                        reject();
                                    })
                            })
                            .catch(() => {
                                reject();
                            });
                    })
                    .catch(error => {
                        console.log('ERROR', error)
                    })
            });
    })
}

module.exports = generatePackage;
