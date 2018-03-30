"use strict";

function R2HallRules( rules ) {
	//assumes rules is array.

	let html = '';
	rules.forEach( (r,i) => {
		//r.path?
		if( r.match ) {
			html += R2Hmatch( r.match );
		}
		if( r.relation ) {
			html += R2Hrelation( r.relation );
		}
		//warn
	});

}

function R2Hmatch( match ) {
	
}

function R2Hrelation( rel ) {

}
