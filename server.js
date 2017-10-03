
//BASIC SETUP
var http = require('http'),
express  = require('express'),
mysql = require('mysql'),
parser = require('body-parser');

//DATABASE CONNECTION
var connection =mysql.createConnection({
host :'bptm1x4fq-mysql.services.clever-cloud.com',
user : 'uyhmiwhhwy0k3tko',
password: 'Sa80f2ywbdoFZmAPQTX',
database: 'bptm1x4fq'
});

try{
connection.connect();
}catch(e){
console.log('Database Connection failed:' +e);
}


//SETUP EXPRESS
var app =express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true}));
app.set('port',process.env.PORT || 5000);

//SET DEFAULT ROUTE
app.get('/', function(req, res){
res.send('<html><body><p> Welcome to Testing App</p></body></html>');
});

//CREATE SERVER
http.createServer(app).listen(app.get('port'),function(){
console.log('Server listening on port'+app.get('port'));
});


app.post('/user/add', function (req, res){
	var response = [];
	
	if( typeof req.body.first_name !='undefined' && typeof req.body.last_name !='undefined'){
		var f_name=req.body.first_name, l_name=req.body.last_name;
		
	connection.query('INSERT INTO login (first_name, last_name) VALUES (?, ?)', 
			[f_name,l_name],
			function(err,result){
				if(!err){
					if(result.affectedRow !=0){
						response.push({'result' : 'success'});
					}
					else {
						response.push({'msg': 'No Result Found'});
					}
					res.setHeader('Content-Type','application/json');
					res.status(200).send(JSON.stringify(response));
				}else{
					res.status(400).send(err);
				}
			});
	} else {
		response.push({'result':'error', 'msg': 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send(JSON.stringify(response));
	}
	
});

app.get('/user/getAllUsers', function (req, res){
	
	var response=[];
	
	connection.query('SELECT * FROM login', function(err, rows, fields){
		
		if(!err){
			
			response.push({'result' : 'success'});
				if(rows.length !=0){
					response.push({'data': rows});
				}
				else{
					response.push({'msg':' No Result found'});
				}
				
				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
				
		}else{
			
			res.status(400).send(err);
		}
		
		
					
	});
});

app.get('/user/getSingleUserDetailsByID/:id', function(req, res){
	
	try{
	var response = [];
	
	var jsonObject = {};
	
	var id=req.params.id;
		
		connection.query('SELECT first_name,last_name from login where id = ?', [id], function(err, rows, fields) {
			
			if (!err){
  			var response = [];

			if (rows.length != 0) {
				//response.push({'result' : 'success', 'data' : rows});
				jsonObject={'result' : 'success', 'data' : rows};
			} else {
				//response.push({'result' : 'error', 'msg' : 'No Results Found'});
				jsonObject={'result' : 'error', 'msg' : 'No Results Found'};
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(jsonObject));
  		} else {
		    res.status(400).send(err);
	  	}
	});
	
	}catch(e){
	response.push({'error':e});
	}	
	
});


/*
var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});
server.listen(process.env.PORT);
*/
