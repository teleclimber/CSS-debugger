const definitions = require( '../concepts/definitions.js' );

// kind of sensing that it would be nice to have a spec for the relations object form.
// ..similar to what we do for DF
// coulbe interesting, with a bunch of conditionals and sub formats

function _augmentWithFilter( obj, match_filter ) {
	const local_match = _augment( obj );
	if( match_filter ) {
		//console.log( 'match filter', match_filter );
		return {
			type: 'and',
			conditions: [match_filter, local_match]
		};
	}
	else return local_match;
}

function _augment( obj ) {
	// here we'd like to take each thing from the rules
	// and augment the object so that we know exactly what we are referring to
	// ..by checking with the concepts.
	// "augment" could just mean replacing the string name with something more complete
	// like PROP-display or PROPVAL-display-block
	// further details like whether we are dealing with specified or calculated
	// and whether we are dealing with actual value, or descriptive value ("negative"), or...

	let ret = {};
	if( obj._str ) ret._str = obj._str;

	switch( obj.type ) {
		case 'is':
			// here tempted to say that if it "is specified", then we should make the rule "specified"
			if( obj.right === 'specified' ) {
				ret.type = 'specified';
				if( !obj.left.every(definitions.isProperty) ) throw new Error( obj.left +' not all property' );
				ret.properties = obj.left;
				ret.negative = obj.negative;	// is this "not specified", or is it "prop is negative value"???
			}
			else {
				// here look at what is on the right and left and make sure they "align"
				// meaning if left is concept, then thing on the right has to apply to that concept, right?
				// if left is property, then right has to be one of its legit values or a qualifier
				if( obj.left.every(definitions.isProperty) ) {
					// assume it's <property's value> is <value> or <qualifier>
					ret.type = 'property-value-is';
					ret.properties = obj.left;

					//..examine rhs for appropriateness as prop value or value qualifier.
					//..it is jsut a prop, not an array
					const val_is_qual = definitions.getType(obj.right) === 'prop-value-qualifier';
					if( !val_is_qual
					 	&& !obj.left.every( (p) => definitions.isPropertyValue(p, obj.right) ) ) {
						throw new Error( 'prop value is neither qualifier or recognized: '+obj.right );
					}

					if( val_is_qual ) ret.qualifier = obj.right;
					else ret.value = obj.right;

					ret.negative = obj.negative;
				}
				else if( obj.left.every(definitions.isConcept) ) {
					ret.type = 'concept-is';

					if( obj.left.length !== 1 ) throw new Error( 'more than one concept in match '+obj.left.join(', ') );
					ret.concept = obj.left[0];

					if( !definitions.appliesToConcept(obj.right, ret.concept) ) console.warn( obj.right+' does not apply to '+ ret.concept );
					// ^^ prob need to put a finer point on concepts.
					//
					ret.is = obj.right;

					ret.negative = obj.negative;
				}
			}
			break;

		case 'in':
			// this becomes "speicifed"
			ret.type = 'specified';
			// left has to be a prop?
			// .....left is an array
			if( !obj.left.every(definitions.isProperty) ) throw new Error( obj.left +' not all property' );
			ret.properties = obj.left;

			if( !definitions.isValueUnit(obj.right) ) throw new Error( obj.right + ' is not a unit' );
			ret.unit = obj.right;

			break;

		case 'and':
			ret.type = 'and';
			ret.conditions = obj.conditions.map( _augment );
			break;

		case 'or':
			ret.type = 'or';
			ret.conditions = obj.conditions.map( _augment );
			break;

		case 'group':
			ret.type = 'group';
			ret.group = _augment( obj.group );
			break;

		default: throw new Error( 'what is this type? '+obj.type );
	}

	return ret;
}


function _getThings( obj ) {
	if( typeof obj === 'string' ) return [obj];

	let ret = [];

	switch( obj.type ) {
		case 'is':
			ret = ret.concat( obj.left );
			ret.push( obj.right );
			break;

		case 'in':
			ret = ret.concat( obj.left );
			ret.push( obj.right );
			break;

		case 'and':
			ret = obj.conditions.map( _getThings ).reduce( (acc,things) => acc.concat(things) );
			break;

		case 'or':
			ret = obj.conditions.map( _getThings ).reduce( (acc,things) => acc.concat(things) );
			break;

		case 'group':
			ret = _getThings( obj.group );
			break;

		default: throw new Error( 'what is this type? '+obj.type );
	}


	return ret;
}

// test some things:
const test_obj = {
	type: 'and',
	conditions: [
		{
			type: 'is',
			left: ['a','z'],
			right: 'b'
		},
		{
			type: 'is',
			left: 'cxx',
			right: 'd'
		}
	]
}

//console.log( _getThings(test_obj));


module.exports.augment = _augmentWithFilter;
module.exports.getThings = _getThings;
