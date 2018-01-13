// load tests.yaml
// run each through parser
// ..then through our secondary interpreter
// .. then pump it out htrough our visualizer


const fs = require( 'fs' );
const js_yaml = require( 'js-yaml' );
const match_compiler = require( '../../grammar/match.js' );

let test_data;

console.log(`Current directory: ${process.cwd()}`);

// Get document, or throw exception on error
try {
  test_data = js_yaml.safeLoad(fs.readFileSync('test/grammar/tests.yaml', 'utf8'));
  console.log( test_data );
} catch (e) {
  console.log(e);
}

//
console.log( 'Basic:' );
test_data.Basic.forEach( (t) => {
	console.log( t );
	const res = match_compiler.compile(t);
	console.log( 'built out:' );
	console.dir( res, { depth: 8, colors: true } );
});
