const parser = (text) => {
    //replace the text in between square brackets which are hyperlinks
    let newText = text.replace(/\[[^\]]*]/g," ");
    let letterText = newText.replace(/[^a-zA-Z]+/g," ");
    return letterText;
    //(/\s{2,}/g," ")
};

module.exports = {
    parser
};
