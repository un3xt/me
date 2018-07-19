/*
 * Copyright (c) 2011 by Salesforce.com Inc.  All Rights Reserved.
 * This file contains proprietary information of Salesforce.com Inc.
 * Copying, use, reverse engineering, modification or reproduction of
 * this file without prior written approval is prohibited.
 *
 */
//Singleton with Private Members.
;var $jsLoader = (function () {
    //Private attributes.
    var loaded = new Object();
    
    var prePath = "";

    var HTTP_PROTOCOL = "http:";
	var HTTPS_PROTOCOL = "https:";
	
	var excludeMatches = ["/dwr/"];
	
    var loaderDeclaration = document.getElementById("jsLoaderLocation");
    
    if(loaderDeclaration != null && typeof loaderDeclaration.src !== "undefined"){
    	var loaderLocation = loaderDeclaration.src;
    	var loaderToKey = "/js/";
    	if(loaderLocation.length > 0 && loaderLocation.indexOf(loaderToKey) != -1){
    		prePath = loaderLocation.substring(0, loaderLocation.indexOf(loaderToKey));
    	}
    }
    
    function isNotLoaded(script){
        return typeof loaded[script] === "undefined";
    }
    
    function getNotLoaded(scripts){
        var notLoadedScripts = new Array();
        for(var i = 0; i < scripts.length; i++){
            if(isNotLoaded(scripts[i])){
                notLoadedScripts.push(scripts[i]);
            }
        }
        return notLoadedScripts;
    }

    function applyPrePath(script){
    	if(onExcludeList(script)){
    		return script;
    	}
    	
    	var isDirectScript = script.substring(0, HTTP_PROTOCOL.length) === HTTP_PROTOCOL || script.substring(0, HTTPS_PROTOCOL.length) === HTTPS_PROTOCOL;
    	
    	var isRelative = script.substring(0, 1) !== "/";
    	// apply prepath only if script is locally absolute or relative
    	if(!isDirectScript
    			&& (script.charAt(0) === '/' || isRelative)){
    		if(isRelative && script[0] !== "/"){
    			return prePath + "/" + script;
    		}
    		return prePath + script;
    	}
    	return script;
    }
    
    function onExcludeList(script){
    	if(typeof script === "string"){
	    	for(var i = 0; i < excludeMatches.length; i++){
	    		var excludeStr = excludeMatches[i];
	    		if(excludeStr.length > 0 && script.length >= excludeStr.length){
		    		if(script.substring(0, excludeStr.length) === excludeStr){
		    			return true;
		    		}
		    	}
	    	}
    	}
    	return false;
    }
    
    //Public members.
    return {
        //Public methods.
        load: function(script, options) {
            var runBeforeLoad = function(){
                if(typeof options === "object" && typeof options.beforeLoad === "function") {
                    options.beforeLoad(prePath);
                }
            };
            
            var runLoaded = function(){
                if(typeof options === "object" && typeof options.loaded === "function") {
                    options.loaded();
                }
            };
            
            if(typeof script !== "string" && typeof script.length === "number") {
                // likely an array, multiple resources to load
                var scripts = getNotLoaded(script);
                if(scripts.length > 0){
                    runBeforeLoad();
                    var scriptArgs = "";
                    for(var i = 0; i < scripts.length; i++){
                        scriptArgs += "\"" + applyPrePath(scripts[i]) + "\"";
                        if(i < scripts.length - 1){
                            scriptArgs += ",";
                        }
                    }
                    // head.js doesn't support passing an array of javascript locations, therefore using eval for args
                    eval("head.js(" + scriptArgs + ", runLoaded);");
                }else{
                    runLoaded();
                }
            }else if(typeof script === "string" && isNotLoaded(script)) {
                // single resource
                runBeforeLoad();
                
                head.js(applyPrePath(script), runLoaded);
            } else {
                runLoaded();
            }
        }
    };
})();