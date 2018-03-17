// run: browserify devtools-extension/panel-src/index.js -o devtools-extension/dist/panel-src.js

"use strict";

let eval_script = '';

let CSSUtils_str = '';
let xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('panel-src/CSSUtilities.txt'), true);
xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
		CSSUtils_str = xhr.responseText;
		console.log( 'got CSSUtils '+CSSUtils_str.substring(0,100) );

		buildEvalScript();
    }
};
xhr.send();


function buildEvalScript() {
	const eval_computed_props = [
		'display',
		'margin-left',
		'margin-top',
		'margin-right',
		'margin-bottom',
		'overflow',
		'padding-left',
		'padding-top',
		'padding-right',
		'padding-bottom'
	];
	eval_script = CSSUtils_str
		+ '(function() { \n'
		+ 'if( !$0 ) return null; \n'
		+ 'const ret = { computed:{}, specified:{} }; \n'
		+ 'const computed = getComputedStyle($0); \n';
	eval_computed_props.forEach( (p) => {
		eval_script += `ret.computed["${p}"] = computed.getPropertyValue("${p}");`;
	});

	//eval_script += 'try {'+ CSSUtils_str +'} catch(e) { ret.CSSU_err = "yes"; } \n';
	eval_script += 'ret.CSSU_obj_exists = !!window.CSSUtilities;\n';
	eval_script += 'CSSUtilities.define("async", false); CSSUtilities.init(); \n';
	eval_script += 'ret.all_rules = CSSUtilities.getCSSRules($0); \n';
	eval_script += 'ret.specified = CSSUtilities.getCSSProperties($0); \n';
	eval_script += 'ret.CSSUTILS = 123; \n'	//CSSUtilities.getCSSRules($0);'

	eval_script	+= 'return ret; \n'
		+ '})()';

	//console.log( eval_script );
}


const computed_elem = document.getElementById( 'computed' );

chrome.devtools.panels.elements.onSelectionChanged.addListener( function() {

	chrome.devtools.inspectedWindow.eval(
		eval_script,
		function(result, isException) {
            if (isException) {
            	//console.log("No $0");
				computed_elem.innerHTML = 'Exception';
				console.error( isException );
			}
            else {
    			console.log("eval result: " + result);

				let html = '<h3>specified:</h3>';
				for( let key in result.specified ) {
					html += `${key}: ${result.specified[key]} <br />`;
				}
				html += '<h3>computed:</h3>';
				for( let key in result.computed ) {
					html += `${key}: ${result.computed[key]} <br />`;
				}
				// for( let key in result ) {
				// 	if( key !== 'computed' && key !== 'specified' ) {
				// 		html += `${key}: ${result[key]} <br />`;
				// 	}
				// }
				computed_elem.innerHTML = html;

				console.log( result.specified, result.computed );
			}
		}
	);

	// console.log('seection changed');
	// document.write( 'selection changed' );
});

// OK, so for matched "specified" styles, we might use this:
// getMatchedStylesForNode
// https://chromedevtools.github.io/devtools-protocol/tot/CSS#method-getMatchedStylesForNode
