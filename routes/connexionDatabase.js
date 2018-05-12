var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'http://xenowarehouse13.myqnapcloud.com',
    user     : 'root',
    password : 'oM0deithe9ieCheibieJongei0vaiS1c',
    database : 'ps',
    port : 32768,
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
