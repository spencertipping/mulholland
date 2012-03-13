# Mulholland language

Mulholland is a practical [Havoc](http://github.com/spencertipping/havoc) implementation written in and using [Caterwaul](http://github.com/spencertipping/caterwaul). More usefully, it is an
optimizing term rewriter that contains a native rewriting transformation from Mulholland source into Javascript.

MIT licensed as usual.

The core interpreter is implemented in `mulholland`, which is a [self-modifying Perl object](http://github.com/spencertipping/perl-objects) that contains caterwaul source. It uses the `waul`
precompiler to convert the caterwaul source into Javascript, after which it uses a [preprocessor](http://spencertipping.com/perl-objects/preprocessor.html) to concatenate the Javascript
sources together into the `mh` script. `mh` is executable by [node.js](http://nodejs.org) and can replicate itself in some useful ways, described below.

## Mulholland internals

Mulholland is very similar to caterwaul in a lot of ways, but its syntax is not compatible with Javascript and it compiles to Javascript only incidentally. Its syntax trees are optimized for
fast rewriting and destructuring binds; to do this they use a variety of heuristics to quickly reject large subtrees. This differs from caterwaul, which is optimized at a low level for
dynamic rewriting but doesn't do any static pattern analysis.

This project uses two significant optimizations that make it more scalable than caterwaul. First, rewrites are statically inlined. This means that if `foo = bar` and `bar = bif`, mulholland
replaces the first rewrite rule with `foo = bif` to skip the intermediate step. This eager rewriting makes it infeasible to define nonterminating rewrite rules, so mulholland as a rewriting
language is not Turing-complete.

The second optimization is that each syntax tree maintains a 256-bit [Bloom filter](http://en.wikipedia.org/wiki/Bloom_filter) index of the constants contained in that tree and any
descendants. Because the set of constants in a pattern must be a subset of the constants in any matching tree, a constant-time Bloom filter subset operation can exclude subtrees of arbitrary
size with a probability inversely proportional to the subtree's constant set size. False positives translate into extra work, but don't impact the correctness of the result.

## Using `mh`

`mh` is probably most useful as a REPL right now. I'm still figuring out what mulholland as a language needs to be, but you can see the rewriter in action like this:

    $ ./mh
    mh> foo = bar
    1           <- the number of unique rewrite rules
    mh> bar = bif
    2
    mh> foo
    'bif'
    mh>

Pattern variables can be specified using an underscore prefix, just like caterwaul wildcards:

    mh> f _x = _x + 1
    mh> f foo
    'bif+1'
    mh>

Rewrite rules can generate more rewrite rules:

    mh> define _name _value = _name = _value
    mh> define (g _x) (_x * 2)
    mh> g 10
    '10*2'
    mh>

You can also match against rewrite rules:

    mh> (foo _x = _y) = (bar _x = _y)
    mh> foo 5 = y + 1
    mh> bar 5
    'y+1'
    mh>

## Replication

`mh` can replicate itself just like `waul`. This is useful for two purposes. First, you can load caterwaul modules using `mh -jmodule.js`. Second, you can preload mulholland source files.
The option to replicate is `-c`:

    $ ./mh -c foo.mh            <- emits on stdout a mh compiler with foo.mh bundled in
    $ ./mh -c -jmodule.js       <- emits on stdout a mh compiler whose caterwaul instance is configured with module.js

The `mh` in the root directory is the product of one such replication cycle; this process is governed by `mulholland`, which is a self-modifying Perl object that contains the authoritative
copies of mulholland's source in caterwaul.