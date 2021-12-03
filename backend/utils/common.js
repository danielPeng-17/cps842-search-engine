const fs = require('fs');
const natural = require('natural');
const _ = require('lodash');

const generateMap = (file) => {
    let g_map = new Map();
    let lines = fs.readFileSync(file, 'utf-8').split('\r\n');

    lines.forEach(line => {
        const data = line.split(' ');
        g_map.set(data[0], data.slice(1).join(' '));
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

module.exports = {
    generateMap,
    stemText,
    sortObjectByValue
}
// let p = {
//     8: 0.9774460398774676,
//     10: 0.21118531939473467,
//     11: 0.9774460398774676,
//     12: 0.21118531939473467,
//     13: 0.21118531939473467
//   }
// console.log(sortObjectByValue(p, true));