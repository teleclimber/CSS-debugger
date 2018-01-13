// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Relation$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$subexpression$1$subexpression$1", "symbols": ["Relation$subexpression$1$subexpression$1$string$1"]},
    {"name": "Relation$subexpression$1$subexpression$1$string$2", "symbols": [{"literal":"a"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$subexpression$1$subexpression$1", "symbols": ["Relation$subexpression$1$subexpression$1$string$2"]},
    {"name": "Relation$subexpression$1$string$1", "symbols": [{"literal":" "}, {"literal":"r"}, {"literal":"e"}, {"literal":"l"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"v"}, {"literal":"e"}, {"literal":" "}, {"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$subexpression$1", "symbols": ["Relation$subexpression$1$subexpression$1", "Relation$subexpression$1$string$1"]},
    {"name": "Relation$ebnf$1$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"o"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$ebnf$1$subexpression$1$subexpression$1", "symbols": ["Relation$ebnf$1$subexpression$1$subexpression$1$string$1"]},
    {"name": "Relation$ebnf$1$subexpression$1$subexpression$1$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$ebnf$1$subexpression$1$subexpression$1", "symbols": ["Relation$ebnf$1$subexpression$1$subexpression$1$string$2"]},
    {"name": "Relation$ebnf$1$subexpression$1", "symbols": ["_", "Relation$ebnf$1$subexpression$1$subexpression$1", "_", "Name"]},
    {"name": "Relation$ebnf$1", "symbols": ["Relation$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Relation$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Relation", "symbols": ["Thing", "_", "Relation$subexpression$1", "_", "Name", "Relation$ebnf$1"], "postprocess":  function(d) {
        	let ret = { type: 'to', subject: d[0] };
        	if( d[5] ) {
        		ret.to_prop = d[4];
        		ret.to = d[5][3];
        	}
        	else {
        		ret.to = d[4];
        	}
        	return ret;
        } },
    {"name": "Relation$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation", "symbols": ["Thing", "_", "Relation$string$1", "_", "Name"], "postprocess": function(d) { return { type:'is', subject: d[0], is: d[4] }; }},
    {"name": "Relation$subexpression$2$subexpression$1$string$1", "symbols": [{"literal":"d"}, {"literal":"o"}, {"literal":"e"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$subexpression$2$subexpression$1", "symbols": ["Relation$subexpression$2$subexpression$1$string$1"]},
    {"name": "Relation$subexpression$2$subexpression$1$string$2", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$subexpression$2$subexpression$1", "symbols": ["Relation$subexpression$2$subexpression$1$string$2"]},
    {"name": "Relation$subexpression$2$string$1", "symbols": [{"literal":" "}, {"literal":"n"}, {"literal":"o"}, {"literal":"t"}, {"literal":" "}, {"literal":"a"}, {"literal":"p"}, {"literal":"p"}, {"literal":"l"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation$subexpression$2", "symbols": ["Relation$subexpression$2$subexpression$1", "Relation$subexpression$2$string$1"]},
    {"name": "Relation", "symbols": ["Thing", "_", "Relation$subexpression$2"], "postprocess": function(d) { return { type: 'dna', subject: d[0] }; }},
    {"name": "Relation$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"m"}, {"literal":"p"}, {"literal":"u"}, {"literal":"t"}, {"literal":"e"}, {"literal":"s"}, {"literal":" "}, {"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Relation", "symbols": ["Thing", "_", "Relation$string$2", "_", "Name"], "postprocess": function(d) { return { type: 'comp', subject: d[0], is: d[4] }; }},
    {"name": "Thing$ebnf$1$subexpression$1", "symbols": [{"literal":"/"}, "Thing"]},
    {"name": "Thing$ebnf$1", "symbols": ["Thing$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Thing$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Thing", "symbols": ["Name", "Thing$ebnf$1"], "postprocess":  function(d) {
        	return { thing:d[0], other_things: d[1]? d[1][1] : null };
        } },
    {"name": "Name$ebnf$1", "symbols": [/[a-zA-Z_\-]/]},
    {"name": "Name$ebnf$1", "symbols": ["Name$ebnf$1", /[a-zA-Z_\-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Name", "symbols": ["Name$ebnf$1"], "postprocess": function(d) { return d[0].join(""); }},
    {"name": "_$ebnf$1", "symbols": [/[\s]/]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Relation"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
