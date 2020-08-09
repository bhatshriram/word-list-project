const axios = require('axios');

const api_url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup";
const key = "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf";
const language = "en-ru";

let topWords = [];
let totalWordCount = {};
let response = []

const getTopWords = (documentData) => {

    if (topWords.length == 0) {
        let data = documentData;
        // Get first 10 words in an array
        topWords = data.split(' ').slice(0, 10);
    }
    let wordCountList = {};
    topWords.forEach((word) => {
        let wordToMatch = new RegExp(word, 'g');
        totalWordCount[word] == undefined ? totalWordCount[word] = 0 : '';
        wordCountList[word] = (documentData.match(wordToMatch) != null ? documentData.match(wordToMatch).length : 0);
        // Store total count in an object.
        totalWordCount[word] = totalWordCount[word] + wordCountList[word];
    })
}

const getWordDetails = async () => {

    let wordDetails = []

    return new Promise(async (resolve, reject) => {
        let response = await axios.get(api_url + "?key=" + key + "&lang=" + language + "&text=The")
            .catch(err => reject(err));

        response.data.def.forEach((def) => {
            let op = {
                pos: '',
                mean: []
            }
            def.tr.forEach((tr) => {
                op.pos = tr.pos;
                if (tr.mean !== undefined) {
                    tr.mean.forEach((mean) => {
                        op.mean.push(mean.text);
                    })
                }
            })
            wordDetails.push(op);
        })
        resolve(wordDetails);
    })
}

const getOutPut = async () => {
    await topWords.forEach(async (word) => {
        let result = {
            word: word,
            output:
            {
                count: 0,
                details: ''
            }
        }
        let wordDetails = await getWordDetails(word);
        result.output.count = totalWordCount[word];
        result.output.details = JSON.stringify(wordDetails);
        response.push(result);
        if (response.length == topWords.length) {
            console.log('Final Output:');
            console.log(response);
        }
    });
}

module.exports = { getTopWords: getTopWords, getOutPut: getOutPut }
// module.exports = getOutPut;