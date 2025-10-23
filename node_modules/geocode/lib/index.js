
var mapquest = require('./mapquest')
var _ = require('underscore')

var geocodeCaching = function(cache, places, cb) {
  cache.view('main/places', {keys: places}, function(err, res) {
    if (err) return cb(err)
    var placesCached = res.map(function(key, value) {
      return {provided: key, resolved: value}
    })
    var placesRemaining = _.difference(places, _.pluck(placesCached, 'provided'))

    var mergeResult = function(resRemaining) {
      var combined = placesCached.concat(resRemaining).sort(function(a, b) {
        return places.indexOf(a.provided) > places.indexOf(b.provided)
      })
      cb(null, combined)
    }

    if (placesRemaining.length) {
      mapquest(placesRemaining, function(err, resRemaining) {
        if (err) return cb(err)
        resRemaining = resRemaining.filter(function(each) {
          return places.indexOf(each.provided) > -1
        })
        if (resRemaining.length == 0) return mergeResult([])
        cache.save({locations: resRemaining}, function() {
          mergeResult(resRemaining)
        })
      })
    } else {
      mergeResult([])
    }
  })
}

var createCache = function(config) {
  var cradle = require('cradle')
  var couchCon = new(cradle.Connection)(config.host, config.port, {cache: false});
  return couchCon.database(config.db)
}

var wrapCachingFn = function(config) {
  var cache = createCache(config)
  var init = config.init

  var callFn = function(places, cb) {
    var job = function() { geocodeCaching(cache, places, cb) }
    // init couchdb views on first call:
    if (init) {
      init = false
      require('./init-cache')(cache, job)
    } else {
      job()
    }    
  }
  callFn.destroyCache = function(cb) { cache.destroy(cb) }
  callFn.middleware = function() { return middleware(callFn) }

  return callFn
}

var call = function(opts) {
  opts = opts || {}
  if (!opts.cache) {
    return mapquest
  } else {
    return wrapCachingFn(opts.cache)
  }
}

var middleware = function(callFn) {
  return function(req, res, next) {
    var places = req.param('places')
    callFn(places, function(err, result) {
      if (err) return res.status(500).send({error: err})
      res.send({places: result})
    })
  }
}

module.exports = call
