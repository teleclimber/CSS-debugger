"use strict";

const fs = require( 'fs' );
const js_yaml = require( 'js-yaml' );
const compiler = require( './grammar/index.js' );

const rules = [
	'rules/basics.yaml',
	'rules/CSS2r1/08-box-model.yaml',
	'rules/CSS2r1/09-visual-formatting-model.yaml',

	'rules/CSS2r1/11-visual-effects.yaml'
];
const parsed_rules = {};

rules.forEach( (r) => {
	let yaml_rules;
	try {
		yaml_rules = js_yaml.safeLoad(fs.readFileSync(r, 'utf8'));
		//console.log( yaml_rules );
	} catch (e) {
		console.log(e);
		throw new Error( 'yaml processing error in '+r );
	}

	compiler.buildFromYaml( yaml_rules );	//modifies in place

	parsed_rules[r] = yaml_rules;
});

//////////
// go deeper.
// thinking we should walk all the rules, and look for concepts and property declarations
// store these somewhere
// then walk again and determine exactly what the things found in  match and relation refer to.

const traverse_relation = require( './traverse/traverse_relation.js' );
const traverse_match = require( './traverse/traverse_match.js' );
const definitions = require( './concepts/definitions.js' );

const keys = ['ref', 'match', 'relation', 'warning', 'comment'];

_walk( parsed_rules, (obj, path) => {
	if( obj.property ) {
		definitions.registerProperty( obj.property );
	}
	if( obj.concept ) {
		definitions.registerConcept( obj.concept );
	}

	return true;
});

// walk again
// instead of just fetching things blindly
// augment the rules object
const rules_list = [];
_walk( parsed_rules, (obj, path, match_filter) => {
	//console.log( 'match_filter', match_filter );
	if( obj.match ) {
		try {
			obj.match = traverse_match.augment( obj.match, match_filter );
		}
		catch(e) {
			console.log( path );
			console.log( obj.match._str );
			throw e;
		}
	}
	if( obj.relation ) {
		try {
			obj.relation = traverse_relation.augment( obj.relation );
		}
		catch(e) {
			console.log( path );
			console.log( obj.relation._str );
			throw e;
		}
	}

	if( obj.relation || obj.warning || obj.error ) {
		rules_list.push( {
			path: path,
			match: obj.match,
			relation: obj.relation,
			warning: obj.warning,
			error: obj.error
		} );
		//...OK but this doesn't work because of "filter matches"
		// ' wegotta incorporate filter matches above in augmentation. '
		// ' see 9.7 for a filter match example'
	}

	return true;
});

// can we then package the rules a bit better?
// - list of concepts
// - list of preoperties
// - array of rules, with path, _strs(?), and augmented match, warns, and relations

const built = {
	concepts: definitions.getConcepts(),
	properties: definitions.getProperties(),
	rules: rules_list
};
// ^^ok, I think we basically have it here.
// ..need to have an easy way to visualize the built rules so we can check correctness
// .. and then verify each thing gets set somewhere.


//console.log( JSON.stringify(built) );

const path = require( 'path' );
const jsonfile = require( 'jsonfile' );
jsonfile.writeFileSync( path.resolve(__dirname,'build/rules.json'), built );


////////////////////
function _walk( obj, cb, path, match_filter ) {
	if( !path ) path = '';
	for( let k in obj ) {
		if( !keys.includes(k) && typeof obj[k] === 'object' ) {
			const next_path = path + k + (obj[k] && obj[k].ref ? ` (${obj[k].ref})` : '');
			const cb_ret = cb( obj[k], next_path, match_filter );
			if( cb_ret ) {
				let m = match_filter;
				if( obj[k].match ) m = obj[k].match;
				_walk( obj[k], cb, next_path+' > ', m );
			}
		}
	}
}
