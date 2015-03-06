var chance = require('chance');

var auth = require('../user/auth/connect_auth');

var resolver = require('../../resolver');
var tool = require('../../tools');

/* Router function */
function upload(req, res)
{
    var file = req.files.file;
    var credentials = req.body;

    if (typeof file === 'undefined')
    {
        res.status(500).send(
        {
            error: 'There is no files here'
        });
        return;
    }

    auth.getUserFromAuth(credentials, function (err, author)
    {
        insertNewFile(file, author, function (err, result)
        {
            /* TODO : manage errors */
            res.send(baseUrl + result.ops[0].shortName)
        });
    });

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
        receivedAt: tool.timestamp(),
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

