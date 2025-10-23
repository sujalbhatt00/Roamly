
var assert = require('assert')
var cacheConfig = {host: 'http://127.0.0.1', port: 5984, db: 'geocode_test', init: true}
var geocode = require('../lib/index')({cache: cacheConfig})
var req = require('superagent')

var places = ['New York', 'Heidelberg', 'Tokio', 'Cape Town', 'München']
var testResult = function(result, expected) {
  result.forEach(function(each, i) {
    assert.equal(each.provided, expected[i])
  })
}

after(function(done) { geocode.destroyCache(done) })

describe('geocode', function() {
  it('should test geocoding without cache', function(done) {
    var geocode = require('../lib/index')()
    geocode(places, function(err, res) {
      console.log(res)
      testResult(res, places)
      done()
    })
  })
  it('should batch lookup multiple locations', function(done) {
    geocode(places, function(err, res) {
      testResult(res, places)
      done()
    })
  })
  it('should lookup a second time to invoke cache', function(done) {
    var newPlaces = places.concat(['Berlin', 'Munich'])
    geocode(newPlaces, function(err, res) {
      testResult(res, newPlaces)
      done()
    })
  })
})

describe('geocode middleware', function() {
  var express = require('express')
  var app = express()
  app.use(express.bodyParser())
  app.use(geocode.middleware())
  app.listen(3000)

  it('should test the middleware', function(done) {
    req
      .post('localhost:3000/geocode')
      .send({places: places})
      .end(function(res) {
        testResult(res.body.places, places)
        done()
      })
  })
})
