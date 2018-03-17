chrome.devtools.panels.elements.createSidebarPane( "CSS Spec Trace",
	function(sidebar) {
		sidebar.setPage( 'sidebar.html' );
		//backConnect();
	}
);

// function backConnect() {
// 	// Relay the tab ID to the background page
// 	chrome.runtime.sendMessage({
// 	    tabId: chrome.devtools.inspectedWindow.tabId
// 	});
// }
