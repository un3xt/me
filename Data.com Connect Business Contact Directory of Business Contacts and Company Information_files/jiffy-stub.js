//no-op calls to Jiffy instrumentation
var Jiffy = function() {
	return {
		mark : function(referenceID) {},
		clearMeasures : function() {},
		reportMeasure : function(eventName, referenceID) {}
	}
}();