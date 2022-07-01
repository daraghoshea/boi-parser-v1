module.exports = function(source) {
    return source.replace(/#docId = 0;/, "");
};