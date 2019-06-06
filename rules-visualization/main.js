import AllRules from './svelte/AllRules.html';
const rules_processing = require( './rules-processing/rules-processing.js' );

document.addEventListener( 'DOMContentLoaded', async function() {
	CSSUtilities.define("async", false);
	CSSUtilities.init();

	const rules_data = await loadRules();
	console.log( 'rules data', rules_data );
	rules_processing.init( rules_data );

	const test_elem = document.getElementById( 'test-element' );
	const specified = CSSUtilities.getCSSProperties( test_elem );
	console.log( 'specified', specified );

	const computed = getComputed( test_elem, Object.keys(rules_data.properties) );

	const concepts = {};

	const results = rules_processing.process( specified, computed, concepts );
	console.log( 'results', results );

	//const links = makeLinks( rules_data );

	console.log( 'rules', rules_data.rules );

	//svelte?
	const app = new AllRules( {
		target: document.getElementById( 'rules-list' ),
		data: {
			rules: rules_data.rules
		}
	});
});

async function loadRules() {
	return new Promise( function(resolve, reject) {
		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', '../build/rules.json', true );
		xhr.onreadystatechange = function() {
		    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				console.log( 'got rules' );
				let rules_data;
				try {
					rules_data = JSON.parse( xhr.responseText );
					resolve( rules_data );
				}
				catch(e) {
					reject();
				}
		    }
			else {
				//console.log( 'rejecting ')
				//reject();
			}
		};
		xhr.send();
	});
}

function getComputed( elem, props ) {
	const ret = {};
	const computed = window.getComputedStyle( elem );
	props.forEach( (p) => {
		ret[p] = computed.getPropertyValue(p);
	});
	return ret;
}
