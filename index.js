#!/usr/bin/env node
let program = require("commander");
let fs = require("fs-extra");
const path = require("path");
let readline = require("readline");
let colors = require("colors");


let projectName;
let projectDirectory;
const packageJson = require("./package.json");

let createReactApp = require("./bin/createReactApp");
let installModules = require("./bin/installModules");
let initSrcDirectory = require("./bin/initSrcDirectory");
let addComponent = require("./bin/createComponent");
let addDuck = require("./bin/createDuck");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program
    .version(packageJson.version)
    .command("init <dir>")
    .action(createProject);
program
    .version(packageJson.version)
    .command("createComp <component>")
    .option("-C, --connect", "Make connected")
    .option("-F, --functional", "Create functional component")
    .option("-P, --page", "Create container")
    .action(createComponent);

program
    .version(packageJson.version)
    .command("createDuck <component>")
    .action(createDucks);

program.parse(process.argv);

async function createProject(dir, cmd) {
    projectName = dir;
    projectDirectory = `${process.cwd()}/${projectName}`;

    if (fs.existsSync(projectDirectory)) {
        console.log("Directory already exists...".red);
        process.exit(1);
    } else {
        await createReactApp(projectDirectory, projectName)
            .then(() => {
                console.log("Finished creating new ReactApp".green);
            })
            .catch(() => {
                console.log(
                    "Something went wrong while trying to create a new ReactApp".red
                );
                process.exit(1);
            });
        await installModules(projectDirectory, projectName)
            .then(() => {
                console.log("Installing modules".green);
            })
            .catch(() => {
                console.log("Something went wrong while trying to install modules".red);
                process.exit(1);
            });
        await initSrcDirectory(projectDirectory, projectName)
            .then(() => {
                console.log("Directory /src created".green);
            })
            .catch(() => {
                console.log("Directory /src creation error".red);
            });
        await process.exit(1);
    }
}

async function createComponent(component, cmd) {
    await addComponent(component, cmd, projectDirectory)
        .then(result => {
            console.log(result.green);
        })
        .catch(error => {
            console.log(error.red);
        });
    await process.exit(1);
}

async function createDucks(component) {
    await addDuck(component)
        .then(result => {
            console.log(result.green);
        })
        .catch(error => {
            console.log(error.red);
        });
    await process.exit(1);
}
