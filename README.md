# wordnet-sqlite
A node package exposing an SQLite database of the Princeton University WordNet database

##Installation
Just run
```javascript
npm install wordnet-sqlite
```

Note that installing the module will install the SQLite3 module as a dependency, which requires compilation using node-gyp,
so a working toolchain is required to install this module.

##API
On requiring the module, an instance of an [sqlite3](https://github.com/mapbox/node-sqlite3) client is created and
connected to the local WordNet database. This client is then returned, and can be used according to the
[sqlite3 API](https://github.com/mapbox/node-sqlite3/wiki/API#databaseclosecallback).The returned object is an instance
of *Database*, so methods like #run and #foreach can be called directly from it.

```javascript
var db = require("wordnet-sqlite");
db.get("SELECT definition FROM words WHERE word = 'pulpy' LIMIT 1;", function (err, row) {
    console.log(row.definition);
});
```
Outputs:

>like a pulp or overripe; not having stiffness

##Example
Here's a bot I wrote to email people random compliments (well actually they're more like insults):
```javascript
var nodemailer = require('nodemailer');
var db = require("wordnet-sqlite");

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '<my.email@address.com>',
        pass: 'mypassword'
    }
});

db.get("SELECT * FROM words WHERE type = 'adj' ORDER BY RANDOM() LIMIT 1;", function (err, row) {
    var mailOptions = {
        from: 'Me <my.email@address.com>',
        to: 'My Victim <victim@victim.com>',
        subject: 'You are ' + row.word,
        text: row.word + ": " + row.definition
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            console.log(error);
        else
            console.log('Message sent: ' + info.response);

        db.close();
    });
});
```

Outputs:
![Mailer Results](http://i.imgur.com/2irUI0x.png)

##Contributions
The GitHub repository contains the raw_dict directory, which contains the data.adj, data.adv, data.noun and data.verb
files from the [WordNet website](http://wordnet.princeton.edu/wordnet/download/current-version/) (version 3.1). If WordNet
is updated, download the new files and replace those in raw_dict, then run the setup.js script to rebuild the database.

Any other contributions are welcome, especially improvements to the database schema itself.