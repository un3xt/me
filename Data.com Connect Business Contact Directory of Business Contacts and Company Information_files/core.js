var com = (function(){
	var call = function(options, type){
		jQuery.ajax ({
            url: options.url,
            type: type || "POST",
            data: (typeof options.data === "object" ? options.data : {}),
            success: function(response){
            	if(jQuery.isArray(response.actions)){
            		jQuery.each(response.actions, function(idx, action){
            			switch(action.type) {
            				case 2: 
            					window.location.href = action.action;
            					break;
            				default:
            					break;
            			}
            		});
            	} 
            	if(typeof options.callback === "function"){
                	options.callback(response);
                }
            }
        });
	},
	
	POST = function(options){
		call(options, "POST");
	},
	
	GET = function(options){
		call(options, "GET");
	};
	
	return {
		"salesforce": {
			"dc": {
				"api": {
					"call": function(options){
						call(options, "POST");
					},
					"get": GET,
					"post": POST
				}
			}
		}
	};
})();
//Overwrite dom objects
Function.prototype.method = function(name, fn){
	this.prototype[name] = fn;
	return this;
};
String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g,''); };

var $j = jQuery.noConflict();
/** Global objects **/
function messageobj(field, val, type, defaultMessage){
	this.field = field;
	this.message = val;
	this.type = type;
	this.defaultMessage = defaultMessage;
}
function unescapeHTML(a){
    if(a&&a.replace){
        a=a.replace(/&lt;/g,"<");
        a=a.replace(/&gt;/g,">");
        a=a.replace(/&amp;/g,"&");
    }
    return a;
}
function escapeHTML(a){
    if(a&&a.replace){
        a=a.replace(/</g,"&lt;");
        a=a.replace(/>/g,"&gt;");
        a=a.replace(/&/g,"&amp;");
    }
    return a;
}

var getMessageResourcePath = function(name){
	var _locale = "en";// default
	var supportedLocale = {"ru": false, "en": true};// we support only these languages
	if(typeof USER !== "undefined" && typeof USER.locale !== "undefined" && typeof USER.locale.language === "string"){
		//if we don't support this language we will use default		
		if(supportedLocale[USER.locale.language]) {
			_locale = USER.locale.language;
		}
	}
	getMessageResourcePath = function(name){
		var locale = _locale;
		return "/js/messages/" + name + "_" + locale +".js";
	};
	return getMessageResourcePath(name);
};

var resolveMessageArgs = function(message, args){
	if(typeof args.length === "number"){
		for(var i = 0; i < args.length; i++){
			var key = "{" + i + "}";
			while(message.indexOf(key) != -1){
				message = message.replace(key, args[i]);
			}
		}
	}
	return message;
};

var messagelist = function(){
	var list = [];
	var count = 0;
	return { 
		getCount : function(){ return list.length; },
		push : function(field, val, type, defaultMessage){
			var inArr = false;
			for(var i=0; i < list.length; i++){
				if(list[i].field == field){
					list[i].message = val;
					list[i].type = type;
					inArr = true;
				}
			}
			if(!inArr){ list.push(new messageobj(field, val, type, defaultMessage));}
		},
		pop : function(field){
			for(var i=0; i < list.length; i++){
				if(list[i].field == field){ list.splice(i, 1);}
			}
		},
		getMessage : function(field){
			for(var i=0; i < list.length; i++){
				if(list[i].field == field){ return list[i]; }
			}
			return "";
		},
		clearMessages : function(field){ list = []; },
		getType : function(field){
			var message = this.getMessage(field);
			if(message != ""){ return message.type; }
			return "";
		},
		getList : function(){ return list; }
	};
}();
//Popup window function
function removeChars(str, pattern) {
    while (str.indexOf(pattern) != -1) {
        str = str.substring(0, str.indexOf(pattern)) + str.substring(str.indexOf(pattern) + 1, str.length);
    }
    return str;
}

