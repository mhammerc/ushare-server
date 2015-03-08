var chance = require('chance');

var resolver = require('../../../resolver');
var tools = require('../../../tools');

/* Controller */
function createAuth(req, res)
{
    var db = resolver.resolve('db');
    var users = db.collection('users');
    var auth = db.collection('usersAuth');

    var credentials = req.body;

    users.findOne(
    {
        username: credentials.username,
        password: credentials.password
    }, function (err, doc)
    {
        if (err != null)
        {
            res(true, tools.error(550, 'Internal error'));
            return;
        }

        if (doc === null)
        {
            res(true, tools.error(550, 'Internal error'));
            return;
        }

        var privateKey = chance(Date.now()).string(accountKeyOptions);

        auth.insert(
        {
            userId: doc._id,
            accountKey: doc.accountKey,
            privateKey: privateKey,
            createdAt: tools.timestamp(),
            lastAccessAt: tools.timestamp()
        }, function (err, result)
        {
            if (err != null)
            {
                res(true, tools.error(550, 'Internal error'));
                return;
            }

            var object = {
                success: true,
                accountKey: doc.accountKey,
                privateKey: privateKey
            };

            res(null, tools.otj(object));

        }); /* auth.insert() */
    }); /* users.findOne() */
}

exports.createAuth = createAuth;

