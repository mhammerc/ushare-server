var auth = require('./auth/connect_auth.js');

var tools = require('../../tools.js');
var resolver = require('../../resolver.js')

/* Router function */
function getInfos(req, res)
{
    var credentials = {};
    credentials.accountKey = req.get('accountKey');
    credentials.privateKey = req.get('privateKey');

    auth.getUserFromAuth(credentials, function (err, user)
    {
        if (err != null)
        {
            tools.respondWithError('An error occurred. Check your credentials', res);
            return;
        }

        if (user === null)
        {
            tools.respondWithError('Check your credentials', res);
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
                tools.respondWithError('An error occurred', res);
                return;
            }

            var response = {};
            response.username = doc.username;
            response.email = doc.email;
            response.accountType = doc.accountType;
            response.nOfFilesSaved = doc.nOfFilesSaved;
            response.nOfViews = doc.nOfViews;

            res.json(response);
        });
    });

}

exports.getInfos = getInfos;

