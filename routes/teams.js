var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = require('./connexionDatabase.js');

/* GET team listing. */
router.get('/getTeamName/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select name from teams where id='"+id+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

/* GET id with name */
router.get('/getId/:name', function(request, res, next) {
	var id = request.params.name;
	function getLastRecord(name) {
		return new Promise(function(resolve, reject) {
			var sql = "select id from teams where name = '"+name+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(name).then(function(rows){ res.send(rows); });
});

/* GET all users */
router.get('/getAll', function(request, res, next) {
	var pseudo = request.params.pseudo;
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select * from teams;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){ res.send(rows); });
});

/* UPDATE user with id */
router.put('/update/:id/:name/:sport', function(request, res, next) {
	var id = request.params.id;
	var name = request.params.name;
	var sport = request.params.sport;
	function getLastRecord(id, name) {
		return new Promise(function(resolve, reject) {
			var sql = "update teams set name='"+name+", sport='"+sport+"' where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			  });
			});
	}
	getLastRecord(id, name).then(function(rows){ res.send(rows); });
});

/* DELETE user with id */
router.delete('/delete/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id){
		return new Promise(function(resolve, reject) {
			var sql = "delete from teams where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});


/* POST create user */
router.post('/create/:name/:sport', function(request, res, next) {
	var name = request.params.name;
	function getLastRecord(name){
		return new Promise(function(resolve, reject) {
			var sql = "insert into teams(name,sport) values('"+name+"','"+sport+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(name).then(function(rows){ res.send(rows); });
});


module.exports = router;
