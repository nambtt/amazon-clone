var express = require('express');
var morgan = require('morgan');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var ejs = require('ejs');
var engine = require('ejs-mate');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);

var passport = require('passport');

var User = require('./models/user');
var secret = require('./config/secret');

// Init app
var app = express();

// connect database
mongoose.connect(secret.database, function(err) {
	if (err) {
		console.log(err);
	}	else {
		console.log("Connected to the database");
	}
});

// set static folder
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

// view engine
app.engine('ejs', engine);
app.set('view engine', 'ejs')

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// express session
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);


app.listen(3000, function(err){
	if (err) throw err;

	console.log("Server is running on port: " + secret.port);
});