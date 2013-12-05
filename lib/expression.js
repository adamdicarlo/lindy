module.exports = function lindy_expression(parser, bits) {
  var lookup_variable = parser.lookup(bits[0])

  return function expression(context) {
    return lookup_variable(context)
  }
}
