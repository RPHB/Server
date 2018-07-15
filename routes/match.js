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
// var sleep = require('sleep');
// var sleep = require('system-sleep');

/* POST create sport */
router.post('/create/:idTeam1/:idTeam2/:date/:quotation1/:quotation2/:quotation3/:sport/:idEvent', function(request, res, next) {
	var idTeam1 = request.params.idTeam1;
	var idTeam2 = request.params.idTeam2;
	var date = request.params.date;
	var quotation1 = request.params.quotation1;
	var quotation2 = request.params.quotation2;
	var quotation3 = request.params.quotation3;
	var sport = request.params.sport;
	var idEvent = request.params.idEvent;
	function getLastRecord(idTeam1, idTeam2, date, quotation1, quotation2, quotation3, sport, idEvent){
		return new Promise(function(resolve, reject) {
			var sql = "insert into matchs(idTeam1, idTeam2, date, quotation1, quotation2, quotation3, score, result, sport, idEvent) values('"+idTeam1+"', '"+idTeam2+"', '" + date + "','"+quotation1+"', '"+quotation2+"', '"+quotation3+"', '-', '3', '"+sport+"', '"+idEvent+"');";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(idTeam1, idTeam2, date, quotation1, quotation2, quotation3, sport, idEvent).then(function(rows){ res.send(rows); });
});

/* UPDATE sport with id */
router.put('/update/:id/:idTeam1/:idTeam2/:date/:quotation1/:quotation2/:quotation3/:sport/:idEvent/:score', function(request, res, next) {
	var id = request.params.id;
	var idTeam1 = request.params.idTeam1;
	var idTeam2 = request.params.idTeam2;
	var quotation1 = request.params.quotation1;
	var quotation2 = request.params.quotation2;
	var quotation3 = request.params.quotation3;
	var score = request.params.score;
	var sport = request.params.sport;
	var idEvent = request.params.idEvent;
	var date = request.params.date;
	var result;
	if(score.split('-')[0] == score.split('-')[1]) result = 1;
	if(score.split('-')[0] > score.split('-')[1]) result = 0;
	if(score.split('-')[0] < score.split('-')[1]) result = 2
	;
	function getLastRecord(id, idTeam1, idTeam2, quotation1, quotation2, quotation3, sport, idEvent, score) {
		return new Promise(function(resolve, reject) {
			var sql = "update matchs set idTeam1='"+idTeam1+"', idTeam2='"+idTeam2+"', date='"+date+"', quotation1='"+quotation1+"', quotation2='"+quotation2+"', quotation3='"+quotation3+"', score='"+score+"', result='"+result+"', sport='"+sport+"', idEvent='"+idEvent+"' where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			  });
			});
	}
	getLastRecord(id, idTeam1, idTeam2, quotation1, quotation2, quotation3, sport, idEvent, score).then(function(rows){ res.send(rows); });
});

/* DELETE sport with id */
router.delete('/delete/:id', function(request, res, next) {
	var id = request.params.id;
	function getLastRecord(id){
		return new Promise(function(resolve, reject) {
			var sql = "delete from matchs where id = "+id+";";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){ res.send(rows); });
});

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
router.get('/getMatch/:id', function(request, res, next) {
	var matchid=request.params.id;
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select team1.name as teamn1,team2.name as teamn2,  matchs.id, matchs.date from matchs, teams as team1, teams as team2  where team1.id=matchs.idteam1 and team2.id=matchs.idteam2 and matchs.id='"+matchid+"';";
			console.log(sql)
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord().then(function(rows){
	var teamListJSON = rows
		var teamListJSONSize = teamListJSON.length
		var resultJson = "{"
		for (var i = 0; i < teamListJSONSize; ++i)
		{
			// console.log(JSON.stringify(teamListJSON[i]))
			resultJson+='"child'+i+'":' + JSON.stringify(teamListJSON[i]) + ",";

		}
		resultJson+='"length":'+teamListJSONSize;
		resultJson+="}";
		console.log(resultJson)
		res.send(resultJson);
	
	});
});
router.get('/teams', function(request, res, next) {
	function getLastRecord() {
		return new Promise(function(resolve, reject) {
			var sql = "select * from teams order by name;";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	getLastRecord().then(function(rows){ 

	var teamListJSON = rows
		var teamListJSONSize = teamListJSON.length
		var resultJson = "{"
		for (var i = 0; i < teamListJSONSize; ++i)
		{
			// console.log(JSON.stringify(teamListJSON[i]))
			resultJson+='"child'+i+'":' + JSON.stringify(teamListJSON[i]) + ",";

		}
		resultJson+='"length":'+teamListJSONSize;
		resultJson+="}";
		res.send(resultJson);
	});
});

router.get('/getFavoriteMatchs', function(request, res, next) {
	function getFavoriteMatchsId() {
		return new Promise(function(resolve, reject) {
			var sql = "SELECT bets.idmatch, COUNT(*) as occur FROM bets, matchs where matchs.result=3 GROUP BY idMatch ORDER BY `occur` DESC limit 5;";
			console.log(sql)
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function getMatchInfo(rows) {
		return new Promise(function(resolve, reject) {
			var resultSize=Object.keys(rows).length;
			var matchList="";
			// console.log(rows);
			for (var i = 0; i < resultSize; ++i)
			{
				matchList+=rows[i].idmatch + ',';
			}
			matchList=matchList.substring(0,matchList.length - 1);

			
			
			var sql = "select team1.name as teamn1, team2.name as teamn2, matchs.id from matchs,teams as team1, teams as team2 where matchs.id in ("+matchList+") and team1.id=idteam1  and team2.id=idteam2 ;";

			console.log(sql)
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	
	getFavoriteMatchsId().then(function(rows){

		getMatchInfo(rows).then(function(rows){

		
		var teamListJSON = rows
		var teamListJSONSize = teamListJSON.length
		var resultJson = "{"
		for (var i = 0; i < teamListJSONSize; ++i)
		{
			// console.log(JSON.stringify(teamListJSON[i]))
			resultJson+='"child'+i+'":' + JSON.stringify(teamListJSON[i]) + ",";

		}
		resultJson+='"length":'+teamListJSONSize;
		resultJson+="}";
		res.send(resultJson);
	
		});


	});
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

	// console.log(rows)
		for (var i = 0; i < Object.keys(rows).length; ++i)
		{
			// console.log(rows[i].id)
			// sleep(500)
			var req = http.get('http://127.0.0.1:3000/match/update/' + rows[i].id, function(response) {
				
			});
			req.on('error',function(err){
				console.log("pas de matchs pour cette equipe");
				console.log(err);
			 });
			// setTimeout(function(){goReq(i);}, 500)
			// var goReq = function(number)
			// {
				// console.log('http://127.0.0.1:3000/match/' + number)
				// http.get('http://127.0.0.1:3000/match/' + number, function(response) {
					// console.log("success")
					// console.log('Status:', response.statusCode);
					// console.log('Headers: ', response.headers);
					// response.pipe(process.stdout);
				// });
			// }
			
			// request('http://127.0.0.1:3000/match/' + 18).then(function(response){
			// console.log(response);})
			
		}
	
	});
	res.send('Done');

});


/* GET users listing. */
router.get('/updateTeamList', function(req, res, next) {
	var teamListHTML = fs.readFileSync("teamList.txt", "UTF-8");
	var teamListJSON = html2json(teamListHTML);
// console.log(teamListJSON)
// console.log(teamListHTML)
// console.log(teamListHTML)
// console.log(teamListJSON)
	var teamListJSON = teamListJSON.child;
	var teamListJSONSize = teamListJSON.length;
	var resultJson = "{"
	function checkTeamExist(value, team) {
		return new Promise(function(resolve, reject) {
			team=team.substring(0, team.indexOf("(") - 1);
			var sql = "insert ignore into teams (id, name) values('"+value+"','" + team + "');";
			// console.log(team + "       pendans req")
			// console.log(sql)
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
		checkTeamExist(value, team).then(function(rows, t, v){
		});

	}
	resultJson+='"length":'+teamListJSONSize;
	resultJson+="}";
	res.send(resultJson);

})

router.get('/update/:team_id', function(req, res, next) {
	function containNumber(str)
	{
		function isDigit(a)
		{
			if (a=='0' || a=='1' ||a=='2' ||a=='3' ||a=='4' ||a=='5' ||a=='6' ||a=='7' ||a=='8' ||a=='9')
			{
				// console.log("'" + a + "' est un chiffre")
				return true;
			}

			return false;
		}
		for (var i = 0; i < str.length; ++i)
		{
			if (isDigit(str[i]) == true)
			{
				// console.log("'"+str+"' contient un nombre '" + str[i]+"'")
				return true;
			}

		}
		// console.log("'"+str+"' contient pas de nombre")
		return false;
	}
	function checkMatchExist(id1, id2,d,score) {
		return new Promise(function(resolve, reject) {

			var date = d.substring(d.indexOf(" ") + 1);
			date = date.substring(0, date.indexOf(" "));
			var jour=date.substring(0, 2);
			var mois=date.substring(3, 5);
			var année=date.substring(6, 10);
			date=année+"-"+mois+"-"+jour
			var result=3;
			var scoreT1=score.substring(0, score.indexOf("-") - 1)
			var scoreT2=score.substring(score.indexOf("-") + 2)
			if (scoreT1<scoreT2)
				result=2;
			else if (scoreT1>scoreT2)
				result=1
			else if (containNumber(score) == true)
			{
				result=0;
			}

		   // var sql = "insert into matchs (idTeam1, idTeam2, date, score, result) values(select id from teams where name='"+nomTeam1+"',select id from teams where name='"+nomTeam2+"','"+date+"','"+score+"', 0);";
			var sql = "insert into matchs (idTeam1, idTeam2, date, score, result) values ('"+id1+"','"+id2+"','"+date+"','"+score+"','"+result+"') on duplicate key update score='"+score+"', result='"+result+"';";
			// console.log(sql);
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function getTeamId(team1, team2, date, score) {
		return new Promise(function(resolve, reject) {
			var sql = "select '"+date+"' as date,'"+score+"' as score,id, name from teams where name='"+team1+"' or name='"+team2+"';";
			// console.log(sql);
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	// console.log(req.params.team_id)
	request('http://www.foot-national.com/partage.php?type=3&id='+req.params.team_id).then(function(response){
		var cpt=0;
		var body = response["body"];
		console.log(body.length)
		var result = "{";
		var bodyToJSON = html2json(body);
		var tableauScore = bodyToJSON.child["0"].child;
		// console.log(tableauScore)
		var sizeTableauScore=tableauScore.length
		if (body.length<=1640)
		{
			res.send("pas de match pour cette equipe");
			return;
		}
		// console.log(sizeTableauScore)
		for (var i = 0; i < sizeTableauScore; ++i)
		{

			var currChild=tableauScore[i].child;
			// console.log(currChild)
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
						var score = currChild[5].child["0"].child["0"].text;
						var match=currChild[4].child["1"].child["0"].text;
						var nomTeam1 = match.substring(0, match.indexOf("-") - 1);
						var nomTeam2 = match.substring(match.indexOf("-") + 2);
						if (nomTeam2<nomTeam1)
						{
							var scoreTab=score.split("");
							scoreTab=scoreTab.reverse();
							score=scoreTab.join("");
						}
						// console.log(
						getTeamId(nomTeam1, nomTeam2, currChild[2].child["0"].text, score).then(function(rows, t, v){
							// console.log(rows)
							if (!rows || !rows[0] || !rows[1])
							{

								return;


							}
							var t1 = rows[0].name;
							var t2 = rows[1].name;
							var id1 = rows[0].id;
							var id2 = rows[1].id;
							var date = rows[1].date;
							var score = rows[1].score;

							// console.log(t1 + " " + t2 + " " + id1 + " " + id2)
							if (t2 < t1)
							{
								t2=rows[0].name;
								t1=rows[1].name;
								id1 = rows[1].id;
							    id2 = rows[0].id;
								// var scoreTab=score.split("");
								// scoreTab=scoreTab.reverse();
								// score=scoreTab.join("");
							}
							// console.log(score);
							checkMatchExist(id1,id2,date, score).then(function(rows, t, v){});

						});
					}
				}

			}
			else{
				continue;
			}
			
				
			


		}
		
		result=result.substring(0, result.length - 1);
		result+="}";
		result=JSON.parse(result);
		var resultSize=Object.keys(result).length;
		result.length=resultSize;
		// console.log(result);
		// console.log(result)
		res.send("toto");
	})




});
router.get('/:team_id', function(request, res, next) {
	// console.log("tamere")
	var id = request.params.team_id
	function getLastRecord(id) {
		return new Promise(function(resolve, reject) {
			var sql = "select (select name from teams where id='"+id+"') as teamname1, teams.name as teamname2, idteam1,matchs.id as matchId, idteam2,date, score from matchs, teams where ((idTeam1='"+id+"' and idTeam2=teams.id)or (idTeam2='"+id+"' and idTeam1=teams.id));";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	function getTeamNames(id1, id2)
	{
		return new Promise(function(resolve, reject) {
			var sql = "select name from teams where id='"+id1+"' or id='"+id2+"';";
			con.query(sql, function (err, rows, fields) {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	getLastRecord(id).then(function(rows){ 
	var teamListJSON = rows
		var teamListJSONSize = teamListJSON.length
		var resultJson = "{"
		for (var i = 0; i < teamListJSONSize; ++i)
		{
			// console.log(JSON.stringify(teamListJSON[i]))
			resultJson+='"child'+i+'":' + JSON.stringify(teamListJSON[i]) + ",";

		}
		resultJson+='"length":'+teamListJSONSize;
		resultJson+="}";
		res.send(resultJson);
	});
});




module.exports = router;
