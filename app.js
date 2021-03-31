const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const path = require('path');
const http = require('http');

const { response, request } = require('express');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
	database:"freelance_slo", 
    insecureAuth : false
  });

connection.connect(function(err) {
    if (err) throw err;
	else {
		console.log("Connected to database.");
		app.set('connection',connection);
	}
});

var app = express();

app.use(session({
	secret: 'asdf',
	resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.redirect('/static/index.html');
});


const delavciNav = require('./routes/delavci/navigation');
const delavciAcc= require('./routes/delavci/acc');
const delavciCV = require('./routes/delavci/cv');
const delavciDela = require('./routes/delavci/dela')

app.use('/delavci/nav/', delavciNav);
app.use('/delavci/acc/',delavciAcc);
app.use('/delavci/cv/',delavciCV);
app.use('/delavci/dela/',delavciDela)

const podjetjaNav = require('./routes/podjetja/navigation');
const podjetjaAcc = require('./routes/podjetja/acc');
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

var server = app.listen(3000);