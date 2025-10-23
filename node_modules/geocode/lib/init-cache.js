
var async = require('async')

var designDoc = {
  views: {
    places: {
      map: function(doc) {
        if (doc.locations) {
          doc.locations.forEach(function(each) {
            emit(each.provided, each.resolved)
          })
        }
      }
    }
  }
}

var setup = function(db, cb) {
  var fetchDoc = function(cb) { db.get('_design/main', function() { cb() }) }
  var createDB = function(cb) { db.create(function() { cb() }) }
  var updateDoc = function(cb) { db.save('_design/main', designDoc, cb) }

  async.series([createDB, fetchDoc, updateDoc], cb)
}

module.exports = setup