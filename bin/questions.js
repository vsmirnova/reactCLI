
const questions = (projectName) => [
    {
        type: 'input',
        name: 'name',
        message: 'package name',
        default: projectName
    },
    {
        type: 'input',
        name: 'version',
        message: 'version',
        default: '1.0.0',
    },
    {
        type: 'input',
        name: 'description',
        message: 'description',
        default: '',
    },
    {
        type: 'input',
        name: 'author',
        message: 'author',
        default: '',
    }
];

module.exports = questions;
