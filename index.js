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



/////////////////////////////////////
const traverse_relation = require( './traverse/traverse_relation.js' );
const traverse_match = require( './traverse/traverse_match.js' );
const definitions = require( './concepts/definitions.js' );

const keys = ['ref', 'match', 'relation', 'warning', 'comment'];

const all_things = {};

if( parsed_rules ) {
	_walk( parsed_rules, (obj, path) => {
		if( obj.property ) {
			definitions.registerProperty( obj.property );
			if( Array.isArray(obj.property.name) ) {
				obj.property.name.forEach( (n) => {
					_addThing( n, { 'found in':'property', path:path } );
				});
			}
			else {
				_addThing( obj.property.name, { 'found in':'property', path:path } );
			}
		}
		if( obj.concept ) {
			definitions.registerConcept( obj.concept );
			_addThing( obj.concept.name, { 'found in':'concept', path:path } );
		}
		if( obj.match ) {
			let things = traverse_match.getThings( obj.match );
			things.forEach( (t) => { _addThing( t, {'found in':'match', path:path, str:obj.match._str} ); } );
		}
		if( obj.relation ) {
			let things = traverse_relation.getThings( obj.relation );
			things.forEach( (t) => { _addThing( t, {'found in':'relation', path:path, str:obj.relation._str} ); } );
		}

		return true;
	});
}

const out = {};
for( let k in all_things ) {
	let found = false;

	const type = definitions.getType( k ) || 'lost';
	if( !(type in out) ) out[type] = {};
	out[type][k] = all_things[k];
}
console.log( JSON.stringify(out) );

function _walk( obj, cb, path ) {
	if( !path ) path = '';
	for( let k in obj ) {
		if( !keys.includes(k) && typeof obj[k] === 'object' ) {
			const next_path = path + k + (obj[k] && obj[k].ref ? ` (${obj[k].ref})` : '');
			const cb_ret = cb( obj[k], next_path );
			if( cb_ret ) _walk( obj[k], cb, next_path+' > ' );
		}
	}
}

function _addThing( thing, data ) {
	if( !all_things[thing] ) all_things[thing] = [];
	all_things[thing].push( data );
}
