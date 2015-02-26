# wordnet-sqlite
A node package exposing an SQLite database of the Princeton University WordNet database

##API
On requiring the module, an instance of an [sqlite3](https://github.com/mapbox/node-sqlite3) client is created and
connected to the local WordNet database. This client is then returned, and can be used according to the
[sqlite3 API](https://github.com/mapbox/node-sqlite3/wiki/API#databaseclosecallback)
(the returned object is an instance of *Database*, so methods like #run and #foreach can be called directly from it