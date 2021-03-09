const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require('moment');
//FILE UPLOAD CONFIGS - PREDELAJ DA JE SAMO ZA SLIKE/DOKUMENTE, manj specifični pogoji
const multer = require("multer");
const path = require('path');
const http = require('http');

const { response, request } = require('express');

//DATABASE:
//declare the connection, specifying how to connect to the database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "anok1515",
	database:"freelance_slo", //freelance_slo na laptopu, freelanceslo na stacionarcu
    insecureAuth : false
  });
//check the connection, if any errors are caught, throw them. Otherwise log a successful connection.  
connection.connect(function(err) {
    if (err) throw err;
	else {
		console.log("Connected to database.");
		app.set('connection',connection);
	}
});

//APP:

//configure the app
var app = express();
//let it know we are using the session module

app.use(session({
	secret: 'asdf',
	resave: false,
	saveUninitialized: false
}));
//let it know we're using bodyparser modules to parse the bodies of POST requests
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//create a local folder to serve static files
app.use(express.static('static'));
//set the view engine to the ejs module for page rendering
app.set('view engine', 'ejs');

//ROUTING

//make the user go to the index.html file when a GET request is sent for the app from the server root
app.get('/', function(request, response) {
	response.redirect('/static/index.html');
});

//routing po strani
const delavciNav = require('./routes/delavci/navigation');
//urejanje racuna
const delavciAcc= require('./routes/delavci/acc');
//urejanje CV-ja
const delavciCV = require('./routes/delavci/cv');
//odzivi na dela
const delavciDela = require('./routes/delavci/dela')

app.use('/delavci/nav/', delavciNav);
app.use('/delavci/acc/',delavciAcc);
app.use('/delavci/cv/',delavciCV);
app.use('/delavci/dela/',delavciDela)

//routing za podjetja
const podjetjaNav = require('./routes/podjetja/navigation');
//urejanje racuna
const podjetjaAcc = require('./routes/podjetja/acc');
//urejanje del
const podjetjaDela = require('./routes/podjetja/dela');

app.use('/podjetja/nav/', podjetjaNav);
app.use('/podjetja/acc/', podjetjaAcc);
app.use('/podjetja/dela/', podjetjaDela);

const adminNav = require('./routes/admin/navigation');
const adminAcc = require('./routes/admin/acc');
const adminMan = require('./routes/admin/management');

app.use('/admin/nav/', adminNav);
app.use('/admin/acc/', adminAcc);
app.use('/admin/management/', adminMan);

//SERVER STUFF
var server = app.listen(3000);