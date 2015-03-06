var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var router = require('./router')
var resolver = require('./resolver');

function start()
{
    var app = express();

    app.use(multer(
    {
        dest: fileDest,
        limits: fileLimits,
        rename: function (fieldname, filename, req, res)
        {
            return filename + '_' + Date.now();
        }
    }));

    MongoClient.connect(mongoUrl, function (err, db)
    {
        assert.equal(null, err);

        console.log("Connected to MongoDB");

        resolver.register('db', db);
    });

    router.create(app);

    var server = app.listen(3000, function ()
    {
        var host = server.address().address
        var port = server.address().port

        console.log('App listening at http://%s:%s', host, port)
    });

    resolver.register('express', express);
    resolver.register('app', app);
    resolver.register('server', server);
}

exports.start = start;