function newWin(url, winName, width, height, toolbars, locations, scrollbar, menus, resizable, Horiz, Vert, server, defaultvals) {
    var settings;
    if (defaultvals === null) {
        defaultvals = true;
    }
    winName = defaultvals ? winName ? winName : "jigsawWin" : winName ? winName : "_blank";
    settings =  (defaultvals ? "width=" + (width ? width : 700) + "," : width ? "width=" + width + "," : ""); 
    settings += (defaultvals ? "height=" + (height ? height : 700) + "," : height ? "height=" + height + "," : "");
    settings += (defaultvals ? "toolbar=" + (toolbars ? toolbars : 1) + "," : toolbars ? "toolbar=" + toolbars + "," : "");
    settings += (defaultvals ? "location=" + (locations ? locations : 1) + "," : locations ? "location=" + locations + "," : "");
    settings += (defaultvals ? "scrollbars=" + (scrollbar ? scrollbar : 1) + "," : scrollbar ? "scrollbars=" + scrollbar + "," : "");
    settings += (defaultvals ? "menubar=" + (menus ? menus : 1) + "," : menus ? "menubar=" + menus + "," : "");
    settings += (defaultvals ? "resizable=" + (resizable ? resizable : 1) + "," : resizable ? "resizable=" + resizable + "," : "");
    settings += (defaultvals ? "top=" + (Vert ? Vert : 20) + "," : Vert ? "top=" + Vert + "," : "");
    settings += (defaultvals ? "left=" + (Horiz ? Horiz : 20) + "," : Horiz ? "left=" + Horiz + "," : "") + "fullscreen=no";
	
    if (!server || url.substr(0, 4) == "http") {
        server = "";
    }
    winName = removeChars(winName, "*");
    winName = removeChars(winName, " ");

    if (winName == "_blank") {
        settings = "toolbar=1,menubar=1,location=1,scrollbars=1,resizable=1";
    }
    jigsawWin = settings ? window.open(server + url, winName, settings) : window.open(server + url, winName);
    if (winName == "_blank") {
        if (window.screen) {
            var availWidth = screen.availWidth;
            var availHeight = screen.availHeight;
            jigsawWin.moveTo(0, 0);
            jigsawWin.resizeTo(availWidth, availHeight);
        }
    }
    if (window.focus) {
        jigsawWin.focus();
    }
}
/** Inherited code from cornerstonelibrary.js **/
function gotoURL(url){
	document.location.href = url;
}
// Need to replace these
//myAccount.jsp, bulkPurchase.jsp, companyDirectoryForm.jsp, addCompany.jsp, addNewWebsite.jsp, normalizeContact.jsp, myCartItems.jsp, removeLimits.jsp
function showHelp (fileName) {
	if (fileName === null || fileName == "") { fileName = "Help.html"; }
    helpWindow = window.open ("/help/" + fileName, 'Help', "left=400,top=0,toolbar=yes,scrollbars=yes,menubar=yes,resizable=yes,location=yes,status=yes,height=575,width=700");
    try {
        helpWindow.focus();
    } catch (e) {
    
    }  
}

function $get (id) {
    var elem = null;
    if (DOM) {
           elem = document.getElementById (id);
    } else if (IE) {
        elem = document.all[id];
    }
    return elem;
}
/** End Inherited code from cornerstonelibrary.js **/
/*
 * New code
 * */
var ENTER_KEYCODE = 13;
var BACKSPACE = 8;
var TAB_KEYCODE = 9;
var DELETE = 46;
var UP_ARROW_KEYCODE  = 38;
var DOWN_ARROW_KEYCODE  = 40; 
var PAGE_UP_KEYCODE  = 33;
var PAGE_DOWN_KEYCODE  = 34; 

var Modernizr = {};
(function($) {
	/*start*/
	/**
     * Create the input element for various Web Forms feature tests.
     */
    var inputElem = document.createElement('input'), attrs = {};	
	Modernizr['input'] = (function( props ) {
		for ( var i = 0, len = props.length; i < len; i++ ) {
            attrs[ props[i] ] = !!(props[i] in inputElem);
        }
        return attrs;
    })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
	/*end*/
	var loadedStyleSheets = {};
	
	$.extend({
		getStyleSheet: function(url) {
			if(!loadedStyleSheets[url]){
                var urlWithCdn = url;

                var isRelative = url.substring(0, "http".length) !== "http";
                var loaderDeclaration = $("#jsLoaderLocation");
                if (isRelative && loaderDeclaration && loaderDeclaration.src) {
                    var loaderRelativePathStart = loaderDeclaration.src.indexOf("/js/");
                    if (loaderRelativePathStart >=0) {
                        urlWithCdn = loaderDeclaration.src.substring(0, loaderRelativePathStart);
                        if (url.substring(0, 1) != "/") {
                            urlWithCdn += "/";
                        }
                        urlWithCdn += url;
                    }
                }

				if (document.createStyleSheet){
					document.createStyleSheet(urlWithCdn);
				}
				else {
					$("head").append($("<link rel='stylesheet' href='" + urlWithCdn + "' type='text/css' />"));
				}
				loadedStyleSheets[url] = true;
			}
		}
	});
	/*IE FIX*/
	$.indexByValue = function(array, obj) {
		for(var i=0; i<array.length; i++){
           if(array[i]==obj){
                return i;
            }
        }
        return -1;
	};
	$.fn.extend({
		scrollDown: function(callback){
			var iScrollDown = false;//IE fix
			this.scroll(function(eventObject) {
				var elem = $(eventObject.currentTarget);
				if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()) {
					if (!iScrollDown) {
			    		if(typeof callback === "function") {
			    			callback();
			    		}
			    	}
					iScrollDown=true;
				} else {
					iScrollDown=false;
				}
				
			});
		},
		pasteEvents: function( delay ) {
		    if (delay == undefined) delay = 20;
		    return $(this).each(function() {
		        var $el = $(this);
		        $el.on("paste", function() {
		            $el.trigger("prepaste");
		            setTimeout(function() { $el.trigger("postpaste"); }, delay);
		        });
		    });
		},
		
		scrollToMe: function(showAbove){
			if(isNaN(showAbove)){
				showAbove = 0;
			}
			
			var offset = $(this).offset();
			if(offset){
				var verticalPos = offset.top;
				
				if(offset.top - showAbove >= 0){
					verticalPos = offset.top - showAbove;
				}
				if(verticalPos >= 0){
					$(window).scrollTop(verticalPos);
				}
			}
		}
	});
	
	$(function() {		
		if(!Modernizr.input.placeholder) {
			$("input[placeholder]").placeholder();
		}
	});
	
	$.size = function (obj) {
		var size = 0;
		for(var i in obj) {
			size++;
		} 
		return size;
	};
	
	$.isInt = function(value){
		return (parseFloat(value) == parseInt(value)) && !isNaN(value);
	};
	
	$.getAbbreviatedText = function (string, length) {
		var fullString = $.trim(string); 
		var shortenedString = fullString;
		
		if (fullString != "") {
			if (length == null) {
				length = fullString.length;
			}
			
			if (fullString.length > length) {
				shortenedString = fullString.substring(0, length - 3) + "...";
			}
		}
		
		return shortenedString;
	};
	
	$.isPositiveInt = function(value){
		if ($.isInt(value)) {
			return parseInt(value) >= 0;
		}
		return false;
	};
})(jQuery);

