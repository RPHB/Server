var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var con = require('./connexionDatabase.js');
 
// La liste de mes amis VALIDES
router.get('/getFriends/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from user_friends where (asking_friend='"+id+"' or  asked_friend='"+id+"') and state=1 and denied=0;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){
		if (rows.length > 0)
			res.send(rows);
		else
			res.send("Aucun ami");
	});
});

//La liste des demandes d'ami que je n'ai pas encore acceptés et que je n'ai pas refusés
router.get('/getPendingFriends/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from user_friends where asked_friend='"+id+"' and state=0 and denied=0;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){
		if (rows.length > 0)
			res.send(rows);
		else
			res.send("Aucun ami");
	});
});

//cette route sert a refuser une demande ou a supprimer un ami
// La diference est qu'un "ami" refusé aura un status de 0 car il n'a jamais été accepté et denied a 1
//alors qu'un ami supprimé aura status et denied a 1
router.post('/refuseFriend/:pseudo_adding/:pseudo_added', function(request, res, next) {
	var pseudo_adding = request.params.pseudo_adding;
	var pseudo_added = request.params.pseudo_added;
	function refuseFriend(pseudo_adding, pseudo_added) {
		return new Promise(function(resolve, reject) {
			var sql = "update user_friends set denied=1 where asking_friend='"+pseudo_added+"' and asked_friend='"+pseudo_adding+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	refuseFriend(pseudo_adding, pseudo_added).then(function(rows){ res.send(rows); });
});

// fais une demande d'ami ou en accepte une (si A invite B alors que B a deja invité A cela accepte la demande de B vers A)
router.post('/addFriend/:pseudo_adding/:pseudo_added', function(request, res, next) {
	var pseudo_adding = request.params.pseudo_adding;
	var pseudo_added = request.params.pseudo_added;
	function getExistingFriendRequest(pseudo_adding, pseudo_added) {
		return new Promise(function(resolve, reject) {
			var sql = "select * from user_friends where asking_friend='"+pseudo_added+"' and asked_friend='"+pseudo_adding+"' and state=0 and denied=0;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function accepteFriend(pseudo_adding, pseudo_added) {
		return new Promise(function(resolve, reject) {
			var sql = "update user_friends set state=1 where asking_friend='"+pseudo_adding+"' and asked_friend='"+pseudo_added+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function addFriend(pseudo_adding, pseudo_added) {
		return new Promise(function(resolve, reject) {
			var sql = "insert into user_friends(asking_friend,asked_friend) values ('"+pseudo_adding+"','"+pseudo_added+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getExistingFriendRequest(pseudo_adding,pseudo_added).then(function(rows){
		if (rows.length > 0)
			accepteFriend(pseudo_added, pseudo_adding).then(function(rows){res.send(rows); });
		else
			addFriend(pseudo_adding, pseudo_added).then(function(rows){ res.send(rows); });
	});
});


module.exports = router;
