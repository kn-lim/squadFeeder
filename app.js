// MODULE DEPENDENCIES
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

// SET UP ROUTE VARIABLES (pages)
var index = require('./routes/index');

// all environments
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Control routes here
// EXAMPLE: app.get('/project.html', project.view)
// 			will route project.view (which is project.handlebars)
//			to <address>/project.html
app.get('/', index.view);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
