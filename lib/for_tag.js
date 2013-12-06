module.exports = function(parser, contents) {
  var bits = contents.split(/\s+/) // ["for", "item", "in", "items"(, "reversed")]
    , context_target = bits[1]
    , add_method = bits[4] === 'reversed' ? 'unshift' : 'push'
    , lookup_variable = parser.lookup(bits[3])
    , for_body
    , empty_body

  parser.parse({
      'endfor': endfor_tag
    , 'empty': empty_tag
  })

  return function lindy_for_loop(context) {
    var target = lookup_variable(context)
      , output = []
      , loop_context

    if(!target || !target.length) {
      return empty_body ? empty_body(context) : ''
    }

    for(var i = 0, len = target.length; i < len; ++i) {
      loop_context = Object.create(context)
      loop_context[context_target] = target[i]
      loop_context.forloop = {
          parent: loop_context.forloop
        , index: i
        , isfirst: i === 0
        , length: len
      }
      output[add_method](for_body(loop_context))
    }
    return output.join('')
  }

  function empty_tag(tpl) {
    for_body = tpl
    parser.parse({'endfor': endfor_tag})
  }

  function endfor_tag(tpl) {
    if(for_body) {
      empty_body = tpl
    } else {
      for_body = tpl
    }
  }
}
