# WordNet SQLite

A node package exposing an SQLite database of the Princeton University WordNet database

## Installation

Just run
```javascript
npm install wordnet-sqlite
```

Note that installing the module will install the SQLite3 module as a dependency, which requires compilation using node-gyp,
so a working toolchain is required to install this module.

## API

On requiring the module, an instance of an [sqlite3](https://github.com/mapbox/node-sqlite3) client is created and
connected to the local WordNet database. This client is then returned, and can be used according to the
[sqlite3 API](https://github.com/mapbox/node-sqlite3/wiki/API#databaseclosecallback).The returned object is an instance
of *Database*, so methods like #run and #foreach can be called directly from it.

Currently the database consists of only one table called `words`, which has the following columns:

* `word`. A `text` field that contains the dictionary word in its most basic form (without a prefix or suffix) i.e.
*child* will appear but not *children*. Note that spaces are replaced with underscores, e.g. *out_of_the_way*.
For further information, have a look at the [WordNet documentation](http://wordnet.princeton.edu/wordnet/)

* `definition`. A `text` field that contains a *gloss*, a string which which may contain a definition, one or more example
 sentences, or both. For example the `definition` field for *implicit* is the string *being without doubt or reserve; "implicit trust"*,
 consisting of a definition and one example sentence.

* `type`. Also a text field that contains a string indicating the type of word this row is. Either "adj", "adv", "noun", or "verb".
Note that types such as conjunctions and interjections are not part of the WordNet project so are not present in the database.

* `rowid`. An `integer` field created automatically by SQLite. Corresponds to the index of the word, so the first entry
has a `rowid` of 1. However the words are in no particular order so this is not likely to be of any use.

Here's a simple example usage of the database. See the [Example](#example) section for another example.

```javascript
var db = require("wordnet-sqlite");
db.get("SELECT definition FROM words WHERE word = 'pulpy' LIMIT 1;", function (err, row) {
    console.log(row.definition);
});
```
Outputs:

>like a pulp or overripe; not having stiffness

## Example

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

## Contributions

The GitHub repository contains the raw_dict directory, which contains the data.adj, data.adv, data.noun and data.verb
files from the [WordNet website](http://wordnet.princeton.edu/wordnet/download/current-version/) (version 3.1). If WordNet
is updated, download the new files and replace those in raw_dict, then run the setup.js script to rebuild the database.

Any other contributions are welcome, especially improvements to the database schema itself.