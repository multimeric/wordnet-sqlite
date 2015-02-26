var sqlite3 = require('sqlite3');
var path = require("path");

var db = path.join(__dirname, 'wordnet.dict');
module.exports = new sqlite3.Database(db);