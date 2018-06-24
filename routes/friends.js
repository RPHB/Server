var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var con = require('./connexionDatabase.js');
var makeJsonFriends = function(rows)
{
	var resJson = "{"
	for (var i = 0; i < rows.length; ++i)
	{
		resJson+='"child'+i+'":' + JSON.stringify(rows[i]) + ",";
	}
	resJson+='"length":'+rows.length;
	resJson+="}";
	return resJson;
	
}
// La liste de mes amis VALIDES
router.get('/getFriends/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select users.id, username from users, user_friends where ((asking_friend='"+id+"' and asked_friend=users.id) or  (asked_friend='"+id+"' and asking_friend=users.id)) and state=1 and denied=0;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){
		if (rows.length > 0)
			res.send(makeJsonFriends(rows));
		else
			res.send("Aucun ami");
	});
});

//La liste des demandes d'ami que je n'ai pas encore acceptés et que je n'ai pas refusés
router.get('/getPendingFriends/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select users.id, username from users, user_friends where ((asking_friend='"+id+"' and asked_friend=users.id) or  (asked_friend='"+id+"' and asking_friend=users.id)) and state=0 and denied=0;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){
		if (rows.length > 0)
		{
			res.send(makeJsonFriends(rows));
		}
			
		else
			res.send("Aucun ami");
	});
});

//cette route sert a refuser une demande ou a supprimer un ami
// La difference est qu'un "ami" refusé aura un status de 0 car il n'a jamais été accepté et denied a 1
//alors qu'un ami supprimé aura status et denied a 1
router.get('/refuseFriend/:id_adding/:id_added', function(request, res, next) {
	var id_adding = request.params.id_adding;
	var id_added = request.params.id_added;
	function refuseFriend(id_adding, id_added) {
		return new Promise(function(resolve, reject) {
			var sql = "update user_friends set denied=1 where asking_friend='"+id_added+"' and asked_friend='"+id_adding+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	refuseFriend(id_adding, id_added).then(function(rows){ res.send(rows); });
});

// fais une demande d'ami ou en accepte une (si A invite B alors que B a deja invité A cela accepte la demande de B vers A)
router.get('/addFriend/:id_adding/:id_added', function(request, res, next) {
	var id_adding = request.params.id_adding;
	var id_added = request.params.id_added;
	function getExistingFriendRequest(id_adding, id_added) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from user_friends where asking_friend='"+id_added+"' and asked_friend='"+id_adding+"' and state=0 and denied=0;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function accepteFriend(id_adding, id_added) {
		return new Promise(function(resolve, reject) {
			var sql = "update user_friends set state=1 where asking_friend='"+id_adding+"' and asked_friend='"+id_added+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function addFriend(id_adding, id_added) {
		return new Promise(function(resolve, reject) {
			var sql = "insert into user_friends(asking_friend,asked_friend) values ('"+id_adding+"','"+id_added+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getExistingFriendRequest(id_adding,id_added).then(function(rows){
		if (rows.length > 0)
			accepteFriend(id_added, id_adding).then(function(rows){res.send(rows); });
		else
			addFriend(id_adding, id_added).then(function(rows){ res.send(rows); });
	});
});


module.exports = router;
