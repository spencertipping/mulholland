Mulholland rewriter | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Mulholland code needs to be rewritten into something runnable in order to be at all useful. This module implements a general-purpose optimizing rewriter for this purpose. It takes as input a
series of rewrite rules and returns a function that will rewrite a tree accordingly.

    caterwaul.module('mulholland.rewrite', 'js_all', function ($) {

# Mathematical properties of rewriting

Equations that you write are implicitly normalizing symmetric equivalence relations. This has a few consequences. First, terms are normalized towards the right-hand side of the equations
transitively; so, for instance, if you write 'foo = bar' and then write 'foo', the result will be 'bar' because 'bar' is considered to be the most normalized form in its equivalence class. The
rewriter determines this by transitive closure, and circular rewrites with no normal form will cause a stack overflow error. (This is why it is coded recursively, despite the fact that it
could be written as a loop instead.)

Rewriting is not assumed to be homomorphic across tree descendants. For example, 'foo _x = 10' and 'bar (foo _x) = 20' will not result in the identity 'bar 10 = 20'. Homomorphism must be
explicitly indicated by an equivalence like this: 'bar _x /- _r = bar (_x /- _r)'. /- is already assumed to be homomorphic across ;.

Equations are symmetric because their left-hand terms can be normalized prior to rewriting. For example, you can see this behavior in mh:

    > foo = bar + bif
    > foo = 5
    > bar + bif
    5
    >

This happens because the equation 'foo = 5' is rewritten prior to its definition; it is internally represented as its more normalized form, 'bar + bif = 5'. However, because bar + bif is a
pattern, this is actually a denormalizing rewrite (since it requires a corresponding normalization operation for the term that matches it). For this reason, the equation 'foo = bar + bif' is
semantically symmetric in its role as an equivalence relation.

Note that if we then said 'foo = 6', Mulholland would conclude that 5 = 6. At this point, 'bar + bif', 'foo', and 5 would all normalize into 6.

# Rewriting optimizations

Most of the time Mulholland spends compiling things is taken up by the rewriting process, so a number of optimizations are implemented to make this fast. First, each rule is closed under
transitivity with each other rule. This means that if x -> y and y -> z, then the rule 'x -> y' is replaced with 'x -> z'. This is quadratic in the number of rules that are present. For
example, this is a case where transitivity would apply:

    foo + bif = bar + bif                 <- this would be rewritten as foo + bif = 1 because bar + _x matches bar + bif
    bar + _x = 1

      $.mulholland.rewriter(rules) = rewrite /-$.merge/ capture [rules = current,  extend(rs) = $.mulholland.rewriter(current + rs %[x] -seq)]

                                                         -where [current                      = +rules -seq,
                                                                 change                       = null,

                                                                 pattern_complexity()         = current /[0x10000000][x0 /-Math.min/ x[0].complexity()] -seq,
                                                                 rewrite_once(t)              = current |~![x[1] /~replace/ x[0].match(t)] |seq |se [change -oeq- it],

                                                                 fixed_point(fix = result)(t) = change -eq- null -then- rewrite_once(t) /or.t -re [change ? fix(it) : it],
                                                                 transitive_limit(r)          = [r[0], fixed_point()(r[1])],

                                                                 uniq(rs)                     = rs %!r[rs |[xi > ri && x[0] /~match/ r[0]], seq] -seq,
                                                                 current                      = uniq(seq in current + current *transitive_limit),
                                                                 rewrite                      = fixed_point()]});