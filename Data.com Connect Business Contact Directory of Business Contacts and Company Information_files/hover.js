/*
 * Copyright (c) 2011 by Salesforce.com Inc.  All Rights Reserved.
 * This file contains proprietary information of Salesforce.com Inc.
 * Copying, use, reverse engineering, modification or reproduction of
 * this file without prior written approval is prohibited.
 *
 */
//Singleton with Private Members.
;var $hover = (function ($) {
	
	/* start abstract hover framework */
	var AbstractHover = function (options) {
		var $that = this;
		return $that.impl.init(options);
	};
	
	AbstractHover.impl = {
		init: function (options) {
			var $that = this;
			$that.options = $.extend({}, options);
			
			return $that;
		},
		
		/* abstract functions */
		show: function(hoverObject, callback){throw"You must @Override show function";},
		hide: function(hoverObject, callback){throw"You must @Override hide function";},
		
		loadContent: function (hoverObject, beforeShowFunction, callback) {throw"You must @Override loadContent function";},
		closeModal: function(hoverObject, callback){throw"You must @Override closeModal function";}
	};
	
	var SimpleModalHover = function (options) {
		var $that = this;
		var t = $.extend({}, AbstractHover.impl, SimpleModalHover.impl);
		return t.init($.extend({}, options));
	};
	
	SimpleModalHover.impl = {
		_maxZ: 1005,
		
		show: function(hoverObject, callback){
			var $that = this;
//			$("body").css("overflow", "hidden");
			
			$("#" + hoverObject.id).modal(
				{
					overlayClose:false, 
					focus: hoverObject.focus || false,
					overlayId:'overlay', 
					opacity:50, 
					overlayCSS:{backgroundColor:"white", zIndex:$that._maxZ - 3},
					zIndex:$that._maxZ - 2,
					escClose: hoverObject.escClose || false,
					hideClose: hoverObject.hideClose || false,
					position : hoverObject.position || false,
					onOpen: function(dialog){
						// override modal behavior
						// display the remaining elements, fade elements in parallel
						dialog.overlay.fadeIn(250);
						var contentFadeSpeed = 200;
						dialog.container.fadeIn(contentFadeSpeed);
						dialog.data.fadeIn(contentFadeSpeed);
					},
					onClose: function(dialog){
						modal.closeModal(hoverObject.id);
					},
					onShow: function(dialog) {
						if (hoverObject.escClose || hoverObject.hideClose) {
							dialog.data.find(".hover-close").hide();
						}
						callback(hoverObject.id);
					}
				}
			);
		},
		
		hide: function(hoverObject, callback){
			var $that = this;
			var id = hoverObject.id;
			var hoverVisible = $("#" + id).is(":visible");
			if(hoverVisible){
				$("#"+id).remove();
			}
			
			if($.isFunction(callback)){
				callback();
			}
			if(typeof hoverObject.close === "function") {
				hoverObject.close();
			}
		},
		
		closeModal: function(hoverObject, callback){
			$.modal.close(true);
			
			if($.isFunction(callback)){
				callback();
			}
		},
		
		/*
		 * @Override
		 */
		loadContent: function (hoverObject, beforeShowFunction, callback) {
			var $that = this;
			
			var processHoverContent = function(data){
				if($.isFunction(beforeShowFunction)){
					beforeShowFunction(data);
				}
				$("#hoverContent").append(data);
				callback(data);
			};
			
			if(typeof hoverObject.html !== "undefined"){
				processHoverContent(hoverObject.html.clone());
			}else{
				var path = (hoverObject == null ? false : hoverObject.path);
				$.ajax({
					url: path,
					success: function(data){
						processHoverContent(data);
					}
				});
			}
		},
		
		_zIndex: function($obj) {
			var $that = this;
			if ($obj != null) {
				var elem = $( $obj[ 0 ] ), position, value;
				while ( elem.length && elem[ 0 ] !== document ) {
					// Ignore z-index if position is set to a value where z-index is ignored by the browser
					// This makes behavior of this function consistent across browsers
					// WebKit always returns auto if the element is positioned
					position = elem.css( "position" );
					if ( position === "absolute" || position === "relative" || position === "fixed" ) {
						// IE returns 0 when zIndex is not specified
						// other browsers return a string
						// we ignore the case of nested elements with an explicit value of 0
						// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
						value = parseInt( elem.css("zIndex"), 10 );
						if ( !isNaN( value ) && value !== 0 ) {
							return value;
						}
					}
					elem = elem.parent();
				}
			}
			return 0;
		}
	};
	
	var modal = new SimpleModalHover();
	
	//Private attributes.
	var _hoverObjects = [
	    { id: "signIn", path : "/user/hover/login", focus:true},
	    { id: "selectAnExistingLocation", path : "/contact/hover/companyLocations"},
	    { id: "progressBar", escClose: true, position: ["250px"], html: $("<div id=\"progressBar\"><div class=\"message\">")},
	    
	    { id: "uploadProcessing", path : "/main/hover/upload/processing"},
	    { id: "uploadSuccessful", path : "/main/hover/upload/successful"},
	    { id: "uploadFail", path : "/main/hover/upload/fail"},
        { id: "uploadEuFail", path : "/main/hover/upload/eufail"},
	    { id: "removeFail", path : "/main/hover/remove/fail"},
	    
	    { id: "confirm", path : "/main/hover/confirm"},
	    
	    // Company
        { id: "acceptableDomainsHover", path : "/company/hover/acceptableDomains"},
        { id: "deactivateCompany", path : "/company/hover/deactivate"},
        { id: "companyAddDomain", path : "/company/hover/companyAddDomain"},
        { id: "companyUpdateDomain", path : "/company/hover/companyUpdateDomain"},
        { id: "companyUpdateDomainConfirm", path : "/company/hover/companyUpdateDomainConfirm"},
        { id: "companyDeleteDomain", path : "/company/hover/companyDeleteDomain"},
        { id: "companyMoveDomainConfirm", path : "/company/hover/companyMoveDomainConfirm"},
        { id: "changeCompanyStatus", path : "/company/hover/changeCompanyStatus"},
        { id: "companyMerge", path : "/company/hover/companyMerge"},
        { id: "companyMergeConfirm", path : "/company/hover/companyMergeConfirm"},

        { id: "stewardshipUpdateRejection", path : "/company/hover/stewardshipUpdateRejection"},
        
        { id: "quickUpdateName", path : "/contact/hover/quickUpdateName"},
        { id: "quickUpdateTitle", path : "/contact/hover/quickUpdateTitle"},
        { id: "quickUpdateEmail", path : "/contact/hover/quickUpdateEmail"},
        { id: "quickUpdatePhone", path : "/contact/hover/quickUpdatePhone"},
        { id: "deactivateOwnedPhone", path : "/contact/hover/deactivateOwnedPhone"},
        { id: "deactivateOwnedEmail", path : "/contact/hover/deactivateOwnedEmail"},
        { id: "notDirectDialHover", path : "/contact/hover/notDirectDialHover"},
        { id: "changeContactStatus", path : "/contact/hover/changeContactStatus"},
        
        { id: "revertCompare", path : "/contact/hover/revertCompare"},
        { id: "deactivateContact", path : "/contact/hover/deactivate"},
        { id: "deactivateUnOwnedContact", path : "/contact/hover/deactivateUnowned"},
        { id: "welcomeHover", path : "/main/hover/welcome", hideClose: true},

        //search
        { id: "saveYourSearch", path : "/search/hover/saveYourSearch", focus:true},
        { id: "editSearchList", path : "/search/hover/editSearchList"},
        //export
        { id: "exportContactsToCSVMain", path : "/export/hover/exportContactsToCSVMain"},
        { id: "exportContactsToCSVProcessing", path : "/export/hover/exportContactsToCSVProcessing"},
        { id: "exportContactsToCSVDownload", path : "/export/hover/exportContactsToCSVDownload"},
        { id: "exportContactsToCSVSendEmail", path : "/export/hover/exportContactsToCSVSendEmail"},
        { id: "exportContactsToCSVLimit", path : "/export/hover/exportContactsToCSVLimit"},
        { id: "exportContactsToCSVNotEnoughPoints", path : "/export/hover/exportContactsToCSVNotEnoughPoints"},
        { id: "exportContactsToCSVCreditCardOnly", path : "/export/hover/exportContactsToCSVCreditCardOnly"},
        
        { id: "exportPointsPurchasePaymentInfo", path : "/export/hover/exportPointsPurchasePaymentInfo"},
        { id: "exportPointsPurchasePlaceOrder", path : "/export/hover/exportPointsPurchasePlaceOrder"},
        //upload companies
        { id: "uploadCompaniesProcessing", path : "/search/hover/uploadCompaniesProcessing"},
        { id: "uploadedCompanies", path : "/search/hover/uploadedCompanies"},
        // shopping cart actions (on search)
        { id: "shoppingCartAddWillBeFull", path : "/shoppingcart/hover/shoppingCartAddWillBeFull"},
        { id: "shoppingCartAddAllToCartConfirm", path : "/shoppingcart/hover/shoppingCartAddAllToCartConfirm"},
        // shopping cart actions (on cart)
        { id: "shoppingCartRemovalConfirm", path : "/shoppingcart/hover/shoppingCartRemovalConfirm"},
        //member plan
        { id: "stopAutoRenewal", path : "/memberplan/hover/stopautorenewal"},
        { id: "startAutoRenewal", path : "/memberplan/hover/startautorenewal"},
        { id: "addCreditCard", path : "/memberplan/hover/addCreditCard"},
        //my settings
        { id: "cancelAccount", path : "/mysettings/hover/cancelaccount"},
        //captcha
        { id: "captchaCheck", path : "/captcha/hover/check", hideClose: true},
      	//buy points
        { id: "buyPointsEnterContacts", path : "/buypoints/hover/buyPointsEnterContacts"},
        { id: "buyPointsConfirmContacts", path : "/buypoints/hover/buyPointsConfirmContacts"},
        { id: "buyPointsOrderSummary", path : "/buypoints/hover/buyPointsOrderSummary"},
        //bulk contact activate/deactivate
        { id: "bulkActivateContacts", path : "/contact/hover/bulkActivateContacts"},
        { id: "bulkDeactivateContacts", path : "/contact/hover/bulkDeactivateContacts"},
        // header add contact / company
        { id: "addAContact", path : "/main/hover/header/addAContact"},
        { id: "addACompany", path : "/main/hover/header/addACompany"},
        // contact responsibilities
        { id: "responsibility", path : "/contact/hover/responsibility"}
    ];
	
	var _supportedMessageTypes = ["error", "warn", "confirm", "info"];
	var StatusEnum = {BEFORE_OPENING: "beforeOpening", OPENED: "opened", WAIT_TO_CLOSE: "waitToClose", BEFORE_CLOSE: "beforeClose", CLOSED: "closed"};
	var _status = new Object();
	var _timer = new Object();
	var TIMER_INTERVAL_MS = 500;
	
	//Private methods. 
	function _isSupportedType(type){
		if(typeof(type) === "string"){
			for(var i = 0; i < _supportedMessageTypes.length; i++){
				if(_supportedMessageTypes[i] == type.toLowerCase()){
					return true;
				}
			}
		}
		return false;
	};
	
	function _getHoverObject(id){
		var result = null; 
		$.each(_hoverObjects, function(idx, obj) {
			if(obj.id == id){
				result = obj;
				return false;//break;
			}
		});
		return result;
	};
	
	function _getHoverTimerObject(id){
		var result = _timer[id]; 
		if(result == null){
			result = {
				startDate: new Date(),
				minViewTimeMS: null
			};
			_timer[id] = result;
		}
		return result;
	};
	
	function _show(id, options){
		var object = _getHoverObject(id);
		function openModal(){
			modal.show(object, function(id){
				_status[id] = StatusEnum.OPENED;
					if(!($.isEmptyObject(options))) {
						if(options.minViewTimeMS != null){
							var hoverTimerObject = _getHoverTimerObject(id);
							hoverTimerObject.minViewTimeMS = options.minViewTimeMS;
						}
						if($.isFunction(options.callback)){
							options.callback(id);
						}
					}
					
			});
		}
		
		if($("#" + id).length > 0){
			openModal();
		}else{
			var beforeShow = null;
			if($.isFunction(options.beforeShow)){
				beforeShow = options.beforeShow;
			};
			
			modal.loadContent(object, beforeShow, function(){
				openModal();
			});
		}
		if(typeof options.close === "function") {
			object.close = options.close;
		} else {
			object.close = undefined;
		}
	};
	
	function _hide(id, closeOverlay, callback) {
		var hoverTimerObject = _getHoverTimerObject(id);
		if(hoverTimerObject.minViewTimeMS != null){
			var now = new Date();
			var viewCompleted = now.getTime() - hoverTimerObject.startDate.getTime() > hoverTimerObject.minViewTimeMS;
			if(!viewCompleted){
				_status[id] = StatusEnum.WAIT_TO_CLOSE;
				setTimeout(function(){
					_timer[id] = hoverTimerObject;
					
					_hide(id, closeOverlay, callback);
				}, TIMER_INTERVAL_MS);
				return;
			}
		}

		_timer[id] = null;
		_status[id] = StatusEnum.BEFORE_CLOSE;
		
		var hoverObject = _getHoverObject(id);
		modal.hide(hoverObject, function(){
			var afterHideFunction = function(){
				_status[id] = StatusEnum.CLOSED;
				
				if($.isFunction(callback)){
					callback();
				}
			};
			
			if(closeOverlay){
				modal.closeModal(hoverObject, afterHideFunction);
			}else{
				afterHideFunction();
			}
		});
	}
	
	//Public members.
	return {
		//Public attributes.
		
		
		//Public methods.
		resize: function() {
			$("#simplemodal-container").css('height', 'auto');
			$.modal.update();
		},
		/*
		 * id - hover id, see _hoverObjects;
		 * options:
		 * 			minViewTimeMS - minimum time to display hover if hide is called (optional)
		 * 			delayBeforeOpening - milliseconds, [Not Necessarily]
		 * 			callback - This function is called when dialog is opened. [Not Necessarily]
		 * 			beforeShow - function($hover)
		 * 
		 * */
		show: function(id, options) {
			if(_status[id] === StatusEnum.CLOSED || typeof _status[id] === "undefined"){
				_status[id] = StatusEnum.BEFORE_OPENING;
				if(typeof(options) === "undefined") {
					options= {};
				}
				if(typeof options.delayBeforeOpening === "number") {
						setTimeout(function(){
							if(_status[id] != StatusEnum.CLOSED) {
								_show(id, options);
							}
						}, options.delayBeforeOpening);
				} else if(typeof options == "function"){
					_show(id, {"callback" : options});
				}else{
					_show(id, options);
				}
			}
		},
	
		/**
		 * Hides the modal
		 * @param id (required) - hover id to hide
		 * @param closeOverlay (optional, default true) - specify whether overlay should be removed during the hide call 
		 * @param callback (optional) - callback to execute after hide has completed
		 * @returns
		 */
		hide: function(id, closeOverlay, callback) {
			var args = [id, closeOverlay, callback];
			if($.isFunction(closeOverlay)){
				args[2] = closeOverlay;
			}
			
			if(typeof closeOverlay === "boolean"){
				args[1] = closeOverlay;
			}else{
				args[1] = true;
			}
			
			_hide(args[0], args[1], args[2]);
		},

		/**
		 * attempts to transition currently shown hover to a new hover w/o flashing overlay
		 * 
		 * @param currentHoverId
		 * @param newHoverId
		 * @param options - may have the following fields
		 * 			currentHoverCallback - after hiding the current hover, call this method
		 * 			
		 * @returns
		 */
		transition: function(currentHoverId, newHoverId, options){
			var $this = this;
			var currentHoverCallback = null;
			var newHoverOptions = null;
			var newHoverScript = null;
			if(typeof(options) !== "undefined"){
				// options map processing
				if($.isFunction(options.currentHoverCallback)){
					currentHoverCallback = options.currentHoverCallback;
				}
				
				if($.type(options.newHoverOptions) === "object"){
					newHoverOptions = options.newHoverOptions;
				}
				
				if($.type(options.newHoverScript) === "string"){
					newHoverScript = options.newHoverScript;
				}
			}
			
			_hide(currentHoverId, false, function(){
				if($.isFunction(currentHoverCallback)){
					currentHoverCallback();
				}
				
				var showNewHover = function(){
					$this.show(newHoverId, newHoverOptions);
				};
				
				if(newHoverScript != null){
					$jsLoader.load(newHoverScript, {loaded: showNewHover});
				}else{
					showNewHover();
				}
			});
		},
		
		clearHoverMessages: function($hover){
			$(".hover-messaging", $hover).html("").clear();
		},
	
		addHoverMessage: function($currentHover, type, message){
			if(_isSupportedType(type)){
				var messageContainer = $(".hover-messaging:first", $currentHover);
				
				for(var i = 0; i < _supportedMessageTypes.length; i++){
					var currType = _supportedMessageTypes[i];
					messageContainer.toggleClass(currType, (currType == type.toLowerCase()));
				}
				
				var contentObj = $("<div class=\"" + type +"HoverMessage\">");
				contentObj.html(message);
				
				messageContainer.append(contentObj);
				messageContainer.show();
			}
		},
		
		getSupportedMessageTypes: function() {
			return _supportedMessageTypes;
		},
		
		isOpened: function(id){
			return _status[id] === StatusEnum.OPENED;
		},
		
		isDefined: function(id){
			return typeof _status[id] !== "undefined";
		}
	};
})(jQuery);