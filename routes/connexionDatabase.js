var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'http://xenowarehouse13.myqnapcloud.com',
    user     : 'root',
    password : 'oM0deithe9ieCheibieJongei0vaiS1c',
    database : 'ps',
});

connection.connect(function(err) {
    if (err){
      console.log(err);
      throw err;
    }
});

module.exports = connection;
