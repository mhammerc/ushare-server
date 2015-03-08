var userAPI = require('./api/user');

function WSHandler(ws, req, msg)
{
    var path = msg.path;

    var callback = function (err, result)
    {
        ws.send(result);
    }

    if (path === '/user/info')
    {
        userAPI.getInfos(msg, callback);
    }
    else if (path === '/user/uploads')
    {
        userAPI.getUploads(msg, callback);
    }
}

exports.WSHandler = WSHandler;

