var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'http://xenowarehouse13.myqnapcloud.com',
    user     : 'root',
    password : 'admin',
    database : 'ps',
    port : 32768,
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
