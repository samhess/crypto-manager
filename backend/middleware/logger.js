module.exports = function (req, res, next) {
    var time = new Date().toLocaleString('de-CH', {hour12: false})
    console.log(`${time} - ${req.protocol} ${req.method} ${req.originalUrl}`);
    next()
}