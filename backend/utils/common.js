const fs = require('fs');
const natural = require('natural');
const _ = require('lodash');
const constants = require('../constants/constants');

const generateMap = (file) => {
    let g_map = new Map();
    let lines = fs.readFileSync(file, 'utf-8').split('\n');

    lines.forEach(line => {
        if (line !== '') {
            const data = line.split(' ');
            g_map.set(data[0], data.slice(1).join(' ').trim());
        }
    });
    return g_map;
};

const stemText = (line) => {
    let words = line.split(' ');

    for (let i in words) {
        words[i] = natural.PorterStemmer.stem(words[i]);
    }
    return words.join(' ');
}

// obj is an Object and returns a Map() 
// becuase Objects does not keep order while Map() does
const sortObjectByValue = (obj, reverse=false) => {
    let sorted = new Map();
    let items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });

    items.sort(function(a, b) {
        return (reverse) ? (b[1] - a[1]) : (a[1] - b[1]);
    });

    items.forEach(item => {
        sorted.set(item[0], item[1]);
    });
    return sorted;
} 

const parser = (text) => {
    //replace the text in between square brackets which are hyperlinks
    let newText = text.replace(/\[[^\]]*]/g," ");
    let letterText = newText.replace(/[^a-zA-Z]+/g," ");
    return letterText;
};

const removeStopWord = (text, stopWords) => {
    let output = [];
    let words = text.split(' ');

    for (let word of words) {
        if (!stopWords.includes(word)) {
            output.push(word);
        }
    }
    return output.join(' ');
}

const combineScores = (s1, s2) => {
    return constants.WEIGHT_1 * s1 + constants.WEIGHT_2 * s2;
}

module.exports = {
    generateMap,
    stemText,
    sortObjectByValue,
    parser,
    removeStopWord,
    combineScores
}
