const bifurcate = require("boolean-json-bifurcate");
const prune = require("boolean-json-prune");

module.exports = function booleanJSONCNF(expression) {
  // Since boolean-json-schama@3.0.0, conjunctions and disjunctions can
  // contain more than two operands. This makes entering data more
  // user-friendly.
  //
  // For example, `{ and: [ 'p', 'q', 'r' ] }` is now valid Boolean
  // JSON, where that would have to be expressed
  // `{ and: [ 'p', { and: [ 'q', 'r' ] } ] }`
  // prior to 3.0.0.
  //
  // To end up with unambiguous CNF, first "bifurcate" the expression,
  // which is to say convert all conjunctions and disjunctions with more
  // than two operands to compound statements of two operands each.
  //
  // For example, bifurcation converts `{ or: [ 'p', 'q', 'r' ] }`
  // to `{ or: [ 'p', { or: [ 'q', 'r' ] } ] }`.
  return prune(normalize(bifurcate(expression)));
};

function normalize(expression) {
  var p, q, r;

  // De Morgan's Laws

  // Negation of a Disjunction
  // ¬(p ∨ q) ⇔ (p ∧ q)
  if (
    isNegation(expression) &&
    !isVariable(expression.not) &&
    isDisjunction(expression.not)
  ) {
    p = normalize(expression.not.or[0]);
    q = normalize(expression.not.or[1]);
    return {
      and: [normalize({ not: p }), normalize({ not: q })]
    };

    // Negation of a Conjunction
    // ¬(p ∧ q) ⇔ (p ∨ q)
  } else if (
    isNegation(expression) &&
    !isVariable(expression.not) &&
    isConjunction(expression.not)
  ) {
    p = normalize(expression.not.and[0]);
    q = normalize(expression.not.and[1]);
    return {
      or: [normalize({ not: p }), normalize({ not: q })]
    };

    // Double Negation
    // (¬¬p) ⇔ (p)
  } else if (
    isNegation(expression) &&
    !isVariable(expression.not) &&
    isNegation(expression.not)
  ) {
    return normalize(expression.not.not);

    // Distribution of Disjunction Over Conjunction

    // Conjunction First
    // ((q ∧ r) ∨ p) ⇔ ((p ∨ q) ∧ (p ∨ r))
  } else if (
    isDisjunction(expression) &&
    !isVariable(expression.or[0]) &&
    isConjunction(expression.or[0])
  ) {
    p = normalize(expression.or[1]);
    q = normalize(expression.or[0].and[0]);
    r = normalize(expression.or[0].and[1]);
    return {
      and: [normalize({ or: [p, q] }), normalize({ or: [p, r] })]
    };

    // Conjunction Second
    // (p ∨ (q ∧ r)) ⇔ ((p ∨ q) ∧ (p ∨ r))
  } else if (
    isDisjunction(expression) &&
    !isVariable(expression.or[1]) &&
    isConjunction(expression.or[1])
  ) {
    p = normalize(expression.or[0]);
    q = normalize(expression.or[1].and[0]);
    r = normalize(expression.or[1].and[1]);
    return {
      and: [normalize({ or: [p, q] }), normalize({ or: [p, r] })]
    };

    // Simple statements pass through.
  } else {
    return expression;
  }
}

function isConjunction(argument) {
  return typeof argument === "object" && "and" in argument;
}

function isDisjunction(argument) {
  return typeof argument === "object" && "or" in argument;
}

function isNegation(argument) {
  return typeof argument === "object" && "not" in argument;
}

function isVariable(expression) {
  return (
    !isConjunction(expression) &&
    !isDisjunction(expression) &&
    !isNegation(expression)
  );
}
