const axios = require('axios');
const urlParser = require('url');
const cheerio = require('cheerio');
const fs = require('fs');
const { convert } = require('html-to-text'); 

let seen = {};
let id = 0

const getUrl = ( protocol, host, link, prevUrl) => {
    // do not want other websites that isn't part of the seed valules
    if (link.includes('http') && !link.includes(host) || link.length > 100) {
        return '';
    }

    // if link is already a url
    if (link.includes('http')) {
        return link;
    }
    // if link is a relative path backwards to another page
    else if (link.includes('..')) {
        const prevUrlList = prevUrl.split('/');
        const relativePathList = link.split('/');
        let count = relativePathList.filter(i => i === '..').length;

        for (let i in relativePathList) {
            if (i > 0 && i < relativePathList.length - 2) { 
                // Example -> link = '../foo/../../bar.html'
                // want to handle foo in the example
                if (relativePathList[i - 1] === '..' && relativePathList[i] !== '..' && relativePathList[i + 1] === '..') {
                    count += 1;
                }
            }
        }
        const newLinkPath = relativePathList.slice(count - 1).join();
        const newBaseUrl = prevUrlList.slice(0, prevUrlList.length - count).join('/');
        return newBaseUrl + '/' + newLinkPath;
    }
    // if link is a relavtive path forward to another page
    else if (link.startsWith('/') || !link.includes(host)) {
        const prevUrlList = prevUrl.split('/');
        // if relative path starts from root
        if (protocol + '//' + host === prevUrl) {
            return (link.startsWith("/")) ? prevUrl + link : prevUrl + '/' + link;
        }
        // special case
        if (host === 'developer.mozilla.org') {
            return protocol + '//' + host + link;
        }
        const newBaseURL = prevUrlList.slice(0, prevUrlList.length - 1).join('/');
        return (link.startsWith('/')) ? newBaseURL + link : newBaseURL + '/' + link;
    }
    return protocol + '//' + host + '/' + link;
};

const fetchData = async (url) => {
    try {
        if (url) {
            const response = await axios.default.get(url);
            return (response.status > 300) ? '' : response.data.toString();
        }
    }
    catch (e) {
        console.log(url + ' does not work');
    }
    return '';
};

const filterHtml = (html) => {
    const text = convert(html, { wordwrap: 150 });
    return text;
};

const crawl = async (url, depth, ignore) => {
    if (seen[url] || depth > 1) return;
    let { host, protocol } = urlParser.parse(url);
    let page = await fetchData(url);

    if (page) {
        const $ = cheerio.load(page);
        id += 1;
        
        // save pages to file
        fs.writeFile('./web-pages/doc-id-'+id+'.txt', filterHtml(page), err => {
            if (err) console.log(err);
        })

        const links = $("a")
            .map((i, link) => link.attribs.href)
            .get();

        const filteredLinks = links
            // filter ignores, id based urls, and images
            .filter((link) => 
                (!ignore.some(i => link.toLowerCase().includes(i)) 
                    && !link.includes('#') && !link.endsWith('.png') 
                    && !link.endsWith('.jpg') && !link.endsWith('.jpeg'))
            )
            // remove duplicate urls
            .filter((v, i, a) => a.indexOf(v) === i);

        filteredLinks
            .forEach((link) => {
                const nextUrl = getUrl(protocol, host, link, url);
                if (nextUrl !== '') {
                    crawl(nextUrl, depth + 1, ignore);
                }
            });
        
        if (!seen[url]) {
            seen[url] = {"id": id, "links": filteredLinks}
            fs.writeFile('./web-pages/links.txt', JSON.stringify(seen, null, "\t"), err => {
                if (err) console.log(err);
            })
        }
    }
};

const crawler = async (seed) => {
    let urls = fs.readFileSync(seed).toString().split('\r\n');
    for (let i in urls) {
        if (urls[i].length > 0) {
            await crawl(urls[i], 0, ['/search', '/feedback', '/help']);
        }
    }
};

module.exports = {
    getUrl,
    crawler,
    filterHtml
};
