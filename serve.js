var express = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var path = require('path');
var cors = require('cors');
var app = express();
var connect_mongo = require('./db/index');
var fileUpload = require('express-fileupload');
var config = require('./config');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var socket = require('./socket/socket');
socket(io);

app.use(fileUpload());

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/static', express.static('./public/avatar'));
app.use('/static', express.static('./public/pdf'));
app.use('/static', express.static('./public/text'));
app.use(config.BASE_URL + '/user', require('./routes/user.route')());
app.use(config.BASE_URL + '/auth', require('./routes/auth.route')());

server.listen(process.env.PORT || config.PORT);
// console.log('SERVER_IS_LISTENING_ON_PORT: ' + process.env.HOST + ':' + process.env.PORT );
console.log('SERVER_IS_LISTENING_ON_PORT: ' + process.env.PORT );
