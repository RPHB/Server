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
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
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
  var choise = request.params.choise;
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

/* UPDATE bets with id */
router.put('/update/:id/:tokens/:choice/:date/:isPayed/:sport', function(request, res, next) {
	var id = request.params.id;
  var tokens = request.params.tokens;
  var choise = request.params.choise;
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