function isMapNotEmpty(map){
	for(var i in map ) {
		return true;
	}
	return false;
}

function trackObject(object, name){
	try{
		if(name != ""){
			s.tl(object, 'o', name);
		}
	}catch(e){}
}

function trackEvent(e, name){
	var $obj = $j(e.currentTarget || e.target);
	try{
		trackChannelEvent(e);
		if(name != ""){
			trackObject($obj[0], name);
		}
	}catch(e){}
}

function trackObjectClick(e){
	var $obj = $j(e.currentTarget || e.target);
	try{
		var elementTrackingName = $j.trim($obj.attr("trackingName"));
		trackEvent(e, elementTrackingName);
	}catch(e){}
}

function trackChannelEvent(e){
	try{
		recommendationSCHandler.sc_channelFacade(e);
	}catch(e){}
}

function trackPageView(trackingName, resetPageName){
    if(trackingName && typeof s != 'undefined'){
        var prevPageName = s.pageName;

        s.pageName = trackingName;
        s.t();
        if (resetPageName) {
            s.pageName = prevPageName; // Reset
        }
    }
}

/**
 * Returns {htmlArray: array, htmlStr: string}. htmlArray contains strings and DOM objects. The DOM objects are wrapped instances of
 * term found in the given text. This is useful to avoid having to use .html() to render
 * matching text regions.
 * @param text original string
 * @param term the matching term
 * @returns {htmlArray: array, htmlStr: string}. htmlArray contains strings and DOM objects ready to be added to the DOM
 */
function wrapMatches(text, wrapMatc, term) {
	var 
		htmlArray = [],
		htmlStr = "";
	
	// We need to escape the term for use with RegExp just in case there are special chars.
	// The replacement text "\\$&" says to prefix "\\" before matching special characters.
	var escapedTerm = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	var re = new RegExp(escapedTerm, "gi");
	
	var t = text;
	var 
		i = text.search(re),
		str = null;
	while (i != -1) {
		if (i > 0) {
			str = t.substring(0, i);
			htmlArray.push(str);
			htmlStr += str;
		}
		str = wrapMatc(t.substring(i, i + term.length));
		htmlArray.push(jQuery(str));
		htmlStr += str;
		
		t = t.substring(i + term.length);
		i = t.search(re);
	}
	htmlArray.push(t);
	htmlStr += t;
	
	return {
		"htmlArray" : htmlArray,
		"htmlStr": htmlStr
	};
}

$j(document).ready(function(){
	$j(".track-click").on("click", trackObjectClick);
});

// move to tracking wrapper
var definedMboxes = new Array();
function invokeMbox(mboxElementId, mboxName){
	if(typeof mboxDefine === "function" && typeof mboxUpdate === "function"){
		if(jQuery.inArray(mboxName, definedMboxes) == -1){
			mboxDefine(mboxElementId, mboxName);
			definedMboxes.push(mboxName);
		}
		mboxUpdate(mboxName);
	}
}

/* submit the form, only if the button is not disabled! */
function submitWhenReady(_form, _button) {
		
	_button.on("click", function(e) {
		if ( _button.hasClass( 'disabled' ) ) {
			// button is disabled, do nothing!
		} else {
			_form.submit();
		}
		e.preventDefault();
		return false;
	});
								
	_form.bind("keydown", function(e) {
		var code = e.keyCode || e.which; 
		if (code == 13) {							
			if ( _button.hasClass( 'disabled' ) ) {
				// button is disabled, do nothing!
			} else {
				_form.submit();
			}
			e.preventDefault();
			return false;
		}
	});					
}