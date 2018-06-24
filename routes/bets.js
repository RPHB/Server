var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = require('./connexionDatabase.js');

/* GET bet */
router.get('/get/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from bets where id='"+id+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

router.get('/getForUser/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from bets where idUser='"+id+"' order by date;";
			con.query(sql, function (err, rows, fields) {
				if (err) return resolve(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){
		// rows.toto = Object.keys(rows).length;
		// console.log("rowslength : " + rows.toto)
		var teamListJSON = rows
		var teamListJSONSize = teamListJSON.length
		var resultJson = "{"
		for (var i = 1; i < teamListJSONSize; ++i)
	{
		console.log(JSON.stringify(teamListJSON[i]))
		// var value = teamListJSON[i].attr.value
		// var team = teamListJSON[i].child["0"].text
		resultJson+='"child'+i+'":' + JSON.stringify(teamListJSON[i]) + ",";
		// resultJson+='"team":"'+team+'",';
		// resultJson+='"value":"'+value+'"';
		// resultJson+="},";
		//team = team.substring(0, team.indexOf(" "))
		// console.log(value)
		// console.log(team)
	}
	// resultJson=resultJson.substring(0, resultJson.length - 1);
	resultJson+='"length":'+teamListJSONSize;
	resultJson+="}";
    //resultJson=JSON.parse(resultJson);
	// var resultSize=Object.keys(resultJson).length;
	// resultJson.length=resultSize;
	// res.send(resultJson)
	console.log("TOTO")
	console.log("TOTO")
	console.log("TOTO")
	console.log(resultJson)
    // res.send(JSON.stringify(resultJson)); });
    res.send(resultJson); });
});

/* GET all bets */
router.get('/getAll', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select * from bets;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){ res.send(rows); });
});

/* POST create bets */
router.post('/create/:idMatch/:idUser/:tokens/:choice/:date/:sport', function(request, res, next) {
  var idMatch = request.params.idMatch;
  var idUser = request.params.idUser;
  var tokens = request.params.tokens;
  var choice = request.params.choice;
  var date = request.params.date;
	var sport = request.params.sport;
	function getLastRecord(idMatch, idUser, tokens, choise, date){
		return new Promise(function(resolve, reject) {
			var sql = "insert into bets(idMatch, idUser, tokens, choice, date, isPayed, sport) values('"+idMatch+"', '"+idUser+"', '"+tokens+"', '"+choice+"', '"+date+"', '0', '"+sport+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(idMatch, idUser, tokens, choice, date).then(function(rows){ res.send(rows); });
});
router.get('/createApp/:idUser/:choice/:date/:nomTeam1/:nomTeam2', function(request, res, next) {
  
  var idUser = request.params.idUser;
  var choice = request.params.choice;
  var nomTeam1 = request.params.nomTeam1;
  var nomTeam2 = request.params.nomTeam2;
  var date = request.params.date;
	function getLastRecord(choice, idUser, nomTeam1, nomTeam2, date){
		return new Promise(function(resolve, reject) {
			var sql = "insert into bets(choice, idUser, team1, team2, date) values('"+choice+"', '"+idUser+"', '"+nomTeam1+"', '"+nomTeam2+"', '"+ date +"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return resolve(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(choice, idUser, nomTeam1, nomTeam2, date).then(function(rows){ res.send(rows); });
});

/* UPDATE bets with id */
router.put('/update/:id/:tokens/:choice/:date/:isPayed/:sport', function(request, res, next) {
	var id = request.params.id;
  var tokens = request.params.tokens;
  var choice = request.params.choice;
  var date = request.params.date;
  var isPayed = request.params.isPayed;
	function getLastRecord(id, tokens, choise, date, isPayed) {
		return new Promise(function(resolve, reject) {
			var sql = "update bets set tokens='"+tokens+", choice='"+choice+", date='"+date+", isPayed='"+isPayed+", sport='"+sport+"' where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			  });
			});
	}
	getLastRecord(id, tokens, choice, date, isPayed).then(function(rows){ res.send(rows); });
});

/* DELETE bets with id */
router.delete('/delete/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id){
		return new Promise(function(resolve, reject) {
			var sql = "delete from bets where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});


module.exports = router;
