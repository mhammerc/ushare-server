# The API
## Errors

While using an API it's usual to get errors from it. Here, all errors from our
API are described in the right way. They are sorted by HTTP status code.

Common message errors are reported below the description.

### 400 Bad request
The common error with this status code is that you made a mistake with your
request. Maybe your forget some parameters or you're passing wrong parameters.
Follow carefully the API documentation!

    You must follow the API. See docs for more informations.
    The file provided does not exist.
    
### 403 Forbidden
This error mean that your credentials are wrong.

    Your credentials are not right.
    You've no rights on this file.
    You are already registered.
    
### 500 Internal server error
That's probably an error from us, don't care we're working on it!
If you get this error, please warn us, that can be useful.

    Internal error.