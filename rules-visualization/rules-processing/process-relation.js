
const _rel_functions = {
	'relative-to': null,
	'is-concept': _isConcept,
	'property-does-not-apply': null,
	'property-computes-to': null
};

function _processRelation( rel, match_results, concepts ) {
	if( _rel_functions[rel.type] ) {
		return _rel_functions[rel.type]( rel, match_results, concepts );
	}
	else {
		console.warn( 'process relation type not imtplemented: '+rel.type, rel );
	}
}

function _isConcept( rel, match_results, concepts ) {
	// here we want to modify concept
	// But also watch that we don't overwrite it
	// ..because that would imply something wrong
	let ret;

	const concept = rel.subject;
	const is = rel.is;

	if( !concepts[concept] ) concepts[concept] = {};

	//if( concepts[concept][is] ) console.warn( `Writing concept again: ${concept}:${is}` );
	if( !concepts[concept][is] ) {
		concepts[concept][is] = true;
		ret = true;
	}

	return ret; 	//if we modify concept return true;
}

module.exports = _processRelation;
