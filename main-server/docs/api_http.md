# The API
## HTTP

The HTTP API is the main part of our API.

Every parameters in a POST request must be in a form. In a GET request, *accountkey* and 
*privatekey* will be in headers.

Every responses from the API will be as JSON except `GET /:id`.

### A note about security

The API will be used often, by the main app or by third-party software. Imagine what happen if at 
every API call you need to send your *username* and your *password*. If someone listen your 
connection, he know who you are and has your password. That's a problem.

That's why we created the *accountkey* and the *privatekey*. You need to login only once, then
the API give you two keys. Next time you need to proof your identity, you only need to send these
keys. And if someone listen your connection and imitate you, you just need to revoke the privatekey
and create new one. Get warned, these keys grant full access to your account!

An *accountkey* represent the user. Every users have one and only one unique accountkey. With it, 
we recognize you.

An *privatekey* is unique to each authentification. It's similar to a password but unmodifiable,
revokable and a *privatekey* can be created when you want, unlimited times. So, never forget to
revoke your privatekey when you stop to use it.

That's sound good, but it remain one problem. When we get our *privatekey*, we need to send a
*username* and a *password* to proof our identity the first time ! The password is still sent.
That's why you need to sent it has SHA-256. That's easy : take the original password, encrypt it
as SHA-256 then send it to the auth API. If your credentials are right, you receive your keys,
save them and you never need to resend the password !

Note that is only right for HTTP API. The WebSockets API work differently.

### How to read this documentation

Each routes of the API is described here. A short description is provided. The *request* section 
explain what informations your request need to have. If the API route return datas, an *response* 
section will explain what data the API return. Else, the API will return this :

    {
    	"success": Boolean
    	"message": String
    }

Just replace `Boolean` by *true* or *false* and `String` by a human-readable message.

### API routes

#### GET /:id

Search for a file `:id` then return it to the client. Note that `:id` is the shortname of a file.

#### POST /file/upload

This route permit you to save a file inside uShare.

accountkey and privatekey are optionnal. If you don't provide them, your file will be anonymous.

*Request :*
  - accountkey *[optionnal]* : your accountkey
  - privatekey *[optionnal]* : your privatekey
  - file : the file by itself
  - source : the name of the app who is sending the request

#### POST /file/password/edit

This route permit you to edit the password of a file.

*Request :*
  - accountkey
  - privatekey
  - shortname : id of the file (in the url)
  - password : new password (if empty, password will be deleted)
  - source

#### POST /file/delete

This route permit you to delete a file previously uploaded inside uShare.

*Request :*
  - accountkey
  - privatekey
  - shortname : The shortname of the file. Same as `:id` in the first route (ex: http://ushare.so/xyz 
  : here, the short name is xyz).
  - source

#### POST /user/register

This route permit you to register inside uShare. Note that you can register from the web panel.

*Request :*
  - username : your username
  - email : your email
  - password : your password encrypted as SHA-256
  - source

#### POST /user/auth

This route permit you to get your accountkey and a new privatekey.

*Request :*
  - username
  - password : your password encrypted as SHA-256
  - source

*Response :*

    {
    	"success": Boolean,
    	"accountkey": String,
    	"privatekey": String
    }

#### POST /user/revoke/auth

This route permit you to revoke privatekey previously generated.

*Request :*
  - accountkey
  - privatekey
  - source

#### GET /user/info
*Available in websockets API*

This route permit you to get informations about the user provided by accountkey and privatekey.

*Request :*
  - accountkey : your accountkey got from /user/auth
  - privatekey : your privatekey got from /user/auth
  - source

*Response :*
    
    {
      "success": true,
    	"username": String,
    	"email": String,
    	"accountType": String,
    	"numberOfFilesSaved": Number,
    	"numberOfViews": Number,
      "numberOfFilesSavedToday": Number
	}

Fields are self-explained. Just note that accountType will be *regular*, *premium* or *vip*.

#### GET /user/uploads

This route permit you to get a detailed list of files sended by a the user provided by accountkey
and privatekey. More recent file is first in the array. The maximum limit is 500.

*Request :*
  - accountkey
  - privatekey
  - limit : the limit of file you want to get
  - source

*Response :*

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
    	    	"password": String
    	    }, ..
    	]
    }

Note that *name* is the original file name. *Views* is the number of time the file has been viewed 
and *date* store when the file has been received. *Size* is the number of bytes the file is. *Link* 
is the link to view the file btw *silentLink* is a link to view the file without incrementing view 
counter.