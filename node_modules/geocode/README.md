#geocoder
Node.js client for mapquest's [Open Geocoding Service](http://open.mapquestapi.com/geocoding/).  
It supports caching of results in CouchDB.

##Examples
``` js
var geocode = require('../lib/index')()

var places = ['New York', 'Heidelberg', 'Tokio', 'Cape Town']
geocode(places, function(err, res) {
  // outputs geocoded result
})
```

To enable caching of results in CouchDB:

``` js
var cacheConfig = {host: 'http://127.0.0.1', port: 5984, db: 'geocode_test', init: true}
var geocode = require('../lib/index')({cache: cacheConfig})

geocode(places, function(err, res) { ... })
```