var lindy = require('../index')
  , test = require('tape')

test('test basic for loop tag', function(assert) {
  var source = ' {% for color in colors %}\n {{ color }}\n {% endfor %} '
    , render = lindy(source)
    , output

  output = render({colors: ['red', 'blue']})
  assert.ok(/^\s+red\s+blue\s+$/.test(output), 'contains red and blue')
  assert.end()
})

test('test basic if tag', function(assert) {
  var source = 'hello{% if specific %} {{specific}}{%endif%}'
    , render = lindy(source)

  assert.strictEqual(render(), 'hello')
  assert.strictEqual(render({specific: 'world'}), 'hello world')
  assert.end()
})

test('test basic if/else tag', function(assert) {
  var source = 'hello, {% if happy %}my friend{% else %}jerk{% endif %}!'
    , render = lindy(source)

  assert.strictEqual(render(), 'hello, jerk!')
  assert.strictEqual(render({happy: false}), 'hello, jerk!')
  assert.strictEqual(render({happy: true}), 'hello, my friend!')
  assert.strictEqual(render({happy: 'truthy value'}), 'hello, my friend!')
  assert.end()
})
