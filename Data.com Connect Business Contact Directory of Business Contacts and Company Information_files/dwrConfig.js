if(typeof(dwr) != "undefined"){
	// session expires
	dwr.engine.setTextHtmlHandler(function() {
		document.location = '/authSessionTimeout';
	});
	
	dwr.engine.setErrorHandler(function( errorString, exception ) {
		// prevent dwdr from alerting, "Incomplete reply from server" user when error occurs (ie. page unload while request is processing, exception thrown via dwr call)
		if ( exception.data.alert ) {
			alert(exception.data.message);
		}
	});
}
