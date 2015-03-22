/* All main API functions are called Controller. They must take as argument
 * req and a callback. Req is the data given from the client and the callback
 * is a function. You must call the callback with these parameters :
 * callback(err, res). Err will change HTTP code. If nothing bad happen you
 * must give null as err. And res is the raw text in order to be transmitted
 * to the client (like JSON string).
 *
 * There is to request handlers : the http handler and the WebSockets handler.
 * they call same API functions and they work same, they are just not called on
 * same events and they do not answer to same protocol.
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
            res.status(401).send(result);
            console.log(result);
            return;
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

