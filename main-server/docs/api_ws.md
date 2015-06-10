# The API
## WebSockets

The WebSockets API was thought and created in order to get realtime data faster and easier.

In fact, you just need to connect to the websocket channel, to get authenticated and everytime you
ask informations, the API will answer back the data you asked.

Every message you will send to the API must be JSON and in this format :

    {
    	"path": String
    }

Where path is the route you ask. Maybe more information will be required.

### How it work
First, you need to get connected. That's easy (address not available here).

Then you need to auth with `/user/auth` (see below) and finally you have access to every routes.

### Routes

#### /user/auth

This route need to be called first. It permit you to get authenticated.
This is the message you need to send :

    {
    	"path": "/user/auth",
    	"username": ?,
    	"password": ?,
    	"source": ?
    }

And replace every `?` by correct values. Note that you must encrypt the original password as SHA-512
before sending it though the websocket. If it success, you will receive `{ "success": true }` and
you will have access to others routes.

#### /user/info

This route send you information about you. This is the message you need to send :

    {
    	"path": "/user/info"
    }

And you will receive something like this :

    {
        "success": true,
    	"username": String,
    	"email": String,
    	"accountType": String,
    	"numberOfFilesSaved": Number,
    	"numberOfViews": Number,
        "numberOfFilesSavedToday": Number
    }

Fields are self-explained. Just note that `accountType` will be *regular*, *premium* or *vip*.
`numberOfViews` is the number of time every files who the user own has been viewed.

#### /user/uploads

This route send you details about your uploads. You need to send this :

    {
    	"path": "/user/uploads",
    	"limit": Number
    }

Replace `Number` by the number of files details you want (max limit is 500). You will receive back
this :

    {
        "success": true,
    	"numberOfFiles": Number,
    	"files": 
    	[
    		{
    			"link": String,
                "silentLink": String,
                "shortname": String,
    			"name": String,
    			"size": Number,
    			"mimetype": String,
    			"views": Number,
    			"date": Date,
    			"password", String
    		}, ..
    	]
    }

Fields are self-explained. Just note that `name` is the original file name, `date` is the date when
the file was received, `views` is the number of views of the file and `size` is the number of bytes
of the file. *Link* is the link to view the file btw *silentLink* is a link to view the file 
without incrementing the view counter.