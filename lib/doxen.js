/**
 * Module dependencies
 */

var fs = require('fs'),
    crypto = require('crypto'),
    Mustache = require('mustache');

/**
 * Global templates
 */

var T = {
  layout: fs.readFileSync(__dirname + '/templates/layout.html'),
  section: fs.readFileSync(__dirname + '/templates/section.html')
};

/**
 * Returns an html representation of dox output `json`
 *
 * @param {String|Object} dox
 * @return {String}
 */

module.exports = function doxen(dox) {
  if(typeof dox !== 'object') {
    try {
      dox = JSON.parse(json);
    } catch(e) {
      return 'Invalid json';
    }
  }

  return render(dox);
};

/**
 * Rendered the given `obj` to the template
 *
 * @param {Object} dox
 * @param {Object} data
 */

function render(dox, data) {
  data = data || {};
  data.title = data.title || 'Doxen';
  data.content = data.content || build(dox);

  return Mustache.to_html(T.layout, data);
}

/**
 * Build docs
 *
 * @param {Object} dox
 * @return {Object}
 */

function build(dox) {
  var i, len,
      html = '';

  for(i = 0, len = dox.length; i < len; i = i + 1) {
    html += block(dox[i]);
  }

  return html;
}

/**
 * Build description
 */

function block(chunk) {
  var data = {
    code: chunk.code,
    title: chunk.ctx.type,
    id: makeId(chunk.code),
    type: chunk.ctx.string,
    description: chunk.description.full,
    params: chunk.tags.filter(function(tag) {
      return tag.type === 'param';
    }).map(function(tag) {
      return {
        types: tag.types.join(', '),
        name: tag.name,
        description: tag.description
      };
    })
  };
  
  return Mustache.to_html(T.section, data);
}

/**
 * Return a hash of `code` to use for element id
 * 
 * @param {String} code
 * @return {String}
 */

function makeId(code) {
  return crypto.createHash('md5').update(code).digest('hex');
}
