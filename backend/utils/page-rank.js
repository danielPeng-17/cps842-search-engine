var matrixMultiplication = require('matrix-multiplication');
const crawler = require('./crawl');
const fs = require('fs');
const { forEach } = require('lodash');
var alpha = 0.16 //other common alpha values also 0.01 and 0.10, 0.05
var totalNumOfLinks = 0 // N value
var countOfOnesPerRow = [] // Counting # of 1s per row on Adjacency Matrix
var allZeroRows = []; //storing row indexes that contain only value '0'
var matrixUrls = [] // all the URLs within the Web Graph
var totalLinks = 0;

// 1) Build Adjacency matrix based on link in links.txt and outlinks associated with links.txt
/*var adjacencyMatrix =  [[0,1,1,1],
                        [0,0,0,0],
                        [0,1,0,1],
                        [0,1,0,0]]; */

const createAdjacencyMatrix = () => {
    var adjacencyMatrix = [];

    let linkText = fs.readFileSync('../web-pages/links.txt');
    let rawData = JSON.parse(linkText);
    let data = Object.entries(rawData)
    
    for (const [key, value] of data) {
        matrixUrls.push(key);
    }
    
    for (let [key, item] of data) {
        var count = 0;
        var adjacencyRow = [];
        for (let url of matrixUrls) {
            let result = item.links.find(element => {
                if (!element.startsWith("./") && element != "/") {
                    return url.includes(element)
                }
                return false;
            });
            if (result) {
                adjacencyRow.push(1);
            } else {
                adjacencyRow.push(0);
            }
        }
        adjacencyMatrix.push(adjacencyRow);
    }
    totalLinks = adjacencyMatrix.length;
    // let index = 0;
    // console.log("Adjacency Matrix for " + index);
    // console.log(adjacencyMatrix[index]);
    return adjacencyMatrix;
}

// 2) Conditions for buidling 2nd matrix:
// x - If the entire row has '0' values only or countOfOnesPerRow is '0', each cell in that row
// has the value of 1/totalNumOfLinks
//
// - If the entire row is not filled with '0' values only in Adjacency matrix, each cell with value '0' 
// in Adjacency matrix is still 0  in corresponding cell of 2nd matrix
//
// - each cell with value '1' in Adjacency matrix = 1/countOfOnesPerRow for the row that the cell is on

const createMatrixTwo = () => {
    let adjacencyMatrix = createAdjacencyMatrix();

    //pseudo code for map
    // var newMatrix [[]];
    // foreach x in adjacencyMatrix {
        // do some stuff and add to newMatrix
    // }

    let newMatrix = adjacencyMatrix.map((value, index) => {
        //all zero check
        if (value.indexOf(1) == -1) {
            allZeroRows.push(index)
            let evenSplit = 1 / totalLinks
            return value.map(x => x = evenSplit);
        }
        var numberOfOnes = 0;
        value.forEach((value) => {
            if (value == 1) numberOfOnes++;
        });
        let multiplier = 1 / numberOfOnes;
        return value.map(x => x * multiplier);
    });
    return newMatrix;
}

// 3) Conditions for building 3rd matrix:
// - denoting each cell from 2nd matrix as x
// - If the entire row has only '0' values in Adjacency matrix, cell value remains the same as 2nd matrix
// - each cell in 3rd matrix is x * (1 - alpha)

const createMatrixThree = () => {
    let matrixTwo = createMatrixTwo();

    let newMatrix = matrixTwo.map((value, index) => {
        // all zero check
        if (allZeroRows.indexOf(index) >= 0) {
            return value;
        }
        return value.map(x => x * (1 - alpha));
    });
    return newMatrix;
}

// 4) Conditions for building 4th matrix:
// - denoting each cell from 3rd matrix as P
// - If the entire row has only '0' values in Adjacency matrix, cell value remains the same as 2nd matrix
// - otherwise each cell is calculated based on values from 3rd matrix: P + (alpha / totalNumOfLinks)

const createMatrixFour = () => {
    let matrixThree = createMatrixThree();

    let newMatrix = matrixThree.map((value, index) => {
        // all zero check
        if (allZeroRows.indexOf(index) >= 0) {
            return value;
        }
        return value.map(x => x + (alpha / totalLinks));
    });
    return newMatrix;
}

// Calculating probability x0, x1, ..., xi
// start off example x0 = (1 0 0 0): the number of zeroes is based on (totalNumOfLinks - 1)
//EXAMPLE
// x1 = x0 * P = (1 0 0 0) * P = (0.04 0.32 0.32 0.32):  x1 value is based on 1st row of of 4th matrix
// x2 = x1 * P = (0.04 0.32 0.32 0.32) times 4th matrix (matrix mult) = (0.107 0.522 0.118 0.253)
// x3 = x2 * P = (0.107 0.522 0.118 0.253) times 4th matrix = (0.150 0.442 0.180 0.229)
// x4 = x3 * P = etc...

const createProbabilityVector = (iterations) => {
    let matrixFour = createMatrixFour();
    let probabilityVector = matrixFour[0];

    // let vector = [[0.04, 0.32, 0.32, 0.32]];
    // let matrix = [[0.04, 0.32, 0.32, 0.32], [0.25,0.25,0.25,0.25], [0.04,0.46,0.04,0.46], [0.04,0.88,0.04,0.04]];
    // var mul = matrixMultiplication()(4);
    // var output = mul(vector, matrix);
    var vector = [matrixFour[0]];
    let matrix = matrixFour;
    var output;
    for(var x=0; x<iterations; x++) {
        output = multiplyMatrices(vector, matrix);
        vector = [output[0]];
    }
    return getTop(totalLinks, vector[0]);    
}

const getPageRankData = () => {
    let vectors = createProbabilityVector(3);
    var ret = {};
    vectors.forEach((element, index) => {
        let documentId = element.index + 1;
        ret[documentId] = {
            rank: index + 1,
            documentId: documentId,
            rankingValue: element.value,
            url: matrixUrls[element.index]
        }
    });
    return ret;
}
console.log(getPageRankData());
//console.log(getPageRankData()['5']);

function createDisplay(top) {
    //return as an object instead of string
    // the key has to be the document id
    // return all documents
    var output = "";
    top.forEach((element, index) => {
        output += "Rank #" + (index + 1)
            + "\nDocument id: " + (element.index + 1)
            + "\nRanking value: " + element.value
            + "\nURL: " + matrixUrls[element.index]+"\n"
            + "\n";
    });
    return (output);
}

function getTop(numPositions, vector) {
    var topPosition = vector.map((value, index) => {
        return {index: index, value: value}
    });
    topPosition.sort(function compare(a, b) {
        return b.value - a.value;
    });
    return topPosition.slice(0, numPositions);
}

function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}
