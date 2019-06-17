#!/usr/bin/env node
let program = require('commander');
let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');
let readline = require('readline');
let colors = require('colors');
const replace = require('replace');
const template = require('../templates/template-component');
let projectName;
let projectDirectory;
let newCompPath;
let functional;
let connect;
let isRedux;
let isRouter;
const packageJson = require('../package.json');


let generatePackage = require('./generatePackage');
let copyConfigFiles = require('./copyConfigFiles');
let installModules = require('./addModules');
let initSrcDirectory = require('./initSrcDirectory');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program
    .version(packageJson.version)
    .command('init <dir>')
    .option('-W , --webpack', 'Install with webpack')
    .action(createProject)
program
    .version(packageJson.version)
    .command('createComp <component>')
    .option('-C, --connect', 'Make connected')
    .option('-F, --functional', 'Create functional component')
    .action(createComponent);

program.parse(process.argv)

function setIsRouter (val) {
    isRouter = val
}

function setIsRedux (val) {
    isRedux = val
}

async function createProject(dir, cmd) {
    projectName = dir;
    projectDirectory = `${process.cwd()}/${projectName}`;

    if (fs.existsSync(projectDirectory)) {
        console.log('Directory already exists...'.red);
        process.exit(1);
    } else {
        if (cmd.webpack) {
            await generatePackage(projectName, projectDirectory)
                .then(() => {
                    console.log('Created package.json'.green);
                })
                .catch(() => {
                    console.log('Something went wrong while trying to create a new ReactApp'.red);
                    process.exit(1);
                })
            await copyConfigFiles(projectDirectory, projectName)
                .then(() => {
                    console.log('Copied configuration files'.green)
                })
                .catch(() => {
                    console.log('Something went wrong while trying to copy configuration files'.red)
                    process.exit(1);
                })
            await installModules(projectDirectory, projectName)
                .then(({isRouter, isRedux}) => {
                    console.log('Installing modules'.green);
                    setIsRouter(isRouter);
                    setIsRedux(isRedux);
                })
                .catch(() => {
                    console.log('Something went wrong while trying to install modules'.red)
                    process.exit(1);
                })
            await initSrcDirectory(projectDirectory, projectName, isRouter, isRedux)
                .then(() => {
                    console.log('Success'.green)
                })
        } else {
            await createReactApp()
                .then(async () => {
                    console.log('Finished creating new ReactApp'.green);
                })
                .catch(() => {
                    console.log('Something went wrong while trying to create a new ReactApp'.red);
                    process.exit(1);
                })
            await installModules(projectDirectory, projectName)
                .then(({isRouter, isRedux}) => {
                    console.log('Installing modules'.green);
                    setIsRouter(isRouter);
                    setIsRedux(isRedux);
                })
                .catch(() => {
                    console.log('Something went wrong while trying to install modules'.red)
                    process.exit(1);
                })
            await initSrcDirectory(projectDirectory, projectName, isRouter, isRedux)
                .then(() => {
                    console.log('Success'.green)
                })
        }

    }
}

function createReactApp() {
    return new Promise((resolve, reject) => {
        console.log('Creating react app...'.yellow);
        shell.exec(`node ${path.resolve(__dirname, '../')}/node_modules/create-react-app/index.js ${projectName}`,
            (e, stdout, stderr) => {
                console.log('e', e);
                console.log('stdout', stdout);
                console.log('stderr', stderr);
                if (stderr) {
                    if (e === 1) {
                        console.log(`create-react-app not installed`.red);
                        console.log('Installing create-react-app...'.yellow);
                        shell.exec(`npm install -g create-react-app`, (e, stdout, stderr) => {
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
                    resolve();
                }
            });
    })
}

async function createComponent(component, cmd) {
    newCompPath = component;
    cmd.functional ? functional = true : functional = false;
    cmd.connect ? connect = true : connect = false;

    if (fs.existsSync('./src/components')) {
        newCompPath = `./src/components/${component}`;
    }
    let template = await buildTemplate();
    writeFile(template, component)
}

function buildTemplate() {
    let imports = [template.imports.react, template.imports.propTypes];
    if (connect) {
        imports.push(template.imports.connect)
    }
    let body = functional ? [template.functional] : [template.main].join('\n');
    if (connect) {
        body = body + '\n' + template.mapDispatchToProps + '\n' + template.mapStateToProps;
    }
    let exported = connect ? [template.exported.connectStateAndDispatch] : [template.exported.default];
    return imports.join('\n') + '\n' + body + '\n' + exported;
}

function capitalize(comp) {
    return comp[0].toUpperCase() + comp.substring(1, comp.length);
}

function writeFile(template, component) {
    let path = newCompPath;
    let comp = component.split('/');
    comp = comp[comp.length - 1];
    if (path) {
        path = path + '/' + capitalize(comp);
    } else {
        path = capitalize(comp);
    }
    if (!fs.existsSync(`${path}.js`)) {
        fs.outputFile(`${path}.js`, template, (err) => {
            if (err) throw err;
            replace({
                regex: "{{className}}",
                replacement: capitalize(comp),
                paths: [`${path}.js`],
                recursive: false,
                silent: true,
            });
            console.log(`Component ${comp} created at ${path}.js`.cyan);
            process.exit(1);
        });
    } else {
        console.log(`Component ${comp} allready exists at ${path}.js, choose another name if you want to create a new component`.red);
        process.exit(1);
    }


}
