// kind of sensing that it would be nice to have a spec for the relations object form.
// ..similar to what we do for DF
// coulbe interesting, with a bunch of conditionals and sub formats


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



module.exports.getThings = _getThings;
