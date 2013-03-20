/**
 * Module dependencies
 */

var fs = require('fs'),
    crypto = require('crypto'),
    Handlebars = require('handlebars');

/**
 * Global templates
 */

var T = {
  link: Handlebars.compile(fs.readFileSync(
                __dirname + '/templates/link.html', 'utf8')),
  layout: Handlebars.compile(fs.readFileSync(
                __dirname + '/templates/layout.html', 'utf8')),
  section: Handlebars.compile(fs.readFileSync(
                __dirname + '/templates/section.html', 'utf8'))
};

/**
 * Expose `doxen`
 * - Returns an html representation of dox object `dox`
 *
 * @param {String|Object} dox
 * @return {String}
 */

var doxen = module.exports = function doxen(dox) {
  if(typeof dox !== 'object') {
    try {
      dox = JSON.parse(dox);
    } catch(e) {
      return 'Invalid json';
    }
  }

  return build(dox);
};

/**
 * Expose the full render functionality
 * - Rendered the given `obj` to the template
 *
 * @param {Object} dox
 * @param {Object} data
 */

doxen.render = function render(dox, data) {
  data = data || {};
  data.title = data.title || 'Doxen';
  data.content = data.content || doxen(dox);

  return T.layout(data);
}

/**
 * Build docs
 *
 * @param {Object} dox
 * @return {Object}
 */

function build(dox) {
  var i, len,
      nav = '<nav><dl>',
      docs = '<div>';

  for(i = 0, len = dox.length; i < len; i = i + 1) {
    nav += navigation(dox[i]);
    docs += block(dox[i]);
  }

  nav += '</dl></nav>';
  docs += '</div>';

  return nav + docs;
}

/**
 * Build the navigation pane for a block
 *
 * @param {Object} chunk
 * @return {String} 
 */

function navigation(chunk) {
  var data = {
    id: makeId(chunk.code),
    title: chunk.ctx.string,
    description: chunk.description.summary
  };

  return T.link(data);
}

/**
 * Build the section for given `chunk`
 *
 * @param {Object} chunk
 * @return {String}
 */

function block(chunk) {
  var data = {
    code: chunk.code,
    title: chunk.ctx.string,
    id: makeId(chunk.code),
    type: chunk.ctx.type,
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
  
  return T.section(data);
}

/**
 * Return a hash of `code` to use for element id
 * 
 * @param {String} code
 * @return {String}
 */

function makeId(code) {
  return crypto.createHash('md5').update(code).digest('hex').slice(0, 10);
}
