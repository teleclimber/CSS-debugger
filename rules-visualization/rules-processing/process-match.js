
const _match_functions = {
	'specified': _matchSpecified,
	'property-value-is': _matchPropertyValueIs,
	'concept-is': _matchConceptIs,
	'and': _matchAnd,
	'or': _matchOr
};

function _matchPart( match, specified, computed, concepts ) {
	if( _match_functions[match.type] ) {
		return _match_functions[match.type]( match, specified, computed, concepts );
	}
	else {
		//not implemented
		console.warn( 'Match type not implemented '+match.type, match );
	}
}

function _matchSpecified( match_rule, specified, computed ) {
	// lok at specified object
	let ret;
	const matches = [];
	for( let prop in specified ) {
		if( match_rule.properties.includes(prop) ) {
			// ok it's in the list, but what if it's "auto"? does that count as specificed?
			// here we should parse the value
			const invert = !!match_rule.negative;

			if( match_rule.unit ) {
				if( match_rule.unit.startsWith('percent') ) {
					// unit is %, so look for that in prop value
					if( specified[prop].includes('%') ) {
						matches.push( {
							property: prop,
							unit: '%'
						});
						// look at negative here too
					}
				}
			}
			else {
				// whether it's specified, regardless of units
				matches.push( {
					property: prop
				});

			}
		}
	}

	if( matches.length && !match_rule.negative ) {
		ret = {
			matches: matches,
			match: match_rule
		}
	}
	else if( !matches.length && match_rule.negative ) {
		ret = {
			matches: [],	//what do we match on exactly? everything?
			match: match_rule
		}
	}

	return ret;
}

function _matchPropertyValueIs( match_rule, specified, computed ) {
	let ret;
	const matches = [];
	for( let prop in computed ) {
		if( match_rule.properties.includes(prop) ) {
			// ok it's in the list, but what if it's "auto"? does that count as specificed?
			// here we should parse the value. Or it should have been parsed before

			if( match_rule.qualifier ) {
				// look for a negative value for prop
				if( match_rule.qualifier === 'negative' ) {
					// look for negative value;
					if( computed[prop].includes('-') ) {	// Whoa that is just wrong!!
						if( !match_rule.negative ) matches.push( {	property: prop } );
					}
					else {
						if( match_rule.negative ) matches.push( {	property: prop } );
					}
				}
				else console.warn( 'property-value-is <qualifier!=negative> is not implemented yet. Qualifier: '+match_rule.qualifier, match_rule );
			}
			else if( match_rule.value ) {
				const is_match = computed[prop] === match_rule.value;
				if( (is_match && !match_rule.negative) || (!is_match && match_rule.negative) ) {
					matches.push( {	property: prop } );
				}
			}
		}
	}

	if( matches.length ) {
		ret = {
			matches: matches,
			match: match_rule
		}
	}

	return ret;
}

function _matchConceptIs( match_rule, specified, computed, concepts ) {
	// only one concept (unlike props)
	// is is one thing
	// possibly invert the match.
	let ret;

	const concept = match_rule.concept;
	const is = match_rule.is;
	const is_match = concepts[concept] && concepts[concept][is];

	if( (is_match && !match_rule.negative) || (!is_match && match_rule.negative) ) {
		ret = {
			match: match_rule
		}
	}

	return ret;
}

function _matchAnd( match_rule, specified, computed, concepts ) {
	let ret;
	//basically for each condition
	const results = match_rule.conditions.map( (r) => {
		return _matchPart( r, specified, computed, concepts );
	});

	if( !results.includes(undefined) ) {
		ret = {
			match: match_rule,
			conditions: results
		}
	}

	return ret;
}
function _matchOr( match_rule, specified, computed, concepts ) {
	let ret;

	const results = match_rule.conditions.map( (r) => {
		return _matchPart( r, specified, computed, concepts );
	});

	if( results.find(r => !!r) ) {
		ret = {
			match: match_rule,
			conditions: results
		}
	}

	return ret;
}

module.exports = _matchPart;
