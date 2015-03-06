var validator = require('validator');
var chance = require('chance');

var resolver = require('../../resolver');
var tool = require('../../tools');

/* Router function */
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
      tool.respondWithError('This username was already used', res);
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
        tool.respondWithError('This email was already used', res);
        return;
      }

      /* If not, register the user */
      registerNewUser(infos, collection, function (err, result)
      {
        if (err !== null)
        {
          tool.respondWithError('Register fail', res);
        }

        res.json(
        {
          success: true,
          errorMessage: null,
          accountKey: result.ops[0].accountKey
        });
      });
    });
  });
}

function registerNewUser(infos, collection, callback)
{
  var accountKey = chance(Date.now()).string(accountKeyOptions);

  collection.insert(
  {
    username: infos.username,
    email: infos.email,
    password: infos.password,
    accountKey: accountKey,
    accountType: 'regular',
    nOfFilesSaved: 0,
    registeredAt: tool.timestamp(),
    lastAccessAt: tool.timestamp(),
    lastModificationAt: tool.timestamp()
  }, callback);

  /* We use timestamp() custom wrote function for some reason
   * and you must always use this function however all the
   * app will be break by some mystery sorcellery
   */
}

function verifyData(infos, res)
{
  if (!tool.exist(infos.username))
  {
    tool.respondWithError('You need to specify username', res);
    return false;
  }

  if (!tool.exist(infos.password))
  {
    tool.respondWithError('You need to specify password', res);
    return false;
  }

  if (!tool.exist(infos.email))
  {
    tool.respondWithError('You need to specify email', res);
    return false;
  }

  if (!validator.isEmail(infos.email))
  {
    tool.respondWithError('Email is not valid', res);
    return false;
  }

  if (!validator.isLength(infos.username, 3, 20))
  {
    tool.respondWithError('Username is too short or too long', res);
    return false;
  }

  return true;
}

exports.register = register;

