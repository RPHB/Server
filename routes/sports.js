var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = require('./connexionDatabase.js');

/* GET name of sport */
router.get('/get/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select name from sports where id = '"+id+"';";
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
			var sql = "select id from sports where name = '"+name+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(name).then(function(rows){ res.send(rows); });
});

/* GET all sport */
router.get('/getAll', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select * from sports;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){ res.send(rows); });
});

/* POST create sport */
router.post('/create/:name', function(request, res, next) {
	var name = request.params.name;
	function getLastRecord(name){
		return new Promise(function(resolve, reject) {
			var sql = "insert into sports(name) values('"+name+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(name).then(function(rows){ res.send(rows); });
});

/* UPDATE sport with id */
router.put('/update/:id/:name', function(request, res, next) {
	var id = request.params.id;
	var name = request.params.name;
	function getLastRecord(id, name) {
		return new Promise(function(resolve, reject) {
			var sql = "update sports set name='"+name+"' where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			  });
			});
	}
	getLastRecord(id, name).then(function(rows){ res.send(rows); });
});

/* DELETE sport with id */
router.delete('/delete/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id){
		return new Promise(function(resolve, reject) {
			var sql = "delete from sports where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});


module.exports = router;
