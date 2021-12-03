const natural = require('natural');
const common = require('./common');
const fs = require('fs');

function invert(swCheck, stemCheck) {
    let posting = "",            //the final thing to be written into a file
        dictionary = {},    //{term: dictionary frequency}
        termSet = new Set(),
        nestedDictionary = {};    
    let fileAmount = getAllDirFiles("./web-pages/").length-1;
    // loops through all the files in the directory and stops 1 file early due to links.txt
    for (let i=1; i < fileAmount; i++){
        let tf = {};
        let filePath = './web-pages/doc-id-'.concat(i.toString()).concat('.txt');
        let text = fs.readFileSync(filePath).toString();
        text = common.parser(text.toLowerCase());
 
        //performings stopword removal if needed 
        if (swCheck) {
            let stopwords = fs.readFileSync('./files/stopword.txt').toString();
            output = [];
            let words = text.split(' ');
            for (let i=0; i < words.length; i++) {
                let word = words[i];
                if (!stopwords.includes(word)) {
                    output.push(word);
                }
            }
            text = output.join(' ');
        }
  
        // running porter stemming on the words below
        let words = (stemCheck) ? common.stemText(text) : text;
        words = words.split(' ');
        // code for term and document frequency
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            tf[word] = (tf[word] || 0) + 1;
            dictionary[word] = (dictionary[word] || 0) + 1;
            termSet.add(word);
        }

        tfList = Array.from(Object.keys(tf)).sort();
        for (let j = 0; j < tfList.length; j++){
            let word = tfList[j]
            if (!(word in nestedDictionary)){
                nestedDictionary[word] = {};
            }
            nestedDictionary[word][i] = tf[word].toString();
        }
    }
    // the following code is to format what is to be written to dictionary.txt
    // we have to sort the keys and then use the sorted keys to get the dictionary in alphabetical order
    let termList = Array.from(termSet).sort();

    let dictionaryText = "";
    for (let i = 0; i < termList.length; i++) {
        dictionaryText += termList[i].concat(' ', dictionary[termList[i]], '\n');
    }
    // the following code is to format what is to be written to postings.txt
    // we have to sort the keys and then use the sorted keys to get the posting in alphabetical order
    let sortedKeys = Array.from(Object.keys(nestedDictionary)).sort();

    for (let j = 0; j < sortedKeys.length; j++){
        word = sortedKeys[j]
        posting += word.concat(JSON.stringify(nestedDictionary[word]).replace(/[^0-9]+/g," "),'\n')
    }
    fs.writeFileSync('./files/postings.txt', posting);
    fs.writeFileSync('./files/dictionary.txt', dictionaryText);
}

// helper function to count the amount of files in a directory
const getAllDirFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(file);
      }
    })
    return arrayOfFiles;
}

module.exports = {
    invert
}
