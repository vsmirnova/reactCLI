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


function addDuck() {
    return new Promise((resolve, reject) => {
        try {
            let contents = fs.readFileSync(path.resolve(__dirname, '../', 'templates', 'src', 'ducks', 'test.js'), 'utf-8');
            resolve(contents);
        } catch (e) {
            reject(e);
        }
    })
}


function createDuck(name) {

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(`./src/ducks/${name}.js`)) {
            Promise.all([addDuck(), addReducer(name), addSaga(name)])
                .then(async (result) => {
                    const [duck, reducer, saga] = result;
                    try {
                        await fs.writeFileSync(`src/ducks/${name}.js`, duck);
                        await fs.writeFileSync(`src/store/reducer.js`, reducer);
                        await fs.writeFileSync(`src/store/saga.js`, saga);
                        await resolve(`Module ${name} created at src/ducks/${name}.js`)
                    } catch (e) {
                        reject('Error')
                    }
                })
                .catch(error => reject(error))
        } else {
            reject(`Duck ${name} allready exists at src/ducks/${name}.js, choose another name if you want to create a new duck`);
        }

    });
}


module.exports = createDuck;
