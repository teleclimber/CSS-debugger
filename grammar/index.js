// Here we have the ability to take a YAML data
// ..and parse it completely
// ..into an object

const match_compiler = require( './match.js' );
const relation_compiler = require( './relation.js' );

function buildFromYaml( yaml_data ) {
	_explore( yaml_data );
}
function _explore( data, cur_ref ) {
	if( Array.isArray(data) ) {
		throw new Error( 'unexpected array' );
	}
	if( typeof data === 'object' ) {
		_exploreObject( data, cur_ref );
	}
}
function _exploreObject( obj, cur_ref ) {
	for( let k in obj ) {
		if( k === 'ref' ) {
			// let's track cur ref so we can echo it on error?
			cur_ref = obj[k];
		}
		else if( k === 'property' ) {
			obj[k] = _getProperty( obj[k], cur_ref );
		}
		else if( k === 'concept' ) {
			obj[k] = _getConcept( obj[k], cur_ref );
		}
		else if( k === 'match' ) {
			obj[k] = _getMatch( obj[k], cur_ref );
		}
		else if( k === 'relation' ) {
			obj[k] = _getRelation( obj[k], cur_ref );
		}
		else if( k === 'warning' ) {
			// I think we use this?
		}
		else if( k === 'error' ) {
			// I think we use this?
		}
		else {
			_explore( obj[k], cur_ref );
		}
	}
}

function _getProperty( obj, ref ) {
	if( typeof obj !== 'object' ) throw new Error( 'properry is not ref at '+ref );
	if( !obj.name ) throw new Error( 'property has no name at '+ref );

	if( obj.inherited === 'no' ) obj.inherited = false;
	else if( obj.inherited === 'yes' ) obj.inherited = true;
	else if( typeof obj.inherited !== 'boolean' ) throw new Error( 'property inherited value should be yes or no or boolean' );

	return obj;
}
function _getConcept( obj, ref ) {
	if( typeof obj !== 'object' ) throw new Error( 'properry is not ref at '+ref );
	if( !obj.name ) throw new Error( 'property has no name at '+ref );

	return obj;
}

function _getMatch( str, ref ) {
	let res;
	try {
		res = match_compiler.compile( str );
	}
	catch (e) {
		console.log( `error compiling match at ${ref}: ${str}` );
		console.log( e.message );
		res = { error: 'Could not parse match: '+str };
	}
	return res;
}
function _getRelation( str, ref ) {
	let res;
	try {
		res = relation_compiler.compile( str );
	}
	catch (e) {
		console.log( `error compiling relation at ${ref}: ${str}` );
		console.log( e.message );
		res = { error: 'Could not parse match: '+str };
	}
	return res;
}

module.exports.buildFromYaml = buildFromYaml;
