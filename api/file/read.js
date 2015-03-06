var path = require('path');

var resolver = require('../../resolver');

/* Router function */
function read(req, res)
{
    var shortName = req.params.id;

    var db = resolver.resolve('db');
    var collection = db.collection('files');

    collection.findOne(
    {
        shortName: shortName
    }, function(err, document)
    {
        if (err)
        {
            res.status(500).send('An error occurred');
        }

        var filepath = path.resolve(fileDest + document.name);
        res.sendFile(filepath);
        addOneViewToFile(document._id);
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

