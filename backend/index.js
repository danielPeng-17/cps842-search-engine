const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const crawl = require('./utils/crawl');
const invert = require('./utils/invert');
const common = require('./utils/common');
const cosine = require('./utils/cosine-similarity');
const constants = require('./constants/constants');

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crawl_pages', async (req, res) => {
    await crawl.crawler('./files/seed.txt');
    res.send('Web pages have been crawled.');
});

app.get('/search', (req, res) => {
    // const query = req.query.search;
    // console.log(query);
    // let tempQuery = 'double-click on the WorldWideWeb icon';
    // let stopWords = fs.readFileSync('./files/stopword.txt').toString().split('\r\n');
    // tempQuery = common.stemText(common.removeStopWord(common.parser(tempQuery), stopWords));
    // let postingList = {}
    // let dictionaryList = {}

    // if (!fs.existsSync('./files/postings.txt') || !fs.existsSync('./files/dictionary.txt')) {
        // call invert to generate posting list and dictionary
        // invert.invert(constants.STOP_WORD, constants.STEMMING);
    // }
    // postingList = common.generateMap('./files/postings.txt');
    // dictionaryList = common.generateMap('./files/dictionary.txt');
    
    // const cosineScore = cosine.getCosineSimilarityScore(tempQuery, postingList, dictionaryList);
    // console.log(cosineScore);
    // TODO: HELPER FUNCTION -> compute pageRank score

    // TODO: combine cos-score and pageRank score into score(d, q) = w1*cos-score(d, q) + w2*pagerank(d) where w1+w2=1
    // NOTE: w1 is WEIGHT_1 and w2 is WEIGHT_2 from constants.js

    // return object of results -> ordered by ranking score
    const testData = {
        1: {'title': 'Google title', 'url': 'https://www.google.ca', "score": 0.885634},
        2: {'title': 'Amazon title','url': 'https://www.amazon.com', "score": 0.55734},
        3: {'title': 'Netflix title','url': 'https//www.netflix.com', "score": 0.14564}
    }
    res.json(testData);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});