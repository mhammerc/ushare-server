var path = require('path');

var auth = require('../user/auth/connect_auth');

var resolver = require('../../resolver');

var tools = require('../../tools.js');

/* Controller */
/* This is a special controller, it not return JSON but a file.
 * In this way, we take the third argument, it is bad to use it else.
 * The callback will never be called.
 */
function read(req, callback, res)
{
    var shortName = req.params.id;

    var db = resolver.resolve('db');
    var collection = db.collection('files');

    collection.findOne(
    {
        shortName: shortName
    }, function (err, document)
    {
        if (err != null)
        {
            res.status(500).send('Internal error');
            return;
        }

        if (document == null)
        {
            res.status(404).send('Document not found');
            return;
        }

        var filepath = path.resolve(fileDest + document.name);

        res.sendFile(filepath);

        addOneViewToFile(document._id);

        addOneViewToUser(document.author);
    });
}

function addOneViewToUser(_id)
{
    var db = resolver.resolve('db');
    var collection = db.collection('users');

    collection.update(
    {
        _id: _id
    },
    {
        $inc:
        {
            nOfViews: 1
        }
    });
}

function addOneViewToFile(_id)
{
    var db = resolver.resolve('db');
    var collection = db.collection('files');

    collection.update(
    {
        _id: _id
    },
    {
        $inc:
        {
            views: 1
        }
    });
}

exports.read = read;

