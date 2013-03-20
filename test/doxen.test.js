/**
 * Test dependencies
 */

var fs = require('fs'),
    Doxen = require('../');

/**
 * Case function to execute a case
 * - invokes callback with `case`, `expected`
 *
 * @param {String} f
 * @param {Function} fn
 */

function readCase(f, fn) {
  fs.readFile(__dirname + '/fixtures/' + f + '.json', function(err, c) {
    if(err) throw err;
    fs.readFile(__dirname + '/expected/' + f + '.html', function(err, e) {
      if(err) throw err;
      return fn(c.toString('utf8'), e.toString('utf8'));
    });
  });
}

/**
 * Expose tests to mocha
 */

module.exports = {
  'test base case': function(done) {
    var actual;

    readCase('simple', function(c, expected) {
      actual = Doxen(JSON.parse(c));
      actual.should.equal(expected);
      done();
    });
  },

  'test full render case': function(done) {
    var actual;

    readCase('render', function(c, expected) {
      actual = Doxen.render(JSON.parse(c));
      actual.should.equal(expected);
      done();
    });
  }
};
