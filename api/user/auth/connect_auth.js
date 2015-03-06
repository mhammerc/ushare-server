var resolver = require('../../../resolver');
var tool = require('../../../tools');

/* callback(err, _id) -> _id is undefined if there is no user like this or if there is no credentials */
function getUserFromAuth(credentials, callback)
{
    if (!tool.exist(credentials.accountKey) && !tool.exist(credentials.privateKey))
    {
        callback(null, undefined);
        return;
    }

    var db = resolver.resolve('db');
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

        callback(null, doc.userId);
    });
}

exports.getUserFromAuth = getUserFromAuth;

