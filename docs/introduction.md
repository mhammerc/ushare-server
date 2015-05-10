# How is architectured the server ?

Ths server work on modules. Every part of the server is named and grouped inside a folder in 
`modules/`.

**files** is the module who handle files managements.

**stats** is the module who store and update stats.

**users** is the module who handle users and user security.

**events_logs** is the module who handle the logging system.

These module works together.

We use Mongoose to manipulate MongoDB.