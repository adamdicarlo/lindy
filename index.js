var language = require('./lib/language')
  , if_tag = require('./lib/if_tag')
  , for_tag = require('./lib/for_tag')

var compile = language({
    'if': if_tag
  , 'for': for_tag
})

module.exports = function lindy(contents) {
  return compile(contents)
}
