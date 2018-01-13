// basically call back when you hit interesting things?

// for this it's easy. Relations are pretty straightforward.

// seriously just throwing callbacks for this rule object is pointless!
// it just means to caller has to sort out what kind of rulesa it's getting,
// ..so it gets to deal with the whole logic of it. No point.

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

module.exports.getThings = _getThings;
