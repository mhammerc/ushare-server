var chance = require('chance');

var resolver = require('../../../resolver');
var tool = require('../../../tools');

/* Router function */
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
      tool.respondWithError('Internal error', res);
      return;
    }

    if (doc === null)
    {
      tool.respondWithError('Unknown credentials', res);
      return;
    }

    var privateKey = chance(Date.now()).string(accountKeyOptions);

    auth.insert(
    {
      userId: doc._id,
      accountKey: doc.accountKey,
      privateKey: privateKey,
      createdAt: tool.timestamp(),
      lastAccessAt: tool.timestamp()
    }, function (err, result)
    {
      if (err != null)
      {
        tool.respondWithError('Error on creating the auth', res);
        return;
      }
      console.log(result);

      res.json(
      {
        success: true,
        accountKey: doc.accountKey,
        privateKey: privateKey
      });
    });

  });
}

exports.createAuth = createAuth;

