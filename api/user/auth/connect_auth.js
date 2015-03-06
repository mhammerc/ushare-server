var resolver = require('../../../resolver');
var tool = require('../../../tools');

/* This function is used to get the _id of an auth 
 * callback(err, _id) -> _id is undefined if there is no user like this
 * or if there is no credentials
 * the credentials parameter need to be : { accountKey:[string], privateKey:[string] }
 */
function getUserFromAuth(credentials, callback)
{
    if (credentials != null && !tool.exist(credentials.accountKey) && !tool.exist(credentials.privateKey))
    {
        callback(null, null);
        return;
    }

    var db = resolver.resolve('db');
    var auth = db.collection('usersAuth');
    var user = db.collection('users');

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
            callback(true, null);
            return;
        }
        if (doc === null)
        {
            callback(null, null);
            return;
        }

        callback(null, doc.userId);

        user.update(
        {
            _id: doc.userId
        },
        {
            $set:
            {
                lastAccessAt: tool.timestamp()
            }
        });

    });
}

exports.getUserFromAuth = getUserFromAuth;

