var lindy = require('../index')
  , fs = require('fs')
  , test = require('tape')
  , expression = require('../lib/expression')

test('basic for loop tag', function(assert) {
  var source = ' {% for color in colors %}\n {{ color }}\n {% endfor %} '
    , render = lindy(source)
    , output

  output = render({colors: ['red', 'blue']})
  assert.ok(/^\s+red\s+blue\s+$/.test(output), 'contains red and blue')
  assert.end()
})

test('basic reversed for loop tag', function(assert) {
  var source = '{% for i in numbers reversed %}{{ i }}{% endfor %}'
    , render = lindy(source)
    , output

  output = render({numbers: [1,2,3,4,5]})
  assert.equal(output, '54321', 'reverses given numbers')
  assert.end()
})

test('for loop with an {% empty %} clause', function(assert) {
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
  assert.equal(output, '\n  pos=1\n\n  pos=5\n')
  assert.end()
})

test('basic if tag', function(assert) {
  var source = 'hello{% if specific %} {{specific}}{%endif%}'
    , render = lindy(source)

  assert.equal(render(), 'hello')
  assert.equal(render({specific: 'world'}), 'hello world')
  assert.end()
})

test('basic if/else tag', function(assert) {
  var source = 'hello, {% if happy %}my friend{% else %}jerk{% endif %}!'
    , render = lindy(source)

  assert.strictEqual(render(), 'hello, jerk!')
  assert.strictEqual(render({happy: false}), 'hello, jerk!')
  assert.strictEqual(render({happy: true}), 'hello, my friend!')
  assert.strictEqual(render({happy: 'truthy value'}), 'hello, my friend!')
  assert.end()
})

function mock_parser(assert, expected_var_name, expected_context) {
  return {
      lookup: function(var_name) {
        assert.equal(var_name, expected_var_name, 'expected variable is looked up')
        return function test_lookup(context) {
          assert.equal(context, expected_context, 'expected context object used')
          return context[var_name]
        }
      }
  }
}

test('boolean expressions with not operator', function(assert) {
  var bits = ['not', 'foo']
    , context = {foo: true}
    , parser = mock_parser(assert, 'foo', context)
    , run = expression(parser, bits)

  // Test negating a true value.
  assert.equal(run(context), false, '"not" negates boolean true')
  assert.deepEqual(bits, ['not', 'foo'], 'expression does not modify bits arg')

  // Test negating a false value.
  context.foo = false
  assert.equal(run(context), true, '"not" negates boolean false')

  // Test in conjunction with "even" operator.
  bits = ['not', 'even', 'foo']
  context.foo = 5
  run = expression(parser, bits)
  assert.equal(run(context), true, '"not even 5" is true')

  context.foo = 4
  assert.equal(run(context), false, '"not even 4" is false')

  assert.end()
})

test('expressions with "odd" and "even" operators', function(assert) {
  var context = {}
    , parser = mock_parser(assert, 'count', context)
    , run_odd = expression(parser, ['odd', 'count'])
    , run_even = expression(parser, ['even', 'count'])
    , is_odd

  for(var i = -5; i <= 5; ++i) {
    context.count = i
    is_odd = (i % 2) !== 0
    assert.equal(run_odd(context), is_odd, 'is ' + i + ' odd?')
    assert.equal(run_even(context), !is_odd, 'is ' + i + ' even?')
  }
  assert.end()
})

test('if statement with expression "not odd x"', function(assert) {
  var source = 'x is {%if not odd x%}even{%else%}odd{%endif%}'
    , render = lindy(source)

  assert.equal(render({x: -1}), 'x is odd', '-1 is odd')
  assert.equal(render({x: 0}), 'x is even', '0 is even')
  assert.equal(render({x: 1}), 'x is odd', '1 is odd')
  assert.equal(render({x: 2}), 'x is even', '2 is even')
  assert.end()
})

test('if statement with expression "not x"', function(assert) {
  var source = 'x is {% if  not  x %}falsy{% else %}truthy{% endif %}'
    , render = lindy(source)

  assert.equal(render({x: -1}), 'x is truthy', '-1 is truthy')
  assert.equal(render({x: 0}), 'x is falsy', '0 is falsy')
  assert.equal(render({x: 1}), 'x is truthy', '1 is truthy')
  assert.equal(render({x: 2}), 'x is truthy', '2 is truthy')
  assert.end()
})

test('example from README', function(assert) {
  var source = read_template_sync('people.html')
    , expected = read_template_sync('people.html.expected')
    , render = lindy(source)
    , data = {
          heading: 'People'
        , people: [
              {name: 'Dave', age: 25, employed: true}
            , {name: 'John', age: 17, employed: false}
          ]
      }
    , output

  output = render(data)
  assert.equal(output, expected)
  assert.end()
})

test('nested if tags', function(assert) {
  var source = read_template_sync('nested-ifs.lindy')
    , render = lindy(source)
    , just_dark = /^\s*dark\s*$/
    , test_cases = [
          {data: {bright: false, big: false}, regex: just_dark}
        , {data: {bright: false, big: true},  regex: just_dark}
        , {data: {bright: true,  big: false}, regex: /bright\s*and small/}
        , {data: {bright: true,  big: true},  regex: /bright\s*and big/}
      ]

  test_cases.forEach(function(test_case, index) {
    var output = render(test_case.data)
    assert.ok(test_case.regex.test(output), 'nested if test ' + index)
  })
  assert.end()
})

function read_template_sync(path) {
  return fs.readFileSync('./tests/templates/' + path, {encoding: 'utf-8'})
}
