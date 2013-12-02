module.exports = function(parser, contents) {
  var bits = contents.split(/\s+/) // ["if", "foo"]
    , lookup_variable = parser.lookup(bits[1])
    , then_body
    , else_body = function() { return '' }

  parser.parse({
      'else': else_tag
    , 'endif': endif_tag
  })

  return function lindy_if_tag(context) {
    return lookup_variable(context) ? then_body(context) : else_body(context)
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
