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
			team=team.substring(0, team.indexOf("(") - 1);
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
	function checkMatchExist(t1,t2,id1, id2,d,score) {
		return new Promise(function(resolve, reject) {
			var nomTeam1 = t1
			var nomTeam2 = t2
			
			// console.log("match")
			// console.log(match)
			// console.log("nomTeam1")
			console.log(nomTeam1)
			// console.log("nomTeam2")
			console.log(nomTeam2)
			var date = d.substring(d.indexOf(" ") + 1);
			date = date.substring(0, date.indexOf(" "));
			var jour=date.substring(0, 2);
			var mois=date.substring(3, 5);
			var année=date.substring(6, 10);
			date=année+"-"+mois+"-"+jour
			
			// var sql = "insert ignore into matchs (idTeam1, idTeam2, date, score, result) values(select id from teams where name='"+nomTeam1+"',select id from teams where name='"+nomTeam2+"','"+date+"','"+score+"', 0);";
			var sql = "insert ignore into matchs (idTeam1, idTeam2, date, score, result) select teams.id from teams where name='"+nomTeam1+"',select id from teams where name='"+nomTeam2+"','"+date+"','"+score+"', 0);";
			console.log(sql);
			// con.query(sql, function (err, rows, fields) {
				// if (err) return reject(err);
				// resolve(rows, team, value);
			// });
		});
	}
	function getTeamId(team1, team2, date, score) {
		return new Promise(function(resolve, reject) {
			var sql = "select '"+date+"' as date,'"+score+"' as score,id, name from teams where name='"+team1+"' or name='"+team2+"';";
			console.log(sql);
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
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
						var match=currChild[4].child["1"].child["0"].text;
						var nomTeam1 = match.substring(0, match.indexOf("-") - 1);
						var nomTeam2 = match.substring(match.indexOf("-") + 2);
						// console.log(
						getTeamId(nomTeam1, nomTeam2, currChild[2].child["0"].text, currChild[5].child["0"].child["0"].text).then(function(rows, t, v){
							console.log(rows)
							// var t1 = rows[0].name;
							// var t2 = rows[1].name;
							// var id1 = rows[0].id;
							// var id2 = rows[1].id;
							// console.log(t1 + " " + t2 + " " + id1 + " " + id2 + currChild[2].child["0"].text)
							// if (t2 < t1)
							// {
								// t2=rows[0].name;
								// t1=rows[1].name;
								// id1 = rows[1].id;
							    // id2 = rows[0].id;
							// }
							//checkMatchExist(t1,t2,id1,id2,currChild[5].child["0"].child["0"].text).then(function(rows, t, v){});

						});
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
