var express = require('express');
var router = express.Router();
// var request=require('request')
var request=require('request-then')
var html2json = require('html2json').html2json;
var json2html = require('html2json').json2html;
var async = require('async');
var fs = require("fs");
var http = require('http');
var con = require('./connexionDatabase.js');


/* GET all sport */
router.get('/getAll', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select * from matchs;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){ res.send(rows); });
});

router.get('/updateMatch', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select id from teams;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){
	
		for (var i = 0; i < Object.keys(rows).length; ++i)
		// for (var i = 0; i < 1; ++i)
		{
			// request('http://127.0.0.1:3000/match/' + rows[0].id)
			http.get('http://127.0.0.1:3000/match/' + i, function(response) {
    // console.log('Status:', response.statusCode);
    // console.log('Headers: ', response.headers);
    // response.pipe(process.stdout);
});
			// request('http://127.0.0.1:3000/match/' + 18).then(function(response){
			// console.log(response);})
			
		}
	
	});
});


/* GET users listing. */
router.get('/updateTeamList', function(req, res, next) {
	var teamListHTML = fs.readFileSync("teamList.txt", "UTF-8");
	var teamListJSON = html2json(teamListHTML);

	var teamListJSON = teamListJSON.child;
	var teamListJSONSize = teamListJSON.length;
	var resultJson = "{"
	function checkTeamExist(value, team) {
		return new Promise(function(resolve, reject) {
			
			var sql = "insert ignore into teams (id, name) values('"+value+"','" + team + "');";
			// console.log(team + "       pendans req")
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows, team, value);
			});
		});
	}
	for (var i = 1; i < teamListJSONSize; ++i)
	{
		var value = teamListJSON[i].attr.value
		var team = teamListJSON[i].child["0"].text
		checkTeamExist(value, team).then(function(rows, t, v){});
		
	}
	resultJson+='"length":'+teamListJSONSize;
	resultJson+="}";
	res.send(resultJson)

})

router.get('/:team_id', function(req, res, next) {
	request('http://www.foot-national.com/partage.php?type=3&id='+req.params.team_id).then(function(response){
		var cpt=0;
		var body = response["body"];
		var result = "{";
		var bodyToJSON = html2json(body);
		var tableauScore = bodyToJSON.child["0"].child;
		var sizeTableauScore=tableauScore.length
		for (var i = 0; i < sizeTableauScore; ++i)
		{

			var currChild=tableauScore[i].child;
			if (currChild)
			{
				var sizeChild=currChild.length;
				var res1 = "";
				if (currChild[2])
				{
					if (currChild[2].child)
					{
						result+='"child'+cpt+'":{';
						result+='"date":"'+currChild[2].child["0"].text+'",';
						result+='"match":"'+currChild[4].child["1"].child["0"].text+'",';
						result+='"score":"'+currChild[5].child["0"].child["0"].text+'"';
						result+="},";
						++cpt;

					}
				}

			}


		}
		result=result.substring(0, result.length - 1);
		result+="}";
		result=JSON.parse(result);
		var resultSize=Object.keys(result).length;
		result.length=resultSize;
		console.log(result);
		res.send(result);
	})

});




module.exports = router;
