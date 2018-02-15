const definitions = require( '../concepts/definitions.js' );

// basically call back when you hit interesting things?

// for this it's easy. Relations are pretty straightforward.

// seriously just throwing callbacks for this rule object is pointless!
// it just means to caller has to sort out what kind of rulesa it's getting,
// ..so it gets to deal with the whole logic of it. No point.

function _augment( obj ) {
	let ret = {};
	if( obj._str ) ret._str = obj._str;

	switch( obj.type ) {
		case 'to':
			// x "relative to" y [of z]
			// x: margin, percent, left/right/top/bottom,
			// So: - margin is a prop
			// - percent is a unit
			// - left/right/top/bottom, prop names

			// y: width of containing-block
			//    position in normal-flow
			//    {null of} containing-block
			//    height of containing-block
			//    width or containing-block

			// Let's be strict: "relative to" assumes dimensional?

			if( !obj.subject.every( (s) => ['margin', 'left', 'right', 'top', 'bottom', 'percent'].includes(s) ) ) {
				throw new Error( 'subject of "relative to" not recognized' );
			}

			if( !['normal-flow', 'containing-block'].includes(obj.to) ) throw new Error( '"relative to thing": thing is not recognized '+obj.to );

			if( obj.to_prop && !['position','height','width'].includes(obj.to_prop) ) throw new Error( '"relative to prop of thing": prop is not recognized: '+obj.to_prop );

			ret.type = "relative-to";
			ret.subject = obj.subject;
			ret.to = obj.to;
			ret.to_prop = obj.to_prop;
			break;

		case 'is':
			// right now everything is "element is {concept}"
			if( obj.subject.length !== 1 || obj.subject[0] !== 'element' ) throw new Error( 'x is y, unrecognized x' );
			if( !definitions.isConcept(obj.is) ) throw new Error( '"x is y": expected y to be a concept: '+obj.is );

			ret.type = "is-concept";
			ret.subject = obj.subject;
			ret.is = obj.is;
			break;

		case 'dna':
			//does not apply. So presumably a property name?
			if( !obj.subject.every(definitions.isProperty) ) throw new Error( 'does not apply on non-property' );

			ret.type = 'property-does-not-apply';
			ret.subject = obj.subject;
			break;

		case 'comp':
			// subject is property, and

			if( !obj.subject.every(definitions.isProperty) ) throw new Error( '"x computes to y": expected x to be property name' );
			if( !obj.subject.every( (p) => definitions.isPropertyValue(p,obj.is) ) ) throw new Error( '"x computes to y": expected y to be valid value: '+obj.is );

			ret.type = "property-computes-to";
			ret.subject = obj.subject;
			ret.is = obj.is;
			break;

		default: throw new Error( 'what is this rule type ? '+obj.type );
	}

	return ret;
}


function _getThings( obj ) {
	const ret = [].concat( obj.subject );
	switch( obj.type ) {
		case 'to':
			ret.push( obj.to );
			if( obj.to_prop ) ret.push( obj.to_prop );
			break;

		case 'is':
			ret.push( obj.is );
			break;

		case 'dna':
			//nothing more to add
			break;

		case 'comp':
			ret.push( obj.is );
			break;

		default: throw new Error( 'what is this rule type ? '+obj.type );
	}

	return ret;
}

module.exports.augment = _augment;
module.exports.getThings = _getThings;
