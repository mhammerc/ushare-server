/* Return true if the variable exist */
function exist(variable)
{
    return (typeof variable !== 'undefined')
}


/* We divise the date per 1000 because JS give us timestamp as
 * milliseconds and i don't like it i want the timestamp as
 * second because i'm the boss
 */
function timestamp()
{
    return Math.round(Date.now() / 1000);
}


/* This generate error as JSON. Useful to send to clients */
function error(code, string)
{
    var error = {
        success: false,
        error: code,
        errorMessage: string
    };

    return JSON.stringify(error);
}

/* JSON To Object (get JSON string data and return object) */
function jto(json)
{
    var result;

    try
    {
        result = JSON.parse(result);
    }
    catch (e)
    {
        return null;
    }

    return result;
}

/* Object To JSON (get an object and return JSON string) */
function otj(object)
{
    return JSON.stringify(object);
}

exports.exist = exist;
exports.timestamp = timestamp;
exports.error = error;
exports.jto = jto;
exports.otj = otj;

