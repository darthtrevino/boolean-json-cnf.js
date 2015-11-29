```javascript
var normalize = require('boolean-json-cnf')
```

The package exports a function of one [boolean-json](https://npmjs.com/packages/boolean-json-schema) object.

# De Morgan's Laws

```javascript
var assert = require('assert')

assert.deepEqual(
  // ¬(p ∨ q)
  normalize({ not: { or: [ 'p', 'q' ] } }),
  // (¬p ∧ ¬q)
  { and: [ { not: 'p' }, { not: 'q' } ] })

assert.deepEqual(
  // ¬(p ∧ q)
  normalize({ not: { and: [ 'p', 'q' ] } }),
  // (¬p ∨ ¬q)
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

# Distribution of Disjunction over Conjunction

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

# _k_-ary Conjunctions and Disjunctions

```javascript
assert.deepEqual(
  // ¬(p ∨ q ∨ r)
  normalize({ not: { or: [ 'p', 'q', 'r' ] } }),
  // (¬p ∧ (¬q ∧ ¬r))
  { and: [ { not: 'p' }, { and: [ { not: 'q' }, { not: 'r' } ] } ] })

assert.deepEqual(
  // ¬(p ∧ q ∧ r)
  normalize({ not: { and: [ 'p', 'q', 'r' ] } }),
  // (¬p ∨ (¬q ∨ ¬r))
  { or: [ { not: 'p' }, { or: [ { not: 'q' }, { not: 'r' } ] } ] })
```
