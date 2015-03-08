var auth = require('./auth/connect_auth.js');

var tools = require('../../tools.js');
var resolver = require('../../resolver.js')

/* Controller */
function getUploads(req, res)
{
    var credentials = {}
    credentials.accountKey = req.accountKey
    credentials.privateKey = req.privateKey

    auth.getUserFromAuth(credentials, function (err, user)
    {
        if (err != null)
        {
            res(true, tools.error(551, 'Check your credentials'));
            return;
        }

        if (user === null)
        {
            res(true, tools.error(551, 'Check your credentials'));
            return;
        }

        var db = resolver.resolve('db');
        var files = db.collection('files');

        files.find(
        {
            author: user
        },
        {
            fields:
            {
                _id: 0,
                shortName: 1,
                originalName: 1,
                size: 1,
                mimetype: 1,
                extension: 1,
                views: 1,
                password: 1,
                receivedAt: 1
            }
        }).toArray(function (err, docs)
        {
            var response = {};
            response.nOfFiles = docs.length;
            response.files = docs;

            res(null, tools.otj(response));
        });

    });
}

exports.getUploads = getUploads;

