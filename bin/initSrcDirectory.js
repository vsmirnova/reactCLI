const fs = require('fs-extra');
const replace = require('replace');
const path = require('path');


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

function initSrcDirectory(projectDirectory, projectName) {
    return new Promise(async (resolve, reject) => {
        await addSrcDirectory(projectDirectory);
        await fs.copySync(path.resolve(__dirname, '../', 'templates', 'src'), `${projectDirectory}/src`);
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


module.exports = initSrcDirectory;
