const cnf = require("./index");

describe("The boolean-json-cnf library", () => {
  it("exists", () => {
    expect(cnf).toBeDefined();
  });

  it("can resolve double negation", () => {
    // ¬¬p
    let result = cnf({ not: { not: "p" } });
    let expected = "p";
    expect(result).toEqual(expected);
  });

  it("can apply De Morgan's laws", () => {
    // ¬(p ∨ q)
    let result = cnf({ not: { or: ["p", "q"] } });
    // (¬p ∧ ¬q)
    let expected = { and: [{ not: "p" }, { not: "q" }] };
    expect(result).toEqual(expected);

    // ¬(p ∧ q)
    result = cnf({ not: { and: ["p", "q"] } });
    // (¬p ∨ ¬q)
    expected = { or: [{ not: "p" }, { not: "q" }] };
    expect(result).toEqual(expected);
  });

  it("can resolve distribution over conjunction", () => {
    // (p ∨ (q ∧ r))
    let result = cnf({ or: ["p", { and: ["q", "r"] }] });
    // ((p ∨ q) ∧ (p ∨ r))
    let expected = { and: [{ or: ["p", "q"] }, { or: ["p", "r"] }] };
    expect(result).toEqual(expected);

    // ((q ∧ r) ∨ p)
    result = cnf({ or: [{ and: ["q", "r"] }, "p"] });
    // ((p ∨ q) ∧ (p ∨ r))
    expected = { and: [{ or: ["p", "q"] }, { or: ["p", "r"] }] };
    expect(result).toEqual(expected);
  });

  it("can resolve k-ary Conjunctions and Disjunctions", () => {
    // ¬(p ∨ q ∨ r)
    let result = cnf({ not: { or: ["p", "q", "r"] } });
    // (¬p ∧ ¬q ∧ ¬r)
    let expected = {
      and: [{ not: "p" }, { not: "q" }, { not: "r" }]
    };
    expect(result).toEqual(expected);

    // ¬(p ∧ q ∧ r)
    result = cnf({ not: { and: ["p", "q", "r"] } });
    // (¬p ∨ ¬q ∨ ¬r)
    expected = { or: [{ not: "p" }, { not: "q" }, { not: "r" }] };
    expect(result).toEqual(expected);
  });
});
