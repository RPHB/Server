var express = require('express');
var router = express.Router();
// var request=require('request')
var request=require('request-then')
var html2json = require('html2json').html2json;
var json2html = require('html2json').json2html;
var async = require('async');
var fs = require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
	var teamListHTML = fs.readFileSync("teamList.txt", "UTF-8");
	
	var teamListJSON = html2json(teamListHTML);

	var teamListJSON = teamListJSON.child;
	var teamListJSONSize = teamListJSON.length;
	console.log(teamListJSONSize)
	var resultJson = "{"
	for (var i = 1; i < teamListJSONSize; ++i)
	{
		var value = teamListJSON[i].attr.value
		var team = teamListJSON[i].child["0"].text
		resultJson+='"child'+i+'":{';
		resultJson+='"team":"'+team+'",';
		resultJson+='"value":"'+value+'"';
		resultJson+="},";
		//team = team.substring(0, team.indexOf(" "))
		// console.log(value)
		// console.log(team)
	}
	//resultJson=resultJson.substring(0, resultJson.length - 1);
	resultJson+='"length":'+teamListJSONSize;
	resultJson+="}";
    //resultJson=JSON.parse(resultJson);
	// var resultSize=Object.keys(resultJson).length;
	// resultJson.length=resultSize;
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
