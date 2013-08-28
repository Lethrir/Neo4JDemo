var neo4j = require('neo4j');
var express = require('express');

var db = new neo4j.GraphDatabase('http://localhost:7475');
var app = express();

var getLocations = 'START n=node(*) WHERE HAS (n.Name) RETURN n';

function getRoads(id){
  return 'START a=node(' + id + ') MATCH (a)-[r:ROAD]->() RETURN r';
}

app.get('/', function(req, res){
  res.status(200).sendfile(__dirname + '/public/index.html');
});

app.get('/locations', function(req, res){
	returnQuery(getLocations, res);
});

app.get('/roads/:id', function(req, res){
	var id = Number(req.params.id);
	returnQuery(getRoads(id), res);
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);

function returnQuery(query, res){
	db.query(query, {}, function (err, results) {
		if(results == undefined){
			res.send('err: ' + err);
		} else {
		var data = [];
		for(var i = 0; i < results.length; i++){
			data.push(results[i].n._data.data);
		}
		res.set({
  			'Content-Type': 'text/json'
  		});
  		res.send(data);
  	}
	});
}