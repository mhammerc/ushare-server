var auth = require('./auth/connect_auth.js');

var tools = require('../../tools.js');
var resolver = require('../../resolver.js')

/* Controller */
function getInfos(req, res)
{
    var credentials = {}
    credentials.accountKey = req.accountKey
    credentials.privateKey = req.privateKey

    auth.getUserFromAuth(credentials, function (err, user)
    {
        if (err != null)
        {
            res(true, tools.error(551, 'Check your credentials'));
            return;
        }

        if (user === null)
        {
            res(true, tools.error(551, 'Check your credentials'));
            return;
        }

        var db = resolver.resolve('db');
        var users = db.collection('users');

        users.findOne(
        {
            _id: user
        }, function (err, doc)
        {

            if (err != null)
            {
                res(true, tools.error(550, 'Check your credentials'));
                return;
            }

            var response = {};
            response.username = doc.username;
            response.email = doc.email;
            response.accountType = doc.accountType;
            response.nOfFilesSaved = doc.nOfFilesSaved;
            response.nOfViews = doc.nOfViews;

            res(null, tools.otj(response));
        });
    });

}

exports.getInfos = getInfos;

