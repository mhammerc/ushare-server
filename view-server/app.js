'use strict';

let View = require('./view.js');

function app()
{
    Express.get('/:id', function(req, res)
    {
       View(req.params.id, req, res);
    });
    
    Express.use('/static', ExpressRoot.static('static'));
    
    let server = Express.listen(process.env.PORT, process.env.IP, function()
    {
        console.log('Server started!');
    });
}

module.exports = app;