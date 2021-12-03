const fs = require('fs');
const common = require('./common');
const constants = require('../constants/constants');
const _ = require('lodash');

const getDfVector = (postingList, distinctTerms) => {
    let df = [];
    for (let i of postingList.keys()) {
         df.push((!distinctTerms.has(i)) ? (postingList.get(i).split('').length / 2) : 0);
    }
    return df;
}

const calculateVector = (vector, postingList, distinctTerms, numDocuments) => {
    // tf
    let tf = [];
    for (let f of vector) {
        tf.push((f > 0) ? (1 + Math.log10(f)) : 0);
    }
    // idf
    let df = getDfVector(postingList, distinctTerms);
    let idf = [];
    for (let i of df) {
        idf.push((i > 0) ? (Math.log10(numDocuments / i)) : 0);
    }
    // weight
    let weightVector = [];
    for (let i in tf) {
        weightVector.push(tf[i] * idf[i]);
    }
    let normalizedValue = [];
    for (let i of weightVector) {
        normalizedValue.push(i ** 2);
    } 
    normalizedValue = Math.sqrt(_.sum(normalizedValue));
    return [weightVector, normalizedValue];
}

const generateVector = (postingList, numDocuments, allTerms) => {
    // generate empty vectors
    let vector = new Map();
    for (let i = 0; i < numDocuments; i++) {
        vector.set(i + 1,  _.fill(Array(allTerms.length), 0));
    }
    // populate the document vectors using posting list
    for (let i of postingList.keys()) {
        let term = postingList.get(i).split(' ');
        for (let x = 0; x < term.length; x++) {
            if (x % 2 === 0 && x + 1 < term.length && parseInt(term[x]) > 0) {
                vector.get(parseInt(term[x]))[allTerms.indexOf(i)] = parseInt(term[x + 1]);
            }
        }
    }
    return vector;
};

const calculateProduct = (queryVector, normalizedQueryValue, documentVectorData) => {
    const [docVector, normalizedDocValue] = documentVectorData;
    let product = [];
    for (let i in docVector) {
        product.push(queryVector[i] * docVector[i]);
    }
    return _.sum(product) / (normalizedQueryValue * normalizedDocValue);
}

const getCosineSimilarityScore = (query, postingList, dictionaryList) => {
    const dictionaryTerms = [...dictionaryList.keys()];
    const dictionaryTermsSet = new Set(dictionaryTerms);
    const numDocuments = fs.readdirSync('./web-pages').length - 1;
    const queryTerms = query.split(' ');
    console.log(queryTerms);
    const queryMap = new Map();
    for (let i in  queryTerms) {
        queryMap.set(queryTerms[i], (queryMap.get(queryTerms[i]) ?? 0) + 1);
    }
    
    const querySet = new Set(queryTerms);
    let distinctTerms = new Set([...querySet].filter(x => !dictionaryTermsSet.has(x)));
    for (let term of distinctTerms) {
        postingList.set(term, '-1 0');
    }

    const allTerms = [...postingList.keys()];

    // generate query vector
    let queryVector = _.fill(Array(allTerms.length), 0);
    for (let i of queryMap.keys()) {
        queryVector[allTerms.indexOf(i)] = queryMap.get(i);
    }

    // generate vectors for all documents
    let vectorMap = generateVector(postingList, numDocuments, allTerms);

    // filter for top k results using minimum threshold value
    const topK = new Map();
    for (let i of vectorMap.keys()) {
        let matchedWords = 0;
        for (let x = 0; x < vectorMap.get(i).length; x++) {
            if (vectorMap.get(i)[x] > 0 && queryVector[x] > 0) {
                matchedWords += 1;
            }
        }
        if (matchedWords / querySet.size > constants.MINIMUM_THRESHOLD) {
            topK.set(i, vectorMap.get(i));
        }
    }

    // get normalized weights for query vector
    let [queryWeightVector, normalizedQueryValue] = calculateVector(queryVector, postingList, distinctTerms, numDocuments);

    let documentVectorData = {};
    for (let i of topK.keys()) {
        let [docWeightVector, normalizedDocValue] = calculateVector(topK.get(i), postingList, distinctTerms, numDocuments);
        documentVectorData[i] = [docWeightVector, normalizedDocValue];
    }

    let cosineSimilarityScores = {};
    for (let i in documentVectorData) {
        cosineSimilarityScores[i] = calculateProduct(queryWeightVector, normalizedQueryValue, documentVectorData[i]);
    }

    return common.sortObjectByValue(cosineSimilarityScores, true);
};

module.exports = {
    getCosineSimilarityScore
}
