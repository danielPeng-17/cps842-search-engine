const cors = require('cors');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const crawl = require('./utils/crawl');
const invert = require('./utils/invert');
const common = require('./utils/common');
const cosine = require('./utils/cosine-similarity');
const pageRank = require('./utils/page-rank');
const constants = require('./constants/constants');

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', cors());

app.get('/crawl_pages', async (req, res) => {
    await crawl.crawler('./files/seed.txt');
    res.send('Web pages have been crawled.');
});

app.get('/search', (req, res) => {
    let query = req.query.q;
    // console.log(query);
    // let tempQuery = 'double-click on the WorldWideWeb icon';
    let stopWords = fs.readFileSync('./files/stopword.txt').toString().split('\r\n');
    query = common.stemText(common.removeStopWord(common.parser(query), stopWords));
    if (!fs.existsSync('./files/postings.txt') || !fs.existsSync('./files/dictionary.txt')) {
        // call invert to generate posting list and dictionary
        invert.invert(constants.STOP_WORD, constants.STEMMING);
    }
    let postingList = common.generateMap('./files/postings.txt');
    let dictionaryList = common.generateMap('./files/dictionary.txt');
    
    const cosineScore = cosine.getCosineSimilarityScore(query, postingList, dictionaryList);

    const pageRankScore = pageRank.getPageRankData();

    let ranks = {}

    for (let key in cosineScore) {
        let score = common.combineScores(cosineScore[key], pageRankScore[key].rankingValue);
        ranks[key] = {score, url: pageRankScore[key].url}
    }

    let sortedRanks = [];
    for (let i in ranks) {
        sortedRanks.push([i, ranks[i]]);
    }

    sortedRanks.sort(function(a, b) {
        return b[1].score - a[1].score;
    });
    
    res.json({data: sortedRanks});
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});