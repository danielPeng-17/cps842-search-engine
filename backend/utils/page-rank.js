const crawler = require('./crawl');
const fs = require('fs');
const { forEach } = require('lodash');
var alpha = 0.16 //other common alpha values also 0.01 and 0.10, 0.05
var totalNumOfLinks = 4 // N value
var countOfOnesPerRow = [] // Counting # of 1s per row on Adjacency Matrix

// 1) Build Adjacency matrix based on link in seed file and outlinks assocated with seed file link
/*var adjacencyMatrix =  [[0,1,1,1],
                        [0,0,0,0],
                        [0,1,0,1],
                        [0,1,0,0]]; */

const createAdjacencyMatrix = () => {
    var adjacencyMatrix = [];
    var matrixUrls = []

    let linkText = fs.readFileSync('../web-pages/links.txt');
    let rawData = JSON.parse(linkText);
    let data = Object.entries(rawData)
    
    for (const [key, value] of data) {
        matrixUrls.push(key);
    }
    
    for (let [key, item] of data) {
        // console.log(item.links[0]);
        var count = 0;
        var adjacencyRow = [];
        for (let url of matrixUrls) {
            // if (count > 1) break;
            // console.log(crawler.getUrl("", "", item.links[0], url));
            let result = item.links.find(element => {
                // console.log(crawler.getUrl("", "", element, url));
                // element == crawler.getUrl("", "", element, url);
                return url.includes(element)
            });
            if (result) {
                adjacencyRow.push(1);
            } else {
                adjacencyRow.push(0);
            }

            // count++;
        }
        adjacencyMatrix.push(adjacencyRow);
        // console.log(adjacencyRow);
        // break;
    }
    console.log(adjacencyMatrix[150]);
}

createAdjacencyMatrix();

// 2) Conditions for buidling 2nd matrix:
// - If the entire row has '0' values only or countOfOnesPerRow is '0', each cell in that row
// has the value of 1/totalNumOfLinks
//
// - If the entire row is not filled with '0' values only in Adjacency matrix, each cell with value '0' 
// in Adjacency matrix is still 0  in corresponding cell of 2nd matrix
//
// - each cell with value '1' in Adjacency matrix = 1/countOfOnesPerRow for the row that the cell is on

const matrixTwo = (adjacencyMatrix, totalNumOfLinks, countOfOnesPerRow) => {
    var matrixTwo = [[]];


}



// 3) Conditions for building 3rd matrix:
// - denoting each cell from 2nd matrix as x
// - If the entire row has only '0' values in Adjacency matrix, cell value remains the same as 2nd matrix
// - each cell in 3rd matrix is x * (1 - alpha)




// 4) Conditions for building 4th matrix:
// - denoting each cell from 3rd matrix as P
// - If the entire row has only '0' values in Adjacency matrix, cell value remains the same as 2nd matrix
// - otherwise each cell is calculated based on values from 3rd matrix: P + (alpha / totalNumOfLinks)



// Calculating probability x0, x1, ..., xi
// start off example x0 = (1 0 0 0): the number of zeroes is based on (totalNumOfLinks - 1)
//
// x1 = x0 * P = (1 0 0 0) * P = (0.04 0.32 0.32 0.32):  x1 value is based on 1st row of of 4th matrix
// x2 = x1 * P = (0.04 0.32 0.32 0.32) times 4th matrix (matrix mult) = (0.107 0.522 0.118 0.253)
// x3 = x2 * P = (0.107 0.522 0.118 0.253) times 4th matrix = (0.150 0.442 0.180 0.229)
// x4 = x3 * P = etc...




// Set Convergence to stop Probability calculations
// i) convergence difference is under a certain threshold or is 0 - Stop iteration
// ii) stop Proability calculations after a certain # of calculations




// determine ranking order after probability calcualtion stops on x iteration