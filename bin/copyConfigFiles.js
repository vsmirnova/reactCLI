let fs = require('fs-extra');
let shell = require('shelljs');
const path = require('path');

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    let files = [];

    //check if folder needs to be created or integrated
    let targetFolder = path.join(target, path.basename(source));
    if ( !fs.existsSync(targetFolder) ) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            let curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function copyConfigFiles(projectDirectory, projectName) {
    return new Promise((resolve, reject) => {
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'webpack'), projectDirectory);
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'config'), projectDirectory);
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'static'), projectDirectory);
        //copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'src'), projectDirectory);
        copyFileSync(path.resolve(__dirname, '../', 'templates', '.babelrc'), projectDirectory);
        copyFileSync(path.resolve(__dirname, '../', 'templates', 'gitignore'), projectDirectory);
        fs.rename(`${projectDirectory}/gitignore`, `${projectDirectory}/.gitignore`, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
        resolve();
    })

}

module.exports = copyConfigFiles;
