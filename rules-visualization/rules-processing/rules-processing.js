
const processMatch = require( './process-match.js' );
const processRelation = require( './process-relation.js' );

let _rules;
function _init( rules_data ) {
	_rules = rules_data.rules;
}
function _process( specified, computed, concepts ) {
	const results = [];
	let concepts_mod = false; ...instead of looking at this, order the rules such that we only need to interate over them once.
	_rules.forEach( (r) => {
		if( r.match ) {
			const match_result = processMatch( r.match, specified, computed, concepts );
			if( match_result ) {
				//const result = { match_result };

				if( r.relation ) {
					const rel_result = processRelation( r.relation, match_result, concepts );
					concepts_mod = concepts_mod || rel_result;
				}

				results.push( match_result );
			}
		}
	});
	console.log( 'concepts', concepts );
	return results;
}

module.exports.init = _init;
module.exports.process = _process;
