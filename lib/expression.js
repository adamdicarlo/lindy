var operators = {
    'not': function not_operator(value) {
      return !value
    }
  , 'odd': function odd_operator(value) {
      return (value % 2) !== 0
    }
  , 'even': function even_operator(value) {
      return (value % 2) === 0
    }
}

module.exports = function lindy_expression(parser, bits) {
  var token
    , lookup_variable
    , ops = []

  // Don't modify caller's bits.
  bits = bits.slice()

  lookup_variable = parser.lookup(bits.pop())
  for(var i = 0; i < bits.length; ++i) {
    token = bits[i]
    if(token.length > 0) {
      if(operators[token]) {
        // Add to head, so operations are in opposite order they appear in
        // the expression. For example, "not even foo" produces
        // [even_operator, not_operator].
        ops.unshift(operators[token])
      } else {
        throw new Error('bad operator: "' + token + '"')
      }
    }
  }

  return function expression(context) {
    return ops.reduce(function evaluate_expression(value, op) {
      return op(value)
    }, lookup_variable(context))
  }
}
