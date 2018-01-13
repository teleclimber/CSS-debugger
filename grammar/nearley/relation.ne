Relation -> Thing _ (("is"|"are") " relative to") _ Name (_ ("of" | "in") _ Name ):?
		{% function(d) {
			let ret = { type: 'to', subject: d[0] };
			if( d[5] ) {
				ret.to_prop = d[4];
				ret.to = d[5][3];
			}
			else {
				ret.to = d[4];
			}
			return ret;
		} %}
	| Thing _ "is" _ Name
		{% function(d) { return { type:'is', subject: d[0], is: d[4] }; } %}
	| Thing _ (("does" | "do") " not apply")
		{% function(d) { return { type: 'dna', subject: d[0] }; } %}
	| Thing _ "computes to" _ Name
		{% function(d) { return { type: 'comp', subject: d[0], is: d[4] }; } %}

Thing -> Name ("/" Thing):?			{% function(d) {
	return { thing:d[0], other_things: d[1]? d[1][1] : null };
} %}

Name -> [a-zA-Z_\-]:+		{% function(d) { return d[0].join(""); } %}

_  -> [\s]:+				{% function(d) {return null } %}
