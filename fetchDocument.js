const fs = require('fs');
const http = require('http');
var readDataFromFile = require('./readFile');

const document_url = "http://norvig.com/big.txt";

// Save the document data into a local file named document.txt
// Once complete data is fetced it starts reading the data from local file.
// If the file already exists it starts reading the file.
const fetchDocument = () => {

    fs.exists(__dirname + '/document.txt', (isExists) => {
        if (isExists) {
            console.log('The file document.txt is already exists!')
            readDataFromFile();
        } else {
            console.log('Fetching the data from the source.')
            let file = fs.createWriteStream('document.txt');
            http.get(document_url, res => {
                res.pipe(file).addListener('close', () => {
                    readDataFromFile();
                })
            });
        }
    })
}

module.exports = fetchDocument

