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

function copyProjectFiles(projectDirictory, projectName) {
    return new Promise((resolve, reject) => {
        console.log('source', path.resolve(__dirname, '../', 'templates', 'webpack'));
        console.log('target', projectDirictory);
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'webpack'), projectDirictory);
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'config'), projectDirictory);
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'static'), projectDirictory);
        copyFolderRecursiveSync(path.resolve(__dirname, '../', 'templates', 'src'), projectDirictory);
        copyFileSync(path.resolve(__dirname, '../', 'templates', '.babelrc'), projectDirictory);
    })

}

module.exports = copyProjectFiles;
