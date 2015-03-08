var resolver = require('../../../resolver');
var tool = require('../../../tools');

/* This function is used to get the user _id from account and private key
 * callback(err, _id) -> _id is undefined if no user was find
 * or if there is no credentials
 * the credentials parameter need to be : { accountKey: String, privateKey: String }
 */
function getUserFromAuth(credentials, callback)
{
    if (credentials != null && !tool.exist(credentials.accountKey) && !tool.exist(credentials.privateKey))
    {
        callback(true, null);
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
            callback(true, null);
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

