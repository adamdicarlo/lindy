var lindy = require('../index')
  , fs = require('fs')
  , test = require('tape')

test('test basic for loop tag', function(assert) {
  var source = ' {% for color in colors %}\n {{ color }}\n {% endfor %} '
    , render = lindy(source)
    , output

  output = render({colors: ['red', 'blue']})
  assert.ok(/^\s+red\s+blue\s+$/.test(output), 'contains red and blue')
  assert.end()
})

test('test for loop with an {% empty %} clause', function(assert) {
  var source = [
      '{% for x in xs %}'
    , '  {{ x.k }}={{ x.v }}'
    , '{% empty %}'
    , '  nothing in xs'
    , '{% endfor %}'
  ].join('\n')
    , render = lindy(source)
    , output

  output = render({xs: [{k: 'pos', v: 1}, {k: 'pos', v: 5}]})
  assert.strictEqual(output, '\n  pos=1\n\n  pos=5\n')
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

test('example from README', function(assert) {
  var source = readTemplateSync('people.html')
    , expected = readTemplateSync('people.html.expected')
    , render = lindy(source)
    , data = {
        heading: 'People',
        people: [
            {name: 'Dave', age: 25, employed: true}
          , {name: 'John', age: 17, employed: false}
        ]
      }
    , output

  output = render(data)
  assert.strictEqual(output, expected)
  assert.end()
})

function readTemplateSync(path) {
  return fs.readFileSync('./tests/templates/' + path, {encoding: 'utf-8'})
}
