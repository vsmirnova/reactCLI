const fs = require('fs');
const path = require('path');


function addReducer(name) {
    return new Promise((resolve, reject) => {
        try {
            let contents = fs.readFileSync("src/store/reducer.js", 'utf-8');
            let importStr = contents.slice(contents.lastIndexOf('import'));
            contents = contents.slice(0, contents.lastIndexOf('import')) + `import { default as ${name} } from '../ducks/${name}';\n` + importStr;
            contents = contents.slice(0, contents.indexOf('router:')) + `${name},\n` + contents.slice(contents.indexOf('router:'));
            resolve(contents);
        } catch (e) {
            reject(e);
        }
    })
}

function addSaga(name) {
    return new Promise((resolve, reject) => {
        try {
            let contents = fs.readFileSync("src/store/saga.js", 'utf-8');
            let importStr = contents.slice(contents.lastIndexOf('import'));
            contents = contents.slice(0, contents.lastIndexOf('import')) + `import { saga as ${name}Saga } from '../ducks/${name}';\n` + importStr;
            contents = contents.slice(0, contents.indexOf('[') + 1) + `\n${name}Saga(),` + contents.slice(contents.indexOf('[') + 1);
            resolve(contents);
        } catch (e) {
            reject(e);
        }
    })
}


function createDuck() {
    return new Promise((resolve, reject) => {
        try {
            let contents = fs.readFileSync(path.resolve(__dirname, '../', 'templates', 'src', 'ducks', 'test.js'), 'utf-8');
            resolve(contents);
        } catch (e) {
            reject(e);
        }
    })
}


function createActions(name) {

    return new Promise(async (resolve, reject) => {
        try {
            createDuck().then(result => {
                fs.writeFile(`src/ducks/${name}.js`, result, (error) => {
                        if (error) reject();
                        resolve();
                    });
            });
            addReducer(name)
                .then(result => {
                    fs.writeFile(`src/store/reducer.js`, result, (error) => {
                        if (error) reject();
                        resolve();
                    });
                });
            addSaga(name)
                .then(result => {
                    fs.writeFile(`src/store/saga.js`, result, (error) => {
                        if (error) reject();
                        resolve();
                    });
                });
        } catch (e) {
            reject();
        }
    })
}


module.exports = createActions;
