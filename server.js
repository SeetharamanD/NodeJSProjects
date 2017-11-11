
//BASIC SETUP
var http = require('http'),
express  = require('express'),
mysql = require('mysql'),
parser = require('body-parser');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '84a83e60',
  apiSecret: 'd95d8b612879cce0'
});

// const nexmo = new Nexmo({
//   apiKey: '97f6ee96',
//   apiSecret: '8004ec4a0971ab74'
// });



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

app.post('/technician/signup', function(req,res){
		var response = {};
	
			if( typeof req.body.first_name !='undefined' ){
				
				if(typeof req.body.last_name !='undefined'){
					
					if(typeof req.body.mobile_no !='undefined'){
						
						if(typeof req.body.house_no !='undefined'){
							
							if(typeof req.body.street !='undefined'){
								
								if(typeof req.body.city !='undefined'){
								
									if(typeof req.body.state !='undefined'){
										
										if(typeof req.body.pincode !='undefined'){
											
											var val_first_name= req.body.first_name;
											var val_last_name= req.body.last_name;
											var val_mobile_no= req.body.mobile_no;
											var val_house_no= req.body.house_no;
											var val_street= req.body.street;
											var val_city= req.body.city;
											var val_state= req.body.state;
											var val_pincode= req.body.pincode;
											
										connection.query('INSERT INTO technician_table (first_name, last_name, mobile_no, house_no, street, city, state, pincode,created_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [val_first_name, val_last_name, val_mobile_no, val_house_no, val_street, val_city, val_state, val_pincode, new Date()],
												function(err,result){
													if(!err){
														if(result.affectedRow !=0){
															response={'result' : 'success'};
														}
														else {
															response={'msg': 'No Result Found'};
														}
														res.setHeader('Content-Type','application/json');
														res.status(200).send(JSON.stringify(response));
													}else{
														res.status(400).send(err);
													}
												});
										}else{
											response={'message': 'Please Enter pincode'};
										}
									}else{
										response={'message': 'Please Enter state'};
									}
								}else{
										response={'message': 'Please Enter city'};
								}
							}else{
									response={'message': 'Please Enter street'};
							}
						}else{
								response={'message': 'Please Enter house no'};
						}
					}else{
							response={'message': 'Please Enter mobile no'};
					}
				}else{
					response={'message': 'Please Enter last name'};
				}
			}else{
					response={'message': 'Please Enter first name'};
			}
			
			res.setHeader('Content-Type','application/json');
			res.status(200).send(JSON.stringify(response));
	
});

app.post('/SendOTP', function(req,res){

var frm = req.body.from_company;
var to = req.body.to_mobile_no;
var txt = req.body.sms_content;

var response = {};

nexmo.message.sendSms(
  frm, to, txt, {type: 'unicode'},
    (err, responseData) => {
      if (err) {
        response={'message': 'FAILURE'};
      } else {
       response={'message': 'SUCCESS'};
      }
		res.setHeader('Content-Type','application/json');
		res.status(200).send(JSON.stringify(response));
    }
 );

	
});

/* Firebase Notification*/

var FCM = require('fcm-push');


var serverKey = 'AAAASlRe5-o:APA91bHfQzANeXQA8wNfczkhz97SGEA6sWJKL6LyVH6pRCJXB4LhqnkBowgas-sDaG93wMVV9b76ZCxMacGhUgPtxTqQYH10u9n7g_U9sPebaz_xzmPrPREziUv8_O5lMO7RvsVt639U';
var fcm = new FCM(serverKey);


app.post('/PushNotification', function(req,res){

var message = {
    to: 'registration_token_or_topics', // required fill with device token or topics
    collapse_key: 'your_collapse_key', 
    data: {
        your_custom_data_key: 'your_custom_data_value'
    },
    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    }
};


  fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    });
	
});








/*
var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});
server.listen(process.env.PORT);
*/
