
var async = require('async')
var http = require('http')

var limit = 1

var filterLocation = function(data) {
  return {
    adminArea1: data.adminArea1,
    adminArea3: data.adminArea3,
    adminArea4: data.adminArea4,
    adminArea5: data.adminArea5,
    lat: data.latLng.lat,
    lng: data.latLng.lng
  }
}

var normalize = function(result) {
  return result.map(function(each) {
    var filteredLocations = each.locations.map(filterLocation)
    return {resolved: filteredLocations, provided: each.providedLocation.street}
  })
}

var fetchBatch = function(places, cb) {
  var json = {
    locations: places.map(function(each) { return {street: each} }),
    options: {
      thumbMaps: false
    }
  }

  var options = {
    hostname: 'open.mapquestapi.com',
    port: 80,
    path: '/geocoding/v1/batch',
    method: 'POST'
  }

  var req = http.request(options, function(res) {
    res.setEncoding('utf8')
    var data = ''
    res.on('data', function (chunk) {
      data += chunk
    })
    res.on('end', function() {
      var jsonRes = JSON.parse(data)
      cb(null, normalize(jsonRes.results))
    })
  })

  req.setHeader("content-type", "application/json;charset=UTF-8")

  req.on('error', function(err) {
    cb(err)
  })

  req.write(JSON.stringify(json))
  req.end()
}

var geocode = function(places, cb) {
  var queue = async.queue(fetchBatch, 100)
  var result = []
  places.forEach(function(place) {
    queue.push([[place]], function(err, eachResult) {
      if (err) return cb(err)
      result = result.concat(eachResult)
    })
  })
  queue.drain = function() {
    result.sort(function(a, b) { return places.indexOf(a.provided) > places.indexOf(b.provided) })
    cb(null, result)
  }
}

module.exports = geocode