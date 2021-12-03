const express = require('express');
const bodyParser = require('body-parser');
const crawl = require('./utils/crawl');
const fs = require('fs');
const invert = require('./utils/invert');
const common = require('./utils/common');
const cosine = require('./utils/cosine-similarity');

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

app.get('/', (req, res) => {
    // const query = req.query.search;
    // console.log(query);
    const tempQuery = 'abandon hello cool abbrevi having saving eating';
    let postingList = {}
    let dictionaryList = {}

    // TODO: HELPER FUNCTION -> build inverted index and dictionary
    // NOTE: for inverted index, DO NOT include position
    // NOTE: apply stemming and stop word here
    // console.log(invert.invert("string.txt",false,false))

    if (!fs.existsSync('./files/test-posting.txt') || !fs.existsSync('./files/test-dictionary.txt')) {
        // call invert to generate posting list and dictionary
        
    }
    // postingList = common.generateMap('./files/test-posting.txt');
    // dictionaryList = common.generateMap('./files/test-dictionary.txt');
    
    // const cosineScore = cosine.getCosineSimilarityScore(query, postingList, dictionaryList);
    
    // TODO: HELPER FUNCTION -> compute pageRank score

    // TODO: combine cos-score and pageRank score into score(d, q) = w1*cos-score(d, q) + w2*pagerank(d) where w1+w2=1
    // NOTE: w1 is WEIGHT_1 and w2 is WEIGHT_2 from constants.js

    // return object of results -> ordered by ranking score
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});