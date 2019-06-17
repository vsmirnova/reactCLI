const fs = require('fs-extra');
const replace = require('replace');
const path = require('path');

const template_indexHTML = require('../templates/src/indexHTML_template');
const template_indexJS = require('../templates/src/indexJs_template');

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file){
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function initSrcDirectory(projectDirectory, projectName, isRouter, isRedux) {
    return new Promise(async (resolve, reject) => {
        await addSrcDirectory(projectDirectory);
        await addHtml(projectDirectory, projectName);
        await addJs(projectDirectory, projectName, isRouter, isRedux);
        resolve();
    })
}

function addSrcDirectory(projectDirectory) {
    return new Promise((resolve, reject) => {
        console.log('ddd', fs.existsSync(`${projectDirectory}/src`))
        if (fs.existsSync(`${projectDirectory}/src`)) {
            deleteFolderRecursive(`${projectDirectory}/src`);
        }
        fs.mkdir(`${projectDirectory}/src`);

        resolve();
    })
}


function addHtml(projectDirectory, projectName) {
    return new Promise((resolve, reject) => {
        fs.outputFile(`${projectDirectory}/src/index.html`, template_indexHTML, (err) => {
            if (err) throw err;
            replace({
                regex: "{{projectName}}",
                replacement: projectName,
                paths: [`${projectDirectory}/src/index.html`],
                recursive: false,
                silent: true,
            });
        });
        resolve();
    })
}

function addJs(projectDirectory, projectName, isRouter, isRedux) {
    return new Promise((resolve, reject) => {
        let template = template_indexJS.imports.import_default;
        if (isRouter) {
            template = template + template_indexJS.imports.import_router
        }
        if (isRedux) {
            template = template + template_indexJS.imports.import_redux
        }

        if (isRedux && isRouter) {
            template = template + template_indexJS.main.main_router_redux
        } else if (isRouter) {
            template = template + template_indexJS.main.main_router
        } else if (isRedux) {
            template = template + template_indexJS.main.main_redux
        } else {
            template = template + template_indexJS.main.main_default
        }

        fs.outputFile(`${projectDirectory}/src/index.js`, template, (err) => {
            if (err) throw err;
        });
        fs.copySync(path.resolve(__dirname, '../', 'templates', 'src', 'components'), `${projectDirectory}/src/components`);
        fs.copySync(path.resolve(__dirname, '../', 'templates', 'src', 'containers'), `${projectDirectory}/src/containers`);
        if (isRedux) {
            fs.copySync(path.resolve(__dirname, '../', 'templates', 'src', 'redusers'), `${projectDirectory}/src/redusers`);
        }
        resolve();
    })
}


module.exports = initSrcDirectory;
