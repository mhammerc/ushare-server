var chance = require('chance');

var auth = require('../user/auth/connect_auth');

var resolver = require('../../resolver');
var tools = require('../../tools');

/* Controller */
function upload(req, res)
{
    console.log('entered');
    var file = req.files.file;
    var credentials = req.body;

    if (!tools.exist(file))
    {
        res(true, tools.error(561, 'There is no files inside the request'));
        return;
    }

    var callback = function (err, result)
    {
        if (err != null)
        {
            res(true, tools.error(550, 'An error occurred'));
            return;
        }

        res(null, baseUrl + result.ops[0].shortName);
        console.log('File saved, link : ' + baseUrl + result.ops[0].shortName);
    };

    if (tools.exist(req.body.accountKey))
    {
        auth.getUserFromAuth(credentials, function (err, author)
        {
            if (err != null)
            {
                res(true, tools.error(551, 'Check your credentials'));
                return;
            }

            insertNewFile(file, author, callback);
        });

        return;
    }

    insertNewFile(file, null, callback);

}

function insertNewFile(file, author, callback)
{
    var db = resolver.resolve('db');
    var files = db.collection('files');
    var users = db.collection('users');

    var shortName = chance(Date.now()).string(fileOptions);

    files.insert(
    {
        shortName: shortName,
        originalName: file.originalname,
        name: file.name,
        encoding: file.encoding,
        mimetype: file.mimetype,
        extension: file.extension,
        size: file.size,
        password: null,
        views: 0,
        receivedAt: tools.timestamp(),
        usquareVersion: undefined,
        author: author
    }, function (err, result)
    {
        if (err != null)
        {
            callback(err, null);
            return;
        }

        callback(null, result);

        if (author == undefined)
            return;

        users.update(
        {
            _id: author
        },
        {
            $inc:
            {
                nOfFilesSaved: 1
            }
        });
    });
}

exports.upload = upload;

