# lindy

Lightweight JavaScript template language with a familiar syntax.

### Limitations

Currently, only if/then/endif, for/empty/endfor, and simple string
substitutions are supported.

## Usage

Sample template `person.html`:
```
<h2>{{ heading }}</h2>
<ul>
  {% for person in people %}
  <li>
    {{ person.name }} ({{ person.age }}) is
    {% if person.employed %}
      working
    {% else %}
      unemployed
    {% endif %}
  </li>
  {% endfor %}
</ul>
```

Rendering the template in node:
```javascript
  var lindy = require('lindy')
    , fs = require('fs')
    , source = fs.readFileSync('./person.html', {encoding: 'utf-8'})
    , data = {
        heading: 'People',
        people: [
            {name: 'Dave', age: 25, employed: true}
          , {name: 'John', age: 17, employed: false}
        ]
      }
    , render = lindy(source)

  return render(data)
```


## Running the tests

```
  $ git clone https://github.com/adamdicarlo/lindy.git # clone or fork
  $ cd lindy
  $ npm install
  $ npm test
```

## License

MIT
