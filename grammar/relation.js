const nearley = require( 'nearley' );
const relation_grammar = require( './compiled/relation.js' );

const _dir_opts = { depth: 8, colors: true };

function _compile( str ) {
	const parser = new nearley.Parser( nearley.Grammar.fromCompiled(relation_grammar) );
	parser.feed( str );

	//console.log( 'parsed' );
	//console.dir( parser.results, _dir_opts );

	const ret = _buildOut( parser.results );
	ret._str = str;

	//console.log( 'built out' );
	///console.dir( ret, _dir_opts );

	return ret;
}

function _buildOut( parsed ) {

	return _build( parsed );
}

function _build( p ) {
	p = _deArray( p );

	if( typeof p === 'string' ) 		return p;
	else if( p.type === 'to' )			return _build_To( p );
	else if( p.type === 'is' )			return _build_Is( p );
	else if( p.type === 'dna' ) 		return _build_Dna( p );
	else if( p.type === 'comp' )		return _build_Comp( p );


	else throw new Error( 'what is this parsed thing? '+p );
}

function _build_To( obj ) {	//relative to
	let ret = {
		type: 'to',
		subject: _build_Thing( obj.subject ),
		to: obj.to,
		to_prop: obj.to_prop
	};

	return ret;
}
function _build_Is( obj ) {
	let ret = {
		type: 'is',
		subject: _build_Thing( obj.subject ),
		is: obj.is
	};

	return ret;
}
function _build_Dna( obj ) {	///does not apply
	let ret = {
		type: 'dna',
		subject: _build_Thing( obj.subject )
	};

	return ret;
}
function _build_Comp( obj ) {	//computes to
	let ret = {
		type: 'comp',
		subject: _build_Thing( obj.subject ),
		is: obj.is
	};

	return ret;
}

function _deArray( data ) {
	if( Array.isArray(data) ) {
		if( data.length === 0 ) return null;
		if( data.length === 1 ) return data[0];

		//error ambiguous parse.
		data.forEach( console.log );
		throw new Error( 'ambiguous!? ');
	}
	else return data;
}

function _build_Thing( data ) {
	const ret = [];
	while( data && data.thing ) {
		ret.push( data.thing );
		data = data.other_things;
	}
	return ret;
}

module.exports.compile = _compile;
