var auth = require('./auth/connect_auth.js');

var tools = require('../../tools.js');
var resolver = require('../../resolver.js')

/* Router function */
function getUploads(req, res)
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
    var files = db.collection('files');

    files.find(
    {
      author: user
    },
    {
      fields:
      {
        _id: 0,
        shortName: 1,
        originalName: 1,
        size: 1,
        mimetype: 1,
        extension: 1,
        views: 1,
        password: 1,
        receivedAt: 1
      }
    }).toArray(function (err, docs)
    {
      var response = {};
      response.nOfFiles = docs.length;
      response.files = docs;

      res.json(response);
    });

  });
}

exports.getUploads = getUploads;

