colors = require('colors');
var app = require('./app');
Config = null;

/* We get configuration from config file */
try
{
    Config = require('./config.json');
} catch(e) {
    try
    {
        Config = require('./config.default.json')
    } catch(e) {
        console.log('You need at least config.json or config.default.json to get the app work.'.red);
        process.exit();
    }
}

/* We need to write two configuration system :
 * - One for hard data like database url and database password
 * - Second for variable data like the length of short url
 * In waiting this, we define everything as global variable for the moment
 */

app.start();

