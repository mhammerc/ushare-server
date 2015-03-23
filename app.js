var express = require('express');
var expressWs = require('express-ws');
var multer = require('multer');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var router = require('./router');
var resolver = require('./resolver');

function start() {
    var app = express();

    /* Install websocket functions */
    expressWs(app);

    app.use(multer({
        dest: Config.fileDest,
        limits: Config.fileLimits,
        rename: function(fieldname, filename, req, res) {
            return filename + '_' + Date.now();
        }
    }));

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    MongoClient.connect(Config.mongoUrl, function(err, db) {
        assert.equal(null, err);

        console.log("Connected to MongoDB".green);

        router.create(app);

        var server = app.listen(Config.basePort, function() {
            var host = server.address().address;
            var port = server.address().port;

            console.log('App listening at http://%s:%s'.green, host, port)
        });

        resolver.register('express', express);
        resolver.register('app', app);
        resolver.register('server', server);

        resolver.register('db', db);
    });
}

exports.start = start;
