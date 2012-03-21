Mulholland compiler runtime | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

The Mulholland compiler runs or precompiles Mulholland source. It does this by applying rewrite rules to the source code, transforming the result into a Javascript expression using the
as_js() method, and then either evaluating or serializing the tree. It provides a few builtin rewriting rules and compiler directives to bootstrap the process.

    caterwaul.module('mulholland.mh', 'js_all', function ($) {

      $.mh_tracer = catastrophe(),
      $ /-$.mh_tracer.trace_module/ 'mulholland.rewrite',

# Mulholland module format

Like waul, mh specifies a minimal toplevel execution context. This is used to define extensions that can be used later on. The toplevel gives you just the !@ operator, which uses jsi to
compile the given expression to Javascript and then executes it using a caterwaul :all compiler.

# Command-line invocation

mh is designed to be used from the command line. The 'argv' passed into these functions is the list of net arguments; that is, no 'node' or 'mh'. You can get this from node by saying
process.argv.slice(2); this eliminates node and the Javascript file. All options are parsed in short form; that is, a single dash. mh looks for these arguments:

    -r  compiles the given source output into Javascript statements and executes it immediately
    -c  compiles a new 'mh' file with the given libraries bundled in and emits it to stdout
    -j  interprets the given file as Javascript, executing it immediately (useful to load caterwaul extensions)

For example:

    $ mh foo.mh                           # load foo.mh into the session and open a REPL
    $ mh -r foo.mh                        # compile foo.mh to Javascript and execute it immediately
    $ mh -jfoo.js -jbar.js foo.mh         # load foo.js and bar.js side-effectfully, then load foo.mh into session and open a REPL
    $ mh -c foo.mh                        # load foo.mh as a string, then write a new 'mh' instance that preloads it to stdout
    $ mh -c -jfoo.js foo.mh               # load foo.js as a Javascript module side-effectfully, then load foo.mh and write a new 'mh' instance that preloads both

      $.mulholland /-$.merge/ wcapture [

        mh_main(argv) = argv /-contains_short/ 'c' ? argv /!mh_compile : argv /!mh_repl,

# Replicating compiler behavior

This compiles a new 'mh' by asking Caterwaul to replicate itself. It also bundles in any source you give it after reading the corresponding files. This allows you to bake libraries into a 'mh'
compiler for later use and simplifies the process of using 'mh' as a shebang-line interpreter. For example:

    $ mh -c foo.mh > foo-mh
    $ chmod u+x foo-mh
    $ cat > runnable.mh <<eof
    #!./foo-mh -r
    ...
    eof
    $

        mh_compile(argv) = '#{header}\n#{resulting_tree};\n#{footer}' /!output
                   -where [parser         = $.mulholland() -se- evaluate_js_modules(argv),
                           bundled_source = $.syntax.from_array(source_for(argv) *parser.sdoc *$.syntax.from_string -seq),
                           resulting_tree = $.replicator().toString(),
                           license        = '// Mulholland compiler derivative | Spencer Tipping\n// Licensed under the terms of the MIT source code license',
                           reference_url  = '// Caterwaul modules: #{caterwaul.modules.join(" ")}\n// http://github.com/spencertipping/mulholland',
                           header         = '#!/usr/bin/env node\n#{license}\n#{reference_url}\n',
                           footer         = 'caterwaul.mulholland.mh_main(#{bundled_source}.concat(process.argv.slice(2)));'],

# REPL behavior

Read and evaluate any files specified on the command line, then enter a REPL that emits results to stdout. Node's REPL module is used to do this. Because of its CPS API, I make sure to call
the returning continuation at least once if it isn't called inline during the mh() invocation. This way, the user isn't left without a prompt while the result is "computing".

        mh_repl(argv)    = source_for(argv) *!mh -seq -then- introduce() -then- require('repl').start('mh> ', undefined, evaluator)
                   -where [mh                       = $.mulholland.mh() -se- evaluate_js_modules(argv),
                           evaluator(s, _1, _2, cc) = mh(s, {cc: "cc(null, v = _.as_js().guarded().toString())".qf}) -rescue- cc(e)
                                               -then- cc(null, mh.context.toplevel.rules.length) /unless.v -where [v = null]],

# Toplevel mh context

The toplevel contains a parser, a toplevel split() function to pull individual statements from a stream, a compilation environment (for jsi-based evaluation), and a rewriter. The rewriter
instance is itself immutable, but internally it gets replaced with each new definition. (This is one reason that definitions are expensive.)

        context()        = capture [parse         = $.mulholland(),                            split(s) = this /~parse/ s /~flatten_all/ ';',
                                    environment() = {c: $, context: this, parse: this.parse},  toplevel = [] /!$.mulholland.rewriter],

        introduce()      = process.stderr.write('Mulholland compiler (repl mode), copyright 2012 Spencer Tipping\n' +
                                                'Licensed under the terms of the MIT source code license\n' +
                                                'http://github.com/spencertipping/mulholland\n'),

# Mulholland evaluation function

This defines a minimal set of operations that allow you to use jsi for extension. In particular, it provides an evaluator that understands !@ compilation. Mulholland source and jsi are used to
define the other toplevel operators.

        mh(c = result.context = context())(s, specified_options) = c.split(s) *!evaluate -seq

          -where [options                                               = {} / defaults /-$.merge/ specified_options,
                  evaluate(t, e = c.toplevel(t), d = e.resolved_data()) = d === '!@' ? e /!js_evaluate : e /!options.cc,
                  compiler                                              = $(':all'),
                  compile(tree)                                         = tree /!compiler /-$.compile/ c.environment(),
                  empty                                                 = c.parse.syntax('@' /!c.parse.intern),
                  js_evaluate(t)                                        = t[0].as_js().guarded() /!compile /or [empty] /!options.cc]]

# Low-level bindings

These functions contain the mechanics of Mulholland's interface with the real world. They're not exposed in $.mulholland primarily because they aren't really relevant to what Mulholland does.

      -where [source_for(argv)          = argv %![/^-/.test(x)] *read_file -seq,
              modules_for(argv)         = argv %~![/^-j/.test(x) && x.substr(2)] *read_file -seq,
              evaluate_js_modules(argv) = modules_for(argv) *![new $.opaque_ref('(function(){#{x}})()') /-compile/ {caterwaul: $, require: require}] -seq -where [compile = $()],

              contains_short(argv, o)   = argv |[pattern /~exec/ x] |seq |where [pattern = new RegExp('^-(?!-)\\w*#{o}')],

              read_file(f)              = require('fs').readFileSync(f, 'utf8') -rescue- f,
              output(t)                 = process.stdout.write(t + ';\n', 'utf8'),

              defaults                  = {cc: output}]});