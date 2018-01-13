/* *** this is for the match *** */

const nearley = require( 'nearley' );
const basic_grammar = require( './compiled/basic-match.js' );

const _dir_opts = { depth: 8, colors: true };

function _compile( str ) {
	const parser = new nearley.Parser( nearley.Grammar.fromCompiled(basic_grammar) );
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
	// so here we want to to further interpret result.
	// - make or-values as a set of successive or-conditions
	// - make everything a "group", with a group type (and|or), and array of conditions

	return _build( parsed );
}

function _build( p ) {
	p = _deArray( p );

	if( typeof p === 'string' ) 		return p;
	else if( p.type === 'is' )			return _build_Is( p );
	else if( p.type === 'in' )			return _build_In( p );
	else if( p.type === 'and' ) 		return _build_And( p );
	else if( p.type === 'or' )			return _build_Or( p );
	else if( p.type === 'group' )		return _build_Group( p );
	else if( p.type === 'or-values' )	return _build_OrValues( p );


	else throw new Error( 'what is this parsed thing? '+p );
}

function _build_Is( obj ) {
	let ret;

	let base = {
		type: 'is',
		left: _build_Thing( obj.left ),
		negative: obj.negative,
		specified: obj.specified
	};

	const rhs = _build( obj.right );
	if( rhs.type === 'or-values' ) {
		ret = {
			type: obj.negative ? 'and' : 'or',
			conditions: rhs.or_values.map( (o) => {
				return Object.assign( {right: o}, base );
			})
		};
	}
	else {
		return Object.assign( {right: rhs}, base );
	}

	return ret;
}
function _build_In( obj ) {
	// check on left
	// -> there are two possible constructs and there are potential modifiers

	let ret;

	const rhs = _build( obj.right );
	if( rhs.type === 'or-values' ) {
		ret = {
			type: 'or',
			conditions: rhs.or_values.map( (o) => {
				return {
					type: 'in',
					left: _build_Thing( obj.left ),
					specified: obj.mod === 'specified',
					right: o
				};
			})
		};
	}
	else {
		return {
			left: _build_Thing( obj.left ),	//prob need to process this
			specified: obj.mod === 'specified',
			type: 'in',
			right: rhs
		};
	}

	return ret;
}
function _build_And( obj ) {
	//successive "And" are joined, yes?

	const conds = [ _build(obj.left) ];		//could be a prens I guess?

	let it = obj.right;
	while( it && (it.type === 'and' || it.type === 'group') ) {
		if( it.type === 'and' ) conds.push( _build(it.left) );
		else conds.push( _build(it.cond) );

		it = it.right;
	}
	if( it ) conds.push( _build(it) );

	return {
		type: 'and',
		conditions: conds
	};
}
function _build_Or( obj ) {
	// successive "ors" are joined, yes?
	const conds = [ _build(obj.left) ];		//could be a prens I guess?

	let it = obj.right;
	while( it && (it.type === 'or' || it.type === 'group') ) {
		if( it.type === 'or' ) conds.push( _build(it.left) );
		else conds.push( _build(it.cond) );

		it = it.right;
	}
	if( it ) conds.push( _build(it) );

	return {
		type: 'or',
		conditions: conds
	};
}
function _build_Group( obj ) {
	//throw new Error( 'we don not have groups working yet.' );
	return {
		type: 'group',
		group: _build( obj.cond )
	};
}
function _build_OrValues( obj ) {
	if( typeof obj.left !== 'string' ) throw new Error( 'left of or_value not string?!?' );

	let it = obj.right;
	const or_values = [obj.left];
	while( typeof it === 'object' ) {
		if( it.type !== 'or-values' ) throw new Error( 'non or-values ot the right of or-values' );
		or_values.push( it.left );
		it = it.right;
	}
	or_values.push( it );

	return {
		type: 'or-values',
		or_values: or_values
	};
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

//_compile( 'tag is div or span or img' );

module.exports.compile = _compile;
