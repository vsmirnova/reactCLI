let shell = require("shelljs");
const path = require('path');
let colors = require('colors');

function createReactApp(projectDirectory, projectName) {
    return new Promise((resolve, reject) => {
        console.log("Creating react app...".yellow);
        shell.exec(
            `node ${path.resolve(
                __dirname,
                "../"
            )}/node_modules/create-react-app/index.js ${projectName}`,
            (e, stdout, stderr) => {
                console.log("e", e);
                console.log("stdout", stdout);
                console.log("stderr", stderr);
                if (e) {
                    if (e === 1) {
                        console.log(`create-react-app not installed`.red);
                        console.log("Installing create-react-app...".yellow);
                        shell.exec(
                            `npm install -g create-react-app`,
                            (e, stdout, stderr) => {
                                if (stderr) {
                                    reject();
                                } else {
                                    console.log("Finished installing create-react-app".green);
                                    createReactApp()
                                        .then(() => resolve())
                                        .catch(() => reject());
                                }
                            }
                        );
                    } else {
                        reject();
                    }
                } else {
                    resolve();
                }
            }
        );
    });
}

module.exports = createReactApp;
