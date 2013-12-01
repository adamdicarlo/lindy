var peek = require('peek')
  , lindy_simple = require('lindy-simple')

var Parser = function(tag_parsers) {
  this.tag_parsers = {}
  Object.keys(tag_parsers).forEach(function(key) {
    this.tag_parsers[key] = tag_parsers[key]
  }, this)
}

var cons = Parser.constructor
  , proto = Parser.prototype

proto.set_template = function(contents) {
  this.contents = contents
}

proto.parse = function(until) {
  var pattern = /{%\s*([\w\d\s\-\.]*)\s*%}/
    , match
    , tag_name
    , sub
    , ops = []

  until = until || {}

  while(this.contents.length) {
    match = pattern.exec(this.contents)
    if(!match) {
      ops.push(lindy_simple(this.contents))
      this.contents = ''
      break
    }

    if(match.index > 0) {
      ops.push(lindy_simple(this.contents.slice(0, match.index)))
    }
    this.contents = this.contents.slice(match.index + match[0].length)

    tag_name = match[1].split(' ')[0]
    if (this.tag_parsers[tag_name]) {
      ops.push(this.tag_parsers[tag_name](this, match[1]))
    }
    else if (until[tag_name]) {
      break
    }
  }

  if (until[tag_name]) {
    until[tag_name](lindy_template)
  }

  return lindy_template

  function lindy_template(context) {
    return ops.reduce(function(prior, current) {
      return prior + current(context)
    }, '')
  }
}

proto.lookup = function(var_name) {
  return peek(var_name)
}

module.exports = function language(tag_parsers) {
  var parser = new Parser(tag_parsers)

  return function compiler(contents) {
    parser.set_template(contents)
    return parser.parse()
  }
}

/**
write the module that exports a function LANGUAGE()
that takes an object mapping tag names to parse functions TAG_MAP
and returns a function representing a compiler for strings COMPILER
in that language (fn(obj) -> fn(str) -> fn(obj) -> str is the chain). you will
need to use your dotpathlookup module and your templatelanguage modules to
build this module.

the module should:

define a Parser type
export a function that takes the object mapping.
the Parser should:

define a parse(obj?) function
define a lookup(str) function: lookup(str) -> function(obj) -> str
the exported function should:

instantiate Parser with the mapping object when the exported function is called
PARSER SHOULD
match tags by /{%\s*([\w\d\s\-\.]*)\s*%}/
see if there's a tag parser function defined by the first word in match[1]
call that tag parser function with itself and match[1]
*/
