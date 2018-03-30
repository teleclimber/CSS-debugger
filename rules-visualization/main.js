import AllRules from './svelte/AllRules.html';

document.addEventListener( 'DOMContentLoaded', async function() {
	const rules_data = await loadRules();
	console.log( 'rules data', rules_data );

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
