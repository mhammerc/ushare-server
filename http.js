/* All function who are qualified as 'Controller' must call the callback
 * with the following parameters : callback(err, res).
 * err define the HTTP code. res is sended to the client.
 * Controller get these parameters : controller(req, callback).
 */

/* The controller is the logic of a route */

var tools = require('./tools.js');

function HTTPHandler(controller, req, res)
{
    var callback = function (err, result)
    {
        if (err !== null && err)
        {
            result.success = false;
            res.status(401);
        }

        if (!tools.exist(result.success))
        {
            result.success = true;
        }

        res.send(result);
    }

    controller(req, callback, res);
}

exports.HTTPHandler = HTTPHandler

