// ok, so not clear, but I think that as we parse rules we should register
// props and what not that we come across.

const _properties = {};
// const _prop_values = {};	//map back to relevant prop???
// ..seriously. prop value independent of prop name is not useful

const _concepts = {};

//const global_prop_values = ['auto', 'inherit'];
// ^^ what is the point of this? If a prop accepts the value, then cool if not then not.

const _prop_value_units = {
	'percent':		{ desc: 'Property value specified in percent.' },
	'percentage':	{ alias: 'percent' },
	'percentages':	{ alias: 'percent' },
};
const _prop_value_qualifiers = {
	'specified':	{ desc: 'property value has been specified. (what about specifying as auto?)' },
	'length':		{ },

	'integer':		{ desc: 'value is an int.' },
	'negative':		{ desc: 'value is less than 0. (implies it is numeric?)' }
};

// also:
// - negative (can apply to length, percentage, integer)
// - percentages -> synonym of percentage, percent

// you'll want to catch situations where a concept/whatever appears in matches
// ..but never in relations.
// -> if never in relations, then never set. If never set, then unused, nonsensical

function _registerProperty( obj ) {
	const names = typeof obj.name === 'string' ? [obj.name] : obj.name;

	names.forEach( (n) => {
		if( n in _properties ) throw new Error( n+' already exists as property' );	//actually, we may need to allow this when properties are given new possible values
		_properties[n] = obj;
	});

	// obj.value.forEach( (v) => {
	// 	if( !global_prop_values.includes(v) && !prop_value_qualifiers.includes(v) ) {
	// 		if( v in _prop_values ) throw new Error( 'prop value exists already '+v );
	// 		// ^^ this is automatic fail... float: left, clear: left
	// 		// going to have to allow, but it's not an issue
	// 		//..because I don't we should allow referencing a prop value with explicitly
	// 		// ..mentioning the prop name.
	// 		_prop_values[v] = obj;
	// 	}
	// });
}
function _registerConcept( obj ) {
	const n = obj.name;
	if( n in _concepts ) throw new Error( n+' already exists as concept' );

	if( obj['applies-to'] && !(obj['applies-to'] in _concepts) ) throw new Error( n+'\'s applies to '+ obj['applies-to']+' not in concepts?' );

	_concepts[n] = obj;
}

function _getType( name ) {
	//if( global_prop_values.includes(name) ) return 'global-prop-value';
	if( _prop_value_qualifiers[name] ) return 'prop-value-qualifier';
	if( name in _concepts ) return 'concept';
	//if( name in _prop_values ) return 'prop-value';
	if( name in _properties ) return 'property';
}
// also troublesome:
// width and height (% is rel to width of containing block)
// ^^ yeah this has to be rethought!!
// Type inferred from use, then checked to see if it exists as that type.

function _isProperty( name ) {
	return !!_properties[name];
}
function _isPropertyValue( prop, val ) {
	return _properties[prop] && _properties[prop].value.includes(val);
}
function _isValueUnit( name ) {
	return !!_prop_value_units[name];
}
function _isConcept( name ) {
	return !!_concepts[name];
}
function _appliesToConcept( concept, applies_to_concept ) {
	return _concepts[concept] && _concepts[concept]['applies-to'] === applies_to_concept;
}


function _getConcepts() {
	return _concepts;
}
function _getProperties() {
	return _properties;
}

module.exports.registerProperty = _registerProperty;
module.exports.registerConcept = _registerConcept;
module.exports.getType = _getType;
module.exports.isProperty = _isProperty;
module.exports.isPropertyValue = _isPropertyValue;
module.exports.isValueUnit = _isValueUnit;
module.exports.isConcept = _isConcept;
module.exports.appliesToConcept = _appliesToConcept;

module.exports.getConcepts = _getConcepts;
module.exports.getProperties = _getProperties;
