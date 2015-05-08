'use strict';

/* This add JSON auto-responses to the websocket handler. It add ws.json(), sendError and Success.*/
function setUpJsonResponses(ws)
{
	ws.json = function(msg)
	{
		try
		{
			ws.send(JSON.stringify(msg));
		} catch(e) {
			ws.send('An error occurred.');
		}
	}

	ws.sendError = function(error)
	{
		ws.json({success:false, message:error});
		return ws;
	}

	ws.sendSuccess = function(message)
	{
		ws.json({success:true, message});
		return ws;
	}

	/* It has effects on HTTP response but it is useless with websockets */
	ws.status = function()
	{
		return ws;
	}
}

function parseIncomingMessage(msg)
{
	try
	{
		msg = JSON.parse(msg);
		return msg;
	} catch(e) {
		msg = false;
		return msg;
	}
}

module.exports = { setUpJsonResponses, parseIncomingMessage };