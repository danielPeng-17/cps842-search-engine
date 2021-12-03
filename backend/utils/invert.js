const natural = require('natural');
const parser = require('./parser');
const path = require('path');
const fs = require('fs');
const { range, words } = require('lodash');
const { listeners } = require('process');
function invert(swCheck, stemCheck) {
    var posting = "",            //the final thing to be written into a file
        dictionary = {},    //{term: dictionary frequency}
        tf = {},            //{term: term frequency}
        termSet = new Set(),
        nestedDictionary = {};    
    var fileAmount = getAllDirFiles("./web-pages/").length-1;
    // loops through all the files in the directory and stops 1 file early due to links.txt
    // fileAmount = 3
    for (let i=1; i < fileAmount; i++){
        var termSetTemp = new Set(),
        tf = {}
        var filePath = './web-pages/doc-id-'.concat(i.toString()).concat('.txt');
        console.log(filePath)
        var text = fs.readFileSync(filePath).toString();
        text = parser.parser(text.toLowerCase());
        // text = text.replace(/\s{2,}/g," ");
        // split the textFile into a list of lines
        const splitLines = str => str.split(/\r?\n/); 
        // for (let i=0; i < lines.length; i++) { 
        //     var line = lines[i].split(' ');
        //     for (let i=0; i < line.length; i++) {
        //         var word = line[i];
        //     } 
        // } 
        //performings stopword removal if needed 
        if (swCheck == true) {
            var stopwords = fs.readFileSync('./files/stopword.txt').toString();
            var swList = splitLines(stopwords);
            output = [];
            var words = text.split(' ');
            for (let i=0; i < words.length; i++) {
                var word = words[i];
                if (!stopwords.includes(word)) {
                    output.push(word);
                }
            }
            text = output.join(' ');
        }
        if (stemCheck==true) {
            // running porter stemming on the words below
            output = [];
            words = text.split(' ');
            for (let i=0; i < words.length; i++) {    
                var word = words[i];
                word = natural.PorterStemmer.stem(word)    
                output.push(word);
            }
            text = output.join(' ')
        }
        words = text.split(' ')
        // code for term and document frequency
        for (let i=0; i<words.length; i++) {
            let word = words[i];
            tf[word] = (tf[word] || 0) + 1;
            dictionary[word] = (dictionary[word] || 0) + 1;
            termSet.add(word);
        }

        tfList = Array.from(Object.keys(tf));
        tfList = tfList.sort();
        for (let j=0;j<tfList.length;j++){
            let word = tfList[j]
            if (!(word in nestedDictionary)){
                nestedDictionary[tfList[j]] = {};
                // i is doc Id
                nestedDictionary[tfList[j]][i]= {}
                nestedDictionary[tfList[j]][i] = tf[word].toString()
            }
            else {
                nestedDictionary[tfList[j]][i] = tf[word].toString()
            }
        }
    }
    // the following code is to format what is to be written to dictionary.txt
    termList = Array.from(termSet)
    // we have to sort the keys and then use the sorted keys to get the dictionary in alphabetical order
    termList = termList.sort();
    var dictionaryText = "";
    for (let i=0;i<termList.length;i++) {
        dictionaryText += termList[i].concat(' ',dictionary[termList[i]],'\n');
    }
    // the following code is to format what is to be written to postings.txt
    dictKeys = Array.from(Object.keys(nestedDictionary));
    // we have to sort the keys and then use the sorted keys to get the posting in alphabetical order
    sortedKeys = dictKeys.sort();
    for (let j=0;j<sortedKeys.length;j++){
        word = sortedKeys[j]
        posting += word.concat(JSON.stringify(nestedDictionary[word]).replace(/[^0-9]+/g," "),'\n')
    }
    fs.truncate('./files/postings.txt',0,function(){});
    fs.writeFile('./files/postings.txt',posting,function(){});
    fs.truncate('./files/dictionary.txt',0,function(){});
    fs.writeFile('./files/dictionary.txt',dictionaryText,function(){});
    console.log("done");
}

// helper function to count the amount of files in a directory
const getAllDirFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(file)
      }
    })
  
    return arrayOfFiles
}


module.exports = {
    invert
}

invert(true,true,"string.txt")
//parser.parser("hi[hello]j this is working [hello]here! isn't how 312312 🌐 ! @working # $proper$ %test^ hi & * ( dfas)")