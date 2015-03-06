fileAPI = require('./api/file');
userAPI = require('./api/user')

/* Create the routes 
 * Arguments : app -> the express variable app (express())
 */
function create(app)
{
  app.get('/:id', fileAPI.read);
  app.post('/file/upload', fileAPI.upload);

  app.post('/user/register', userAPI.register)
  app.post('/user/auth', userAPI.auth);
}

exports.create = create;

