var fileAPI = require('./api/file');
var userAPI = require('./api/user');

var h = require('./http.js');
var WSHandler = require('./websockets.js');
var tools = require('./tools.js');

/* Create the routes 
 * Arguments : app -> the express variable app (express())
 */
function create(app)
{
    createHTTPRoutes(app);
    createWebSocketsRoutes(app);
}

/* Create HTTP classic routes */
function createHTTPRoutes(app)
{
    app.get('/:id', function (req, res)
    {
        h.HTTPHandler(fileAPI.read, req, res);
    });

    app.post('/file/upload', function (req, res)
    {
        h.HTTPHandler(fileAPI.upload, req, res);
    });


    app.post('/user/register', function (req, res)
    {
        h.HTTPHandler(userAPI.register, req, res);
    })

    app.post('/user/auth', function (req, res)
    {
        h.HTTPHandler(userAPI.auth, req, res);
    });

    app.get('/user/info', function (req, res)
    {
        var data = {}
        data.accountKey = req.headers.accountkey;
        data.privateKey = req.headers.privatekey;

        h.HTTPHandler(userAPI.getInfos, data, res);
    });

    app.get('/user/uploads', function (req, res)
    {
        var data = {}
        data.accountKey = req.headers.accountkey;
        data.privateKey = req.headers.privatekey;

        h.HTTPHandler(userAPI.getUploads, data, res);
    })
}

function createWebSocketsRoutes(app)
{
    app.ws('/', function (ws, req)
    {
        ws.on('message', function (msg)
        {
            onMessage(ws, req, msg);
        });
    });
}

/* Inside this scope we have : ws -> the socket | req -> express req
 * and for sure the msg who contain the msg
 */
var onMessage = function (ws, req, msg)
{
    try
    {
        msg = JSON.parse(msg);
    }
    catch (e)
    {
        ws.send(tools.error(551, 'Can\'t understand query : ' + e));
        return;
    }

    if (!tools.exist(msg.path))
    {
        ws.send(tools.error(552, 'This request don\'t follow the API. See the doc for more informations'));
        return;
    }

    /* The request is valid so let's give it to the WS handler */
    WSHandler.WSHandler(ws, req, msg);
}

exports.create = create;

