var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var con = require('./connexionDatabase.js');

/* GET users listing. */
router.get('/getUser/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select id from users where id='"+id+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});
//get id from name
router.get('/getUserId/:username', function(request, res, next) {
	var username = request.params.username;
	function getLastRecord(username) {
		return new Promise(function(resolve, reject) {
			var sql = "select id from users where username='"+username+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
	  });
	}
	getLastRecord(username).then(function(rows){
		if (!rows["0"])
		{
			res.send("falseUser")
		}
		// res.send((rows["0"].id).toString);
		res.send("id:"+rows["0"].id);
	});

});
/* GET all users */
router.get('/getAllUser', function(request, res, next) {

	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select * from users;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){ res.send(rows); });
});

router.get('/resetCoin/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "update users set tokens=500 where id='"+id+"' and tokens<500;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				if (rows.affectedRows==0)
				{
					resolve("KO")
					return;
				}
				resolve("OK");
			});
		});
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

/* GET all users order by Tokens*/
router.get('/getUserClassement', function(request, res, next) {

	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select id, username,tokens  from users order by tokens desc;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){ res.send(rows); });
});


/* UPDATE user with id */
router.put('/update/:id/:pseudo/:email', function(request, res, next) {
	var id = request.params.id;
	var pseudo = request.params.pseudo;
	var email = request.params.email;
	function getLastRecord(id, pseudo, email) {
		return new Promise(function(resolve, reject) {
			var sql = "update users set username='"+pseudo+"', email='"+email+"' where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			  });
			});
	}
	getLastRecord(id, pseudo, email).then(function(rows){ res.send(rows); });
});
router.put('/updateApp/:id/:pseudo/:email/:pwd', function(request, res, next) {
	var id = request.params.id;
	var pseudo = request.params.pseudo;
	var email = request.params.email;
	function getLastRecord(id, pseudo, email) {
		return new Promise(function(resolve, reject) {
			var sql = "update users set username='"+pseudo+"', email='"+email+"', pwd='"+pwd+"' where id = "+id+";";
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
	// var pwd = request.params.pwd;
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
		console.log(JSON.stringify(rows))

		if (!rows["0"])
		{
			jsonResponse = {
				res:"falseUSER"
			}
			res.send(JSON.stringify(jsonResponse));
			return;
		}
		console.log("rows = " + JSON.stringify(rows))
		console.log("pwd = " + pwd)
		console.log("BASEpwd = " + rows["0"].pwd)
		if (rows["0"].pwd == pwd)
		{
			var jsonResponse = {
				res:true,
				id:rows["0"].id
			}

		}

		else
		{
			jsonResponse = {
				res:"falsePwd"
			}
		}
		res.send(JSON.stringify(jsonResponse));
	});
});

router.get('/webconnect/:pseudo/:pwd', function(request, res, next) {
	var pseudo = request.params.pseudo;
	var pwd = md5(request.params.pwd);
	function getLastRecord(pseudo) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from users where username='"+pseudo+"' AND admin=1;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo).then(function(rows){
		if (rows["0"].pwd == pwd)
			res.send("true");
		else
			res.send("false");
	});
});

/* POST create user */
router.get('/create/:pseudo/:pwd/:email', function(request, res, next) {
	var pseudo = request.params.pseudo;
	var pwd = md5(request.params.pwd);
	var email = request.params.email;
	function getLastRecord(pseudo,pwd, email){
		return new Promise(function(resolve, reject) {
			var sql = "insert into users(username, pwd, email, tokens, admin) values('"+pseudo+"','"+pwd+"','"+email+"', 500, 0);";
			con.query(sql, function (err, rows, fields) {
				if (err)
				{
					// console.log("err")
					// console.log(err)
					// console.log("err")
					return resolve(err);
				}
				resolve(rows);
			});
		});
	}
	getLastRecord(pseudo, pwd, email).then(function(rows){
		var error = rows["sqlMessage"];
		if (error)
		{
			console.log(error)
			if (error.indexOf("username") >= 0)
				res.send("duplicatePseudo")
			else if (error.indexOf("email") >= 0)
				res.send("duplicateEmail")
		}
		else
		{
			res.send("true");
		}
	});
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
