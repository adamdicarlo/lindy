var expression = require('./expression')

module.exports = function lindy_if_tag(parser, contents) {
  var bits = contents.trim().split(/\s+/) // ["if", ("op",) "foo"]
    , condition = expression(parser, bits.slice(1))
    , then_body
    , else_body = function() { return '' }

  parser.parse({
      'else': else_tag
    , 'endif': endif_tag
  })

  return function if_tag(context) {
    return condition(context) ? then_body(context) : else_body(context)
  }

  function else_tag(tpl) {
    then_body = tpl
    parser.parse({'endif': endif_tag})
  }

  function endif_tag(tpl) {
    if (then_body) {
      else_body = tpl
    }
    else {
      then_body = tpl
    }
  }
}
