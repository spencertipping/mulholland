Mulholland syntax trees | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Mulholland uses interned strings rather than representing node data directly. As such, its syntax representation is a little different from Caterwaul's trees. It also has a different set of
methods that it uses to detect the roles of various things. Finally, it uses node-level transformations to render Javascript and machine code from its syntactic representation. This happens
with low-level Mulholland nodes, which are usually generated with @cps.

    caterwaul.module('mulholland.tree', 'js_all', function ($) {

# Idioms

These trees behave differently from Caterwaul syntax trees in a few ways. The overall structure is similar: each node has a 'data' and 'length' property along with zero or more
numerically-indexed children. However, the constructor protocol differs significantly. Instead of a flexible constructor that supports copying, the constructor rigidly requires exactly two
arguments. The first is the data, which is copied onto the node verbatim; the second is an array of children. The array of children can itself be a node. The data must be an integer that
indexes into the symbol table.

      $.mulholland.syntax_common = {},

      $.mulholland.syntax(parser, result.prototype / $.mulholland.syntax_common /-$.merge/ methods(parser),
                                  result                                        /-$.merge/ statics(parser))
                         (data, xs) = this instanceof result ? (this.data = data, this.length = 0, xs *![this /~push/ x] -seq -when.xs, this) : new result(data, xs),
      where [

      statics(parser) = wcapture [

        constants      = {},
        constant(s)    = Object.prototype.hasOwnProperty.call(constants, s) ? constants[s] : constants[s] = new this(s),

        create_bloom() = $.bloom(["_ * 5471".qf, "_ * 8707".qf], 8),
        empty_bloom    = create_bloom()],

      methods(parser) = capture [

        resolved_data() = parser.extern(this.data),
        structure()     = '(#{this.resolved_data()}#{+this *[" " + x.structure()] -seq -re- it.join("")})',
        toString()      = this.structure(),

        push(x, this[this.length++] = x)             = this,
        map(f, r = this *f -seq, r.data = this.data) = r,
        rmap(f, ft = f(this))                        = ft || this /~map/ "_ /~rmap/ f".qf,

# Transformations

These are useful when analyzing syntax trees in non-interpretative ways. For example, rewriters often need a list of equations to use; this can easily be obtained by flattening a tree under
',' or ';'. The flatten() method here is distinct from Caterwaul's flatten() method in that it returns arrays, not syntax nodes.

        flatten(op)       = parser.right_associative(op) ? this.right_flatten(op) : this.left_flatten(op),
        flatten_all(op)   = this.resolved_data() === op ? this[0].flatten_all(op) /~concat/ this[1].flatten_all(op) : [this],
        left_flatten(op)  = this.resolved_data() === op ? this[0].left_flatten(op) /~concat/ [this[1]]  : [this],
        right_flatten(op) = this.resolved_data() === op ? [this[0]] /~concat/ this[1].right_flatten(op) : [this],

# Attributes

Attributes arise from the structure of an identifier. These are orthogonal to syntactic roles, which determine parse behavior; attributes determine purely semantic things like whether one
identifier matches another. Mulholland supports the following cases:

    1. Regular constant term; this matches only itself, and at its own arity.
    2. Wildcard term; this matches any leaf or subtree. Wildcards start with '_' and are at least two characters long.
    3. Leaf wildcard; matches any leaf but not a subtree. These start with '_' and end with '@0'.
    4. Non-leaf wildcard; matches any subtree of arity n. These start with '_' and end with '@n', where 'n' is some integer. (This is actually a generalization of case 3.)

        is_wildcard()   = this._is_wildcard   === undefined ? this._is_wildcard   = /^_./.test(this.resolved_data())                            : this._is_wildcard,
        match_arity()   = this._match_arity   === undefined ? this._match_arity   = /^_.*@(\d+)$/.exec(this.resolved_data()) -re [it && +it[1]] : this._match_arity,
        without_arity() = this._without_arity === undefined ? this._without_arity = this.resolved_data().replace(/@(\d+)$/, '')                 : this._without_arity,

# Bloom filters

Trees are annotated with Bloom filters that indicate which constants they contain. This optimizes rewriting by quickly eliminating subtrees that don't contain constants that are present in a
pattern. For example, if your pattern is _x + foo, then its filter contains the constants '+' and 'foo'; target trees that don't contain these constants can't match the pattern.

        create_bloom() = this.constructor.create_bloom(),
        self_bloom()   = this.is_wildcard() ? this.create_bloom() : this.create_bloom() /~add/ this.data,
        bloom()        = this._bloom || this /[this._bloom = this.self_bloom()][x0 /~merge/ x.bloom()] -seq,

Bloom filters can be erased in some cases. This means that the node obtains an empty Bloom filter, so no constants it possesses are accounted for. This is actually really useful for some
things, most notably working with things like numbers (which shouldn't be hashed in many cases). You could theoretically use this to lie about the set of constants in a tree, but this approach
is unreliable because Bloom filters have false positives and your lie might therefore be ignored. The primary use case I see for Bloom erasure is to quickly allocate a constant node whose
value is known to be irrelevant to the rewriting process.

        erase_bloom()  = (this._bloom = this.constructor.empty_bloom, this),

# Complexity computation

This is a fairly straightforward way to reject low-level leaf nodes in recursive match cases. Each tree has a total 'complexity', which is a measure of the number of descendants it has. A
simple rule is that a pattern cannot have higher complexity than a target.

        complexity() = this._complexity || (this._complexity = 1 + this /[0][x0 + x.complexity()] /seq),

# Pattern matching and replacement

Caterwaul syntax trees have separate match() and replace() methods. Mulholland syntax trees support this mode of operation as well. Unlike Caterwaul, a failed match returns the boolean value
false instead of null or undefined. This allows you to inspect its match variables, all of which will be undefined. If passed into the replace() function, 'false' causes false to be returned.
This allows replacement to be closed over match failure.

The toplevel match check is whether the pattern tree contains any symbols that are not present in the target tree. This would instantly disqualify the match. Because it might have false
positives, we re-check at every match level.

Note that match() forms a partial ordering over trees. In particular, it is transitive; if A.match(B) and B.match(C), then A.match(C).

        match(t, m)            = this /~can_match/ t && this /~level_matches/ t && (m || (m = {_: t})) &&
                                 !this.is_wildcard() -or- (m[this.without_arity()] ? m[this.without_arity()] /~match/ t : m[this.without_arity()] = t) && this / t /~children_match/ m && m,

        replace(m)             = m && this.replace_children(m[this.resolved_data()], m) -or- this /~map/ "_.replace(m)".qf,
        replace_children(t, m) = t && (this.length ? new this.constructor(t.data, this /~map/ "_.replace(m)".qf) : t),

        can_match(t)           = this.complexity() <= t.complexity() && this.bloom() /~subset/ t.bloom(),
        level_matches(t)       = this.is_wildcard() ? this.match_arity() === null || t.length === this.match_arity() && (!t.is_wildcard() || t.match_arity() === this.match_arity())
                                                    : this.data === t.data && this.length === t.length,
        children_match(t, m)   = this /[true][x0 && x / t[xi] /~match/ m] -seq]]});