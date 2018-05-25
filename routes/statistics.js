var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = require('./connexionDatabase.js');

/* GET team listing. */
router.get('/getAllUsersNumber', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select count(*) FROM users;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord().then(function(rows){ res.send(rows[0]); });
});

router.get('/getAllBetsNumber', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select count(*) FROM bets;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord().then(function(rows){ res.send(rows[0]); });
});

router.get('/getAllMatchsNumber', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select count(*) FROM matchs;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord().then(function(rows){ res.send(rows[0]); });
});

router.get('/getAllBetsBySport', function(request, res, next) {
	var id = request.params.name;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select * FROM bets order by sport;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

router.get('/getAllBetsDate', function(request, res, next) {
	var id = request.params.name;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select * FROM bets order by date limit 10;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

module.exports = router;
