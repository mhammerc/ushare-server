var chance = require('chance');

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

    getUserFromAuth(credentials, res, function (err, author)
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
    var collection = db.collection('files');

    var shortName = chance(Date.now()).string(fileOptions);

    collection.insert(
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
    });
}

/* callback(err, _id) -> _id is undefined if there is no user like this or if there is no credentials*/
function getUserFromAuth(credentials, res, callback)
{
    if (!tool.exist(credentials.accountKey) && !tool.exist(credentials.privateKey))
    {
        callback(null, undefined);
        return;
    }

    var db = resolver.resolve('db');
    //var users = db.collection('users');
    var auth = db.collection('usersAuth');

    var accountKey = credentials.accountKey;
    var privateKey = credentials.privateKey;

    auth.findOne(
    {
        accountKey: accountKey,
        privateKey: privateKey
    }, function (err, doc)
    {
        if (err != null)
        {
            callback(true, undefined);
            return;
        }
        if (doc === null)
        {
            callback(null, undefined);
            return;
        }

        callback(null, doc._id);
    });
}


exports.upload = upload;

