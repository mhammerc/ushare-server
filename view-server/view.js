'use strict';

let File = require('./models/file.js');

function view(shortName, req, res)
{
    File.findOne({ shortName }, function(err, document)
    {
       if(!document)
       {
           res.send('There is no files here');
           return;
       }
       
       let url = Config.url.apiServer + document.shortName;
       let mimetype = document.mimetype.substring(0, document.mimetype.indexOf('/'));
       let size = humanFileSize(document.size, true);
       
       if(mimetype === 'image')
       {
            res.send(Templates.image({ url }));
            return;
       }
       else if(mimetype === 'video')
       {
           res.send(Templates.video({ url, name: document.originalFileName, size, mimetype: document.mimetype}));
           return;
       }
       else if(mimetype === 'audio')
       {
           res.send(Templates.audio({ url, name: document.originalFileName, size, mimetype: document.mimetype }));
           return;
       }
       else if(document.mimetype === 'application/pdf')
       {
           res.send(Templates.document({ url, name: document.originalFileName, size}));
           return;
       }
       else
       {
           res.send(Templates.download({ url, name: document.originalFileName,  size}));
           return;
       }
    });
}

function humanFileSize(bytes, si)
{
    var thresh = si ? 1000 : 1024;
    
    if(Math.abs(bytes) < thresh) 
    {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    
    var u = -1;
    
    do 
    {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    
    return bytes.toFixed(1)+' '+units[u];
}

module.exports = view;