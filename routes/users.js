var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var con = require('./connexionDatabase.js');

/* GET users listing. */
router.get('/getUser/:pseudo', function(request, res, next) {
	var pseudo = request.params.pseudo;
	function getLastRecord(pseudo) {
		return new Promise(function(resolve, reject) {
			var sql = "select username from users where username='"+pseudo+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(pseudo).then(function(rows){ res.send(rows); });
});

/* GET all users */
router.get('/getAllUser', function(request, res, next) {
	var pseudo = request.params.pseudo;
	function getLastRecord(pseudo) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from users;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo).then(function(rows){ res.send(rows); });
});

/* UPDATE user with id */
router.put('/update/:id/:pseudo/:email/:admin', function(request, res, next) {
	var id = request.params.id;
	var pseudo = request.params.pseudo;
	var email = request.params.email;
	var admin = request.params.admin;
	function getLastRecord(id, pseudo, email) {
		return new Promise(function(resolve, reject) {
			var sql = "update users set username='"+pseudo+"', email='"+email+"', admin='"+admin+"' where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			  });
			});
	}
	getLastRecord(id, pseudo, email).then(function(rows){ res.send(rows); });
});

/* DELETE user with id */
router.delete('/delete/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id){
		return new Promise(function(resolve, reject) {
			var sql = "delete from users where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

router.get('/connect/:pseudo/:pwd', function(request, res, next) {
	var pseudo = request.params.pseudo;
	var pwd = md5(request.params.pwd);
	console.log(pseudo + " " + pwd);
	function getLastRecord(pseudo) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from users where username='"+pseudo+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo).then(function(rows){
		console.log("rows = " + JSON.stringify(rows))
		console.log("pwd = " + pwd)
		console.log("BASEpwd = " + rows["0"].pwd)
		if (rows["0"].pwd == pwd)
			res.send("true");
		else
			res.send("false");
	});
});

/* POST create user */
router.post('/create/:pseudo/:pwd/:email', function(request, res, next) {
	var pseudo = request.params.pseudo;
	var pwd = md5(request.params.pwd);
	var email = request.params.email;
	function getLastRecord(pseudo,pwd, email){
		return new Promise(function(resolve, reject) {
			var sql = "insert into users(username, pwd, email) values('"+pseudo+"','"+pwd+"','"+email+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo, pwd, email).then(function(rows){ res.send(rows); });
});

router.post('/changPwd/:pseudo/:pwd/:newPwd', function(request, res, next) {
	var pseudo = request.params.pseudo;
	var pwd = md5(request.params.pwd);
	var newPwd = md5(request.params.newPwd);
	function getLastRecord(pseudo) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from users where username='"+pseudo+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function changePassword(pseudo, pwd) {
		return new Promise(function(resolve, reject) {
			var sql = "update users set pwd='"+pwd+"' where username='"+pseudo+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo).then(function(rows){
		console.log("rows = " + JSON.stringify(rows))
		console.log("pwd = " + pwd)
		console.log("BASEpwd = " + rows["0"].pwd)
		if (rows["0"].pwd == pwd)
			changePassword(pseudo, newPwd).then(function(rows){ res.send(true); });
		else
			res.send(false);
	});
});

router.post('/changEmail/:pseudo/:pwd/:newEmail', function(request, res, next) {
	var pseudo = request.params.pseudo;
	var pwd = md5(request.params.pwd);
	var newEmail = request.params.newEmail;
	function getLastRecord(pseudo) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from users where username='"+pseudo+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function changeEmail(pseudo, newEmail) {
		return new Promise(function(resolve, reject) {
			var sql = "update users set email='"+newEmail+"' where username='"+pseudo+"';";
			con.query(sql, function (err, rows, fields) {
				if (err)return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo).then(function(rows){
		console.log("rows = " + JSON.stringify(rows))
		console.log("pwd = " + pwd)
		console.log("BASEpwd = " + rows["0"].pwd)
		if (rows["0"].pwd == pwd)
			changeEmail(pseudo, newEmail).then(function(rows){ res.send(true); });
		else
			res.send(false);
	});
});

module.exports = router;
