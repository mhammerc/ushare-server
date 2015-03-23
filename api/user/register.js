var validator = require('validator');
var chance = require('chance');

var resolver = require('../../resolver');
var tools = require('../../tools');

/* Controller */
function register(req, res)
{
    var infos = req.body;

    if (!verifyData(infos, res))
        return;

    var db = resolver.resolve('db');
    var collection = db.collection('users');

    /* Verify if the username already exist */
    collection.count(
    {
        username: infos.username
    }, function (err, count)
    {
        if (count != 0)
        {
            res(true, tools.error(580, 'This username was already used'));
            return;
        }

        /* If not, verify if the email already exist */
        collection.count(
        {
            email: infos.email
        }, function (err, count)
        {
            if (count != 0)
            {
                res(true, tools.error(581, 'This email was already registered'));
                return;
            }

            /* If not, register the user */
            registerNewUser(infos, collection, function (err, result)
            {
                if (err !== null)
                {
                    res(true, tools.error(550, 'Internal error'));
                }

                var answer = {
                    success: true,
                    errorMessage: null,
                    accountKey: result.ops[0].accountKey
                }

                res(null, tools.otj(answer));
            });
        });
    });
}

function registerNewUser(infos, collection, callback)
{
    var accountKey = chance(Date.now()).string(Config.accountKeyOptions);

    collection.insert(
    {
        username: infos.username,
        email: infos.email,
        password: infos.password,
        accountKey: accountKey,
        accountType: 'regular',
        nOfFilesSaved: 0,
        nOfViews: 0,
        registeredAt: tools.timestamp(),
        lastAccessAt: tools.timestamp(),
        lastModificationAt: tools.timestamp()
    }, callback);

    /* We use timestamp() custom wrote function for some reason
     * and you must always use this function however all the
     * app will be break by some mystery sorcellery
     */
}

function verifyData(infos, res)
{
    if (!tools.exist(infos.username))
    {
        res(true, tools.error(582, 'You need to specify a username'));
        return false;
    }

    if (!tools.exist(infos.password))
    {
        res(true, tools.error(582, 'You need to specify a password'));
        return false;
    }

    if (!tools.exist(infos.email))
    {
        res(true, tools.error(582, 'You need to specify an email'));
        return false;
    }

    if (!validator.isEmail(infos.email))
    {
        res(true, tools.error(582, 'Email is not valid'));
        return false;
    }

    if (!validator.isLength(infos.username, 3, 20))
    {
        res(true, tools.error(582, 'Username is too short or too long'));
        return false;
    }

    return true;
}

exports.register = register;

