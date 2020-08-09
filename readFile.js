const fs = require('fs');
var output = require('./output');
// var getOutPut = require('./output')

const readDataFromFile = () => {
    console.log('ReadStream started with the file document.txt')
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream('document.txt', { encoding: 'utf8' });
        let documentData;

        readStream.on('data', (documentData) => {
            output.getTopWords(documentData);
        })

        readStream.on('error', (err) => {
            reject(err);
        })

        readStream.on('end', () => {
            console.log('Data read from the file is completed.')
            output.getOutPut();
        })
    })
}

module.exports = readDataFromFile