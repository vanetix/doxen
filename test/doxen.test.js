/**
 * Test dependencies
 */

var fs = require('fs'),
    doxen = require('../');

/**
 * Simple helper function for reading test cases
 */

function readJson(f, fn) {
  fs.readFile(__dirname + '/fixtures/' + f, function(err, data) {
    if(err) throw err;
    return fn(JSON.parse(data));
  });
}

/**
 * Expose tests to mocha
 */

module.exports = {
  'test base case': function(done) {
    readJson('simple.json', function(dox) {
     var s = doxen(dox);
     console.dir(s);

     fs.writeFileSync('./tmp.html', s);

     done();
    });
  },
};
