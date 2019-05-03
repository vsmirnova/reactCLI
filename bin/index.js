#!/usr/bin/env node
let program = require('commander');
let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');
let readline = require('readline');
let colors = require('colors');
let projectName;
let projectDirectory;
const packageJson = require('../package.json');


let generatePackage = require('./generatePackage');
let copyProjectFiles = require('./copyProjectFiles');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program
    .version(packageJson.version)
    .command('init <dir>')
    .option('-W , --webpack', 'Install with webpack')
    .action(createProject)

program.parse(process.argv)

async function createProject(dir, cmd) {
    projectName = dir;
    projectDirectory = `${process.cwd()}/${projectName}`;

    if (fs.existsSync(projectDirectory)) {
        console.log('Directory already exists...'.red);
        process.exit(1);
    } else {
        if (cmd.webpack) {
            await generatePackage(projectName, projectDirectory)
                .then(async () => {
                    console.log('Created package.json'.green);
                    await copyProjectFiles(projectDirectory, projectName)
                        .then(() => {
                            console.log('SUCCESS!')
                        })
                        .catch(() => {
                            console.log('ERROR!')
                        })
                })
                .catch(() => {
                    console.log('Something went wrong while trying to create a new ReactApp'.red);
                    process.exit(1);
                })
        } else {
            await createReactApp()
                .then(async () => {
                    console.log('Finished creating new ReactApp'.green);
                    await installPackages();
                })
                .catch(() => {
                    console.log('Something went wrong while trying to create a new ReactApp'.red);
                    process.exit(1);
                })
        }

    }
}

function createReactApp() {
    return new Promise((resolve, reject) => {
        console.log('Creating react app...'.yellow);
        console.log(require('path').dirname(require.main.filename).bold());

        shell.exec(`node ${require('path').dirname(require.main.filename)}/node_modules/create-react-app/index.js ${projectName}`,
            (e, stdout, stderr) => {
                console.log('e', e);
                console.log('stdout', stdout);
                console.log('stderr', stderr);
                if (stderr) {
                    if (e === 1) {
                        console.log(`create-react-app not installed`.red);
                        console.log('Installing create-react-app...'.yellow);
                        shell.exec(`npm install create-react-app`, (e, stdout, stderr) => {
                            if (stderr) {
                                reject();
                            } else {
                                console.log("Finished installing create-react-app".green);
                                createReactApp()
                                    .then(() => resolve())
                                    .catch(() => reject())
                            }
                        });
                    } else {
                        reject();
                    }
                } else {
                    console.log('RRRRRRRRR');
                    resolve();
                }
            });
    })
}

function installPackages() {
    return new Promise((resolve, reject) => {
        rl.question('Install react-router? (yes/no)', (answer) => {
            if (answer === 'yes') {
                console.log('Installing react-router, react-router-dom ..'.yellow);
                shell.exec(`npm install --save react-router react-router-dom`, { cwd: projectDirectory, async : true }, (e) => {
                    console.log('Finished installing packages'.green);
                    resolve()
                });
            }
            rl.close();
        });
    })
}
