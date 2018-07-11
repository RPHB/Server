var mysql = require('mysql');

var connection;
var devMod=1
if (devMod===1)
{
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'beyourbet',
	});
}
else{
	connection = mysql.createConnection({
    host     : 'xenowarehouse13.myqnapcloud.com',
    user     : 'root',
    password : 'oM0deithe9ieCheibieJongei0vaiS1c',
    database : 'beyourbet',
	});
}

connection.connect(function(err) {
    if (err){
      console.log(err);
      throw err;
    }
});

module.exports = connection;
