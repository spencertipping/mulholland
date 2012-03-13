Mulholland parser | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

The parser is based on operator-precedence parsing using a regexp lexer. This should be very fast under recent Javascript VMs and should involve a minimal GC overhead. Symbols are interned
into integers to accelerate access; the tree can be back-translated by dereferencing: tree.resolved_data(). This interning process is done before folding groups. Assigned numbers are coded
according to their syntactic roles.

Unlike the Caterwaul parser, this one uses a shunting yard algorithm to fold operators as the parse is running. We can get away with this because there are no special cases involving blocks
and there are no patch-ups that need to be done. The algorithm is modified from the original shunting-yard algorithm in that it detects operator-value / value-value sequences so that it can
parse implicit joins (e.g. f x = x + 1: in this case, 'f x' is an implicit join with high precedence).

    caterwaul.module('mulholland.parser', 'js_all', function ($) {
      $.mulholland.parser(table = {}, table_i = {}, next = 0) = parser /-$.merge/ statics()

# Static data

You can access most of the internal state of a parser. You probably shouldn't poke around and change stuff, but you can at the very least inspect it and ask the parser questions. (For
instance, you might want to know the precedence and associativity of a given operator.)

      -where [parser    = "_.toString() /!sdoc /!lex /!parse".qf,
              syntax    = $.mulholland.syntax(parser),
              statics() = capture [syntax = syntax, intern = intern, extern = extern, transient_intern = transient_intern, lex = lex, sdoc = sdoc, parse_token = parse_token],

# Lexer and token types

Tokens are lexed independently of their position in the input stream. This can be done because Mulholland doesn't have lex-ambiguous tokens like Javascript's regular expressions. At a high
level, Mulholland supports these types of tokens:

    1. Identifiers, which have the form /[_@A-Za-z0-9][^ \n\t\r.:,;()\[\]{}]*/
    2. Strings with \ escapes and optional identifier suffixes of the form /[^ \n\t\r.:,;()\[\]{}]*/
    3. Line comments that start with # and go until the next newline (these are, of course, removed from the token stream)
    4. Operators, which are of the form /[^ \n\t\r()\[\]{}A-Za-z]+(\w+[^ \n\t\r()\[\]{}]+)*/ (they can contain letters, but those letters must be bounded on both sides by operator chars)
    5. Micro-operators, which are of the form /[.:,;][^ \n\t\rA-Za-z@_()\[\]{}]*/
    6. Grouping operators, which are of one of ( ) [ ] { }. Of these, parentheses are erased.

It also supports SDoc-style paragraph comments. These are removed just like line comments. Mulholland treats all whitespace and comments as a single space. It is Unicode-capable but naively
treats any Unicode character as the beginning of an operator.

              sdoc(s) = s.split(/\n(?:\s*\n)+/) %![/^\s*[A-Z|]/.test(x)] -seq -re- it.join('\n'),
              lexer   = /(#.*|(?:[@\w]|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")[^\s.:,;()\[\]{}]*|[.:,;][^\sA-Za-z@_()\[\]{}]*|[^\s.;,;()\[\]{}][^\s\w()\[\]{}]*(?:\w*[^\s\w()\[\]{}]+)*|[()\[\]{}])/,
              lex(s)  = s.split(lexer) %[/^[^ \n\t\r#]/.test(x)] -seq,

# Symbol interning

Symbols are interned into integers for performance reasons. The overhead involved in doing this is relatively small and the speedup for rewrites is quite significant. These symbols are
transparently rendered by the syntax nodes, whose constructor is already parameterized with the symbol table. Note, however, that this means you need to use the same parser for all trees that
are backed by symbol tables, at least until you render them into regular Caterwaul syntax trees. On the bright side, the syntax node constructor contains a reference to the parser that created
it; so generally speaking you don't have to worry about it.

              intern(s) = Object.prototype.hasOwnProperty.call(table_i, s) ? table_i[s] : table_i[table[next] = s] = next++,
              extern(n) = n.constructor === Number && Object.prototype.hasOwnProperty.call(table, n) ? table[n] : n,

              transient_intern(s) = Object.prototype.hasOwnProperty.call(table_i, s) ? table_i[s] : s.toString(),

# Precedence groups

Mulholland uses a fairly normal precedence layout. From high to low precedence, these are the classes of operators it supports and their associativity (if you memorize the logical layers then
most other things should be fairly straightforward):

    Dot access             .                      left   2          <- first logical layer
    Applicative            #                      left   4          <- second logical layer
      Unary                ! ~ \ ` 个不           right  5
    Multiplicative         / * % ⋅ ∩              left   6          <- third logical layer
    Additive/bitwise       + - : & ^ ∪ ≻ ≺        left   8          <- fourth logical layer
      Disjunction          | ⋯                    left   10
    Relational             < > ≡ ∈ ⊂ ⊆ ⊃ ⊇ 是     left   12         <- fifth logical layer
      Applicative          $                      right  13
    Logical                ∧ ¬ ⊕                  left   14         <- sixth logical layer
      Logical disjunction  ∨                      left   16
    Ternary/assignment     = ?                    right  17         <- seventh logical layer
    Tupling                ,                      left   18
    Sequence               ;                      left   20

This table has some important properties. First, all even precedence levels left-associate and all odd levels right-associate. This prevents the ambiguity that would arise if two operators had
opposite associativity but equal precedence. Further, this property continues to hold even for operators which are not defined in the table above. This generality allows you to shift an
operator's precedence and modify its associativity simultaneously.

The parser still supports asymmetric operator precedence even though there is no way to use it. I may reintroduce the feature at some point in the future.

# Handling Unicode

Any Unicode characters are, admittedly erroneously, assumed to be parts of operators. This is important: it means that you can use any Unicode character as an adverb on an operator, but it can
only be a suffix of a noun. (Remember that tokens are categorized based on what they start with.)

# Parser internals

The first stage involves "parsing" each token into a structure that describes its characteristics. These characteristics are:

    1. l  its left-facing precedence (greater is lower precedence)
    2. r  its right-facing precedence
    3. id the interned symbol ID of the canonical form of the token (after operator hint erasure; values are preserved verbatim)
    4. v  truthy if the token is a value
    5. u  truthy if the token represents a unary operator
    6. o  truthy if the token opens a group
    7. c  truthy if the token closes a group
    8. i  truthy if the token is invisible; that is, it should not be consed into an operator node (this is used to implement parenthesis erasure)

The values in these structures govern the parser's behavior. For instance, when we encounter an operator, we force the operator stack until the right-facing precedence of the stack top lines
up with the left-facing precedence of the operator we've just seen. This is a fairly standard feature of shunting-yard operator precedence parsers, though generalized a bit to deal with
precedence asymmetry.

Some singularities of this particular implementation include its inference of joins and its modeling of operators with asymmetric precedence. Joins are inferred when the parser does not expect
to see a value but encounters one anyway. For instance, if you parse 'foo + bar bif', a join is inferred between 'bar' and 'bif' because after 'bar' the parser expected to encounter an
operator, not a value. A join is also generated when you have a unary operator where a binary operator is expected. This causes the parser to do the right thing for expressions such as
'foo(bar)': a join is inferred after 'foo' and before '(bar)'.

# Operator modifiers

Previous versions of mulholland provided fully general operator modifiers, which allowed you to dynamically change the precedence of any operator without changing the operator itself. For
example, you could use the / prefix to make an operator multiplicative-precedence: foo + bif /+ bar would be equivalent to foo + (bif + bar). This version does away with this because it's
fundamentally a little bit misguided. As such, the operator "parse" step is fairly trivial.

              precedence_table          = '\\. $ # [~!\\\\`个不] [/*%⋅∩] $ [-+:&^∪≺≻] $ [|⋯] $ [<>≡∈⊂⊆⊃⊇是] [\\$] [∧¬⊕] $ [∨] [=?] [,] $ [;]'.qw *[new RegExp('^#{x}')] -seq,
              base_precedence(t)        = precedence_table |[x.test(t) && xi + 2] |seq,        operator_lexer = /^(\$*)(.+?)(\$*)$/.qf,
              is_unary(t)               = precedence_table[3].test(t) || !base_precedence(t),  is_operator    = /^[^"'\w@_]+(?:\w*[^\s\w()\[\]{}]+)*$/.qf,

              is_opener(t)              = '([{'.indexOf(t) + 1,
              is_closer(t)              = ')]}'.indexOf(t) + 1,

              parse_token(t)            = is_operator(t) ? parse_operator(t) : {l: 0,       r: 0,       id: t /!intern, v: true},
              parse_operator(t)         = is_opener(t)   ?                     {l: 1 << 30, r: 1 << 30, id: t /!intern, o: true, u: true, i: t === '('} :
                                          is_closer(t)   ?                     {l: 1 << 30, r: 1 << 30, id: t /!intern, c: true}                        : parse_regular_operator(t),

              parse_regular_operator(t) = {l: real_left, r: precedence, id: pieces[2] /!intern, u: unary}
                                  -where [pieces     = operator_lexer(t),                                                  unary     = pieces[2] /!is_unary,
                                          precedence = pieces[2] /!base_precedence + pieces[1].length - pieces[3].length,  real_left = unary ? 1 : precedence],

              join                      = '#' /!parse_operator,
              empty_value               = new syntax('@'),

              parse(ts)                 = ts *parse_token *!observe -seq -then- apply_all()

                                  -where [values         = [],    right(t) = t.l & 1,
                                          operators      = [],    value()  = values.pop() || empty_value,
                                          ev             = true,  top()    = operators[operators.length - 1],

                                          precedence(t)  = apply() -then- precedence(t) -when [t /!right ? top().r < t.l : top().r <= t.l] -when- operators.length,
                                          operator(t)    = precedence(t) -then- operators /~push/ t /then [ev = true] /unless [t.i],

                                          observe(t)     = t.v ? observe(join) /unless.ev -then [ev = false] -then- values /~push/ new syntax(t.id)
                                                         : t.o ? observe(join) /unless.ev -then [ev = true]  -then- operators /~push/ t
                                                         : t.c ? apply_closer()           -then [ev = false] -then [top().i ? operators.pop() : apply()]
                                                         : t.u ? observe(join) /unless.ev                    -then- operator(t)
                                                               : operator(t),

                                          apply()        = top().u ? values /~push/ new syntax(operators.pop().id, [value()])
                                                                   : values /~push/ new syntax(operators.pop().id, [y, x]) -where [x = value(), y = value()],

                                          apply_closer() = apply() -then- apply_closer() -unless [!operators.length || top().o],
                                          apply_all()    = operators.length ? apply() -then- apply_all() : values[values.length - 1]]]});