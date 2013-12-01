var lindy = require('../index')
  , test = require('tape')

test('test basic for loop tag', function(assert) {
  var rendered,
      template = ' {% for color in colors %}\n {{ color }}\n {% endfor %} '

  template = lindy(template)
  rendered = template({colors: ['red', 'blue']})
  assert.ok(/^\s+red\s+blue\s+$/.test(rendered), 'contains red and blue')
  assert.end()
})
