#!/usr/bin/env node
let program = require("commander");
let fs = require("fs-extra");
let shell = require("shelljs");
const path = require("path");
let readline = require("readline");
let colors = require("colors");
const replace = require("replace");
const template = require("../templates/template-component");
let projectName;
let projectDirectory;
let newCompPath;792603
let functional;
let connect;
const packageJson = require("../package.json");

let createReactApp = require("./createReactApp");
let installModules = require("./addModules");
let initSrcDirectory = require("./initSrcDirectory");
let createActions = require("./createActions");

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
            .then(async () => {
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
                console.log("Installing modules".green)
            })
            .catch(() => {
                console.log("Something went wrong while trying to install modules".red);
                process.exit(1);
            });
        await initSrcDirectory(
            projectDirectory,
            projectName
        ).then(() => {
            console.log("Success".green);
        });
        await process.exit(1);
    }
}

async function createDucks (component) {
    await createActions(component)
        .then(() =>{
            console.log("Success".green);
        })
        .catch(() => {
            console.log("Error".red);
        });
    await process.exit(1);
}


async function createComponent(component, cmd) {
    newCompPath = component;
    cmd.functional ? (functional = true) : (functional = false);
    cmd.connect ? (connect = true) : (connect = false);

    if (cmd.page) {
        newCompPath = `./src/containers/${component}`;
    } else if (fs.existsSync("./src/components")) {
        newCompPath = `./src/components/${component}`;
    }
    let template = await buildTemplate();
    writeFile(template, component);
}

function buildTemplate() {
    let imports = [template.imports.react, template.imports.propTypes];
    if (connect) {
        imports.push(template.imports.connect);
    }
    let body = functional ? [template.functional] : [template.main].join("\n");
    if (connect) {
        body =
            body +
            "\n" +
            template.mapDispatchToProps +
            "\n" +
            template.mapStateToProps;
    }
    let exported = connect
        ? [template.exported.connectStateAndDispatch]
        : [template.exported.default];
    return imports.join("\n") + "\n" + body + "\n" + exported;
}

function capitalize(comp) {
    return comp[0].toUpperCase() + comp.substring(1, comp.length);
}

function writeFile(template, component) {
    let path = newCompPath;
    let comp = component.split("/");
    comp = comp[comp.length - 1];
    if (path) {
        path = path + "/" + capitalize(comp);
    } else {
        path = capitalize(comp);
    }
    if (!fs.existsSync(`${path}.jsx`)) {
        fs.outputFile(`${path}.jsx`, template, err => {
            if (err) throw err;
            replace({
                regex: "{{className}}",
                replacement: capitalize(comp),
                paths: [`${path}.jsx`],
                recursive: false,
                silent: true
            });
            console.log(`Component ${comp} created at ${path}.js`.cyan);
            process.exit(1);
        });
    } else {
        console.log(
            `Component ${comp} allready exists at ${path}.js, choose another name if you want to create a new component`
                .red
        );
        process.exit(1);
    }
}
