// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Match", "symbols": ["condition"], "postprocess": function(d) { return d[0] }},
    {"name": "Match", "symbols": ["and_conditions"], "postprocess": function(d) { return d[0] }},
    {"name": "Match", "symbols": ["or_conditions"], "postprocess": function(d) { return d[0] }},
    {"name": "condition$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition$ebnf$1$subexpression$1", "symbols": ["condition$ebnf$1$subexpression$1$string$1", "_"]},
    {"name": "condition$ebnf$1", "symbols": ["condition$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition$ebnf$2$subexpression$1$string$1", "symbols": [{"literal":"s"}, {"literal":"p"}, {"literal":"e"}, {"literal":"c"}, {"literal":"i"}, {"literal":"f"}, {"literal":"i"}, {"literal":"e"}, {"literal":"d"}, {"literal":" "}, {"literal":"a"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition$ebnf$2$subexpression$1", "symbols": ["condition$ebnf$2$subexpression$1$string$1", "_"]},
    {"name": "condition$ebnf$2", "symbols": ["condition$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["thing", "_", "condition$string$1", "_", "condition$ebnf$1", "condition$ebnf$2", "value"], "postprocess":  function(d) {
        	return {
        		type:'is',
        		left: d[0],
        		right: d[6],
        		negative: !!d[4],
        		specified: !!d[5]
        	};
        } },
    {"name": "condition$ebnf$3$subexpression$1$string$1", "symbols": [{"literal":"s"}, {"literal":"p"}, {"literal":"e"}, {"literal":"c"}, {"literal":"i"}, {"literal":"f"}, {"literal":"i"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition$ebnf$3$subexpression$1", "symbols": ["condition$ebnf$3$subexpression$1$string$1", "_"]},
    {"name": "condition$ebnf$3", "symbols": ["condition$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition", "symbols": ["thing", "_", "condition$ebnf$3", "condition$string$2", "_", "value"], "postprocess":  function(d) {
        	// what  is the point of "specified"? "in" will always be "specified", right?
        	//console.dir( d, {depth:10} );
        	return {type:'in', left: d[0], right: d[5], mod: d[2] ? d[2][0] : null };
        } },
    {"name": "thing$ebnf$1$subexpression$1", "symbols": [{"literal":"/"}, "thing"]},
    {"name": "thing$ebnf$1", "symbols": ["thing$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "thing$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "thing", "symbols": ["name", "thing$ebnf$1"], "postprocess":  function(d) {
        	return { thing:d[0], other_things: d[1]? d[1][1] : null };
        } },
    {"name": "value", "symbols": ["or_value"], "postprocess": function(d) { return d[0]; }},
    {"name": "value", "symbols": ["name"], "postprocess": function(d) { return d[0]; }},
    {"name": "parens$subexpression$1", "symbols": ["or_conditions"]},
    {"name": "parens$subexpression$1", "symbols": ["and_conditions"]},
    {"name": "parens", "symbols": [{"literal":"("}, "_?", "parens$subexpression$1", "_?", {"literal":")"}], "postprocess":  function(d) {
        	return { type: 'group', cond: d[2][0] };
        } },
    {"name": "or_value$string$1", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "or_value$subexpression$1", "symbols": ["or_value"]},
    {"name": "or_value$subexpression$1", "symbols": ["name"]},
    {"name": "or_value", "symbols": ["name", "_", "or_value$string$1", "_", "or_value$subexpression$1"], "postprocess":  function(d) {
        	const ors = [d[0]];
        	const d4 = d[4][0];
        	ors.push( d4 );
        	return { type: 'or-values', left:d[0], right:d[4][0] };
        } },
    {"name": "and_conditions$subexpression$1", "symbols": ["condition"]},
    {"name": "and_conditions$subexpression$1", "symbols": ["parens"]},
    {"name": "and_conditions$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "and_conditions$subexpression$2", "symbols": ["and_conditions"]},
    {"name": "and_conditions$subexpression$2", "symbols": ["condition"]},
    {"name": "and_conditions$subexpression$2", "symbols": ["parens"]},
    {"name": "and_conditions", "symbols": ["and_conditions$subexpression$1", "_", "and_conditions$string$1", "_", "and_conditions$subexpression$2"], "postprocess":  function(d) {
        	return { type: 'and', left: d[0][0], right: d[4][0] };
        } },
    {"name": "or_conditions$subexpression$1", "symbols": ["condition"]},
    {"name": "or_conditions$subexpression$1", "symbols": ["parens"]},
    {"name": "or_conditions$string$1", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "or_conditions$subexpression$2", "symbols": ["or_conditions"]},
    {"name": "or_conditions$subexpression$2", "symbols": ["condition"]},
    {"name": "or_conditions$subexpression$2", "symbols": ["parens"]},
    {"name": "or_conditions", "symbols": ["or_conditions$subexpression$1", "_", "or_conditions$string$1", "_", "or_conditions$subexpression$2"], "postprocess":  function(d) {
        	return { type: 'or', left: d[0][0], right: d[4][0] };
        } },
    {"name": "name$ebnf$1", "symbols": []},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z_\-\*]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": [/[a-zA-Z]/, "name$ebnf$1"], "postprocess":  function(d) {
        	//console.dir(d,{depth:6} );
        	return d[0] + d[1].join("");
        } },
    {"name": "_?$ebnf$1", "symbols": []},
    {"name": "_?$ebnf$1", "symbols": ["_?$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_?", "symbols": ["_?$ebnf$1"], "postprocess": function(d) {return null }},
    {"name": "_$ebnf$1", "symbols": [/[\s]/]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Match"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
