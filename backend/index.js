const express = require('express');
const bodyParser = require('body-parser');
const test = require('./utils/crawl');


const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    // const query = req.query.search;
    // console.log(query);

    // =============== WRITE CODE FOR HELPER FUNCTIONS IN /utils/XXXXX.js AND CALL THEM HERE ===============

    // NOTE: stemming and stop words are ALWAYS on -> in constants.js

    // TODO: HELPER FUNCTION -> crawl the web using /public/top-1m.csv url then parse results

    console.log(test.t())

    // TODO: HELPER FUNCTION -> build inverted index and dictionary
    // NOTE: for inverted index, DO NOT include position
    // NOTE: apply stemming and stop word here

    // TODO: HELPER FUNCTION -> compute cosine similarity score 

    // TODO: HELPER FUNCTION -> compute pageRank score

    // TODO: combine cos-score and pageRank score into score(d, q) = w1*cos-score(d, q) + w2*pagerank(d) where w1+w2=1
    // NOTE: w1 is WEIGHT_1 and w2 is WEIGHT_2 from constants.js

    // return object of results -> ordered by ranking score
    res.send('hello world');
});

app.listen(port, function(){
    console.log(`Server started on port ${port}`);
});