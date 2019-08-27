const fs = require("fs-extra");
const template = require("../templates/template-component");
const replace = require("replace");

let newCompPath;
let functional;
let connect;
let page;

function capitalize(comp) {
    return comp[0].toUpperCase() + comp.substring(1, comp.length);
}

function addComponent(component, cmd, projectDirectory) {

    return new Promise(async (resolve, reject) => {
        newCompPath = component;
        cmd.functional ? (functional = true) : (functional = false);
        cmd.connect ? (connect = true) : (connect = false);
        cmd.page ? (page = true) : (page = false);

        if (page) {
            newCompPath = `./src/containers/${component.split("/")[0]}`;
        } else if (fs.existsSync("./src/components")) {
            newCompPath = `./src/components/${capitalize(component)}`;
        }
        let template = await buildTemplate();
        writeFile(template, component, projectDirectory)
            .then(result => {resolve(result)})
            .catch(error => {reject(error)})
    })
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

function writeFile(template, component, projectDirectory) {
    return new Promise((resolve, reject) => {
        let path = newCompPath;
        let componentName = component.split("/").slice(-1).pop();

        if (page) {
            path = path + "/" + componentName
        } else {
            path = path + "/" + 'index';
        }
        if (!fs.existsSync(`${path}.jsx`)) {
            fs.outputFile(`${path}.jsx`, template, err => {
                if (err) throw err;
                replace({
                    regex: "{{className}}",
                    replacement: capitalize(componentName),
                    paths: [`${path}.jsx`],
                    recursive: false,
                    silent: true
                });
                resolve(`Component ${componentName} created at ${path}.js`);
            });
        } else {
            reject(`Component ${componentName} allready exists at ${path}.js, choose another name if you want to create a new component`)
        }
    });
}

module.exports = addComponent;
