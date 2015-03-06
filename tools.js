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

/* Send error status and message to client */
function respondWithError(error, res)
{
    res.status(500).json(
    {
        success: false,
        errorMessage: error
    });
}

exports.exist = exist;
exports.timestamp = timestamp;
exports.respondWithError = respondWithError;

