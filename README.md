```javascript
var normalize = require('boolean-json-cnf')
var assert = require('assert')
```

`normalize` takes ands returns a [boolean-json](https://npmjs.com/packages/boolean-json-schema) object.

# DeMorgan's Laws

```javascript
assert.deepEqual(
  // ¬(p ∨ q)
  normalize({ not: { or: [ 'p', 'q' ] } }),
  // (¬p ∧ ¬q)
  { and: [ { not: 'p' }, { not: 'q' } ] })

assert.deepEqual(
  // ¬(p ∧ q)
  normalize({ not: { and: [ 'p', 'q' ] } }),
  // (p ∨ q)
  { or: [ { not: 'p' }, { not: 'q' } ] })
```

# Double Negation

```javascript
assert.deepEqual(
  // ¬¬p
  normalize({ not: { not: 'p' } }),
  // p
  'p')
```

# Distribution

```javascript
assert.deepEqual(
  // (p ∨ (q ∧ r))
  normalize({ or: [ 'p', { and: [ 'q', 'r' ] } ] }),
  // ((p ∨ q) ∧ (p ∨ r))
  { and: [ { or: [ 'p', 'q' ] }, { or: [ 'p', 'r' ] } ] })

assert.deepEqual(
  // ((q ∧ r) ∨ p)
  normalize({ or: [ { and: [ 'q', 'r' ] }, 'p' ] }),
  // ((p ∨ q) ∧ (p ∨ r))
  { and: [ { or: [ 'p', 'q' ] }, { or: [ 'p', 'r' ] } ] })
```
