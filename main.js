var app = require('./app');

/* We need to write two configuration system :
 * - One for hard data like database url and database password
 * - Second for variable data like the lenght of short url
 * In waiting this, we define everything as global variable for the moment
 */

/* Url to connect to mongo */
mongoUrl = 'mongodb://localhost:27017/usquare-server'

/* random options for shortname */
fileOptions = {
  length: 5,
  pool: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN123456789'
    /* characters authorized inside the shorts url */
}

accountKeyOptions = {
  length: 20,
  pool: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN123456789'
    /* characters authorized inside the shorts url */
}

/* Where file will be saved (relative to main.js) */
fileDest = './uploads/';

/* Uploads limits */
fileLimits = {
  fileSize: 50000000,
  files: 1
};

/* Base url of the app */
baseUrl = 'http://localhost:3000/';

app.start();

