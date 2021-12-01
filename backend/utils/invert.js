const natural = require('natural');
const parser = require('./parser');
function invert(swCheck, stemCheck, file) {
    var posting,       //the final thing to be written into a file
        newDoc,        //newdoc will be storing a document's title and abstract to be put into a program to count terms
        check,       //check will be used as a flag for if the document is only a title without an abstract
        dictionary,    //{term: dictionary frequency}
        tf,          //{term: term frequency}
        positions,     //{term: [positions]}
        postings,      //postings will hold all the positions from all documents
        nestedDictionary; //will be used to sort based off tf
    var fs = require('fs');
    var text = fs.readFileSync('utils/string.txt').toString();
    // removing punctuation and replacing with space as well as removing lines
    // text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")    
    text = parser.parser(text.toLowerCase());
    // text = text.replace(/\s{2,}/g," ");
    console.log(text);
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
        var stopwords = fs.readFileSync('utils/stopword.txt').toString();
        var swList = splitLines(stopwords);
        output = [];
        words = text.split(' ');
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
}

 
module.exports = {
    invert
}

invert(true,true,"string.txt")
//parser.parser("hi[hello]j this is working [hello]here! isn't how 312312 🌐 ! @working # $proper$ %test^ hi & * ( dfas)")