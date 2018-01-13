Match -> condition 	{% function(d) { return d[0] } %}
		| and_conditions 		{% function(d) { return d[0] } %}
		| or_conditions 		{% function(d) { return d[0] } %}

condition -> thing _ "is" _ ("not" _):? ("specified as" _):? value {% function(d) {
	return {
		type:'is',
		left: d[0],
		right: d[6],
		negative: !!d[4],
		specified: !!d[5]
	};
} %}

condition -> thing _ ("specified" _):? "in" _ value {% function(d) {
	// what  is the point of "specified"? "in" will always be "specified", right?
	//console.dir( d, {depth:10} );
	return {type:'in', left: d[0], right: d[5], mod: d[2] ? d[2][0] : null };
} %}

thing -> name ("/" thing):?			{% function(d) {
	return { thing:d[0], other_things: d[1]? d[1][1] : null };
} %}

value -> or_value		{% function(d) { return d[0]; } %}
		| name			{% function(d) { return d[0]; } %}

parens -> "(" _? (or_conditions | and_conditions) _? ")"	{% function(d) {
	return { type: 'group', cond: d[2][0] };
} %}

or_value -> name _ "or" _ ( or_value | name )	{% function(d) {
	const ors = [d[0]];
	const d4 = d[4][0];
	ors.push( d4 );
	return { type: 'or-values', left:d[0], right:d[4][0] };
} %}

and_conditions -> ( condition | parens ) _ "and" _ ( and_conditions | condition | parens )	{% function(d) {
	return { type: 'and', left: d[0][0], right: d[4][0] };
} %}

or_conditions -> ( condition | parens ) _ "or" _ ( or_conditions | condition | parens )	{% function(d) {
	return { type: 'or', left: d[0][0], right: d[4][0] };
} %}

name -> [a-zA-Z] [a-zA-Z_\-\*]:*	{% function(d) {
	//console.dir(d,{depth:6} );
	return d[0] + d[1].join("");
} %}

_? -> [\s]:*				{% function(d) {return null } %}
_  -> [\s]:+				{% function(d) {return null } %}
