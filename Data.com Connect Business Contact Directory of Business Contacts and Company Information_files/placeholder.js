/*
 * Copyright (c) 2011 by Salesforce.com Inc.  All Rights Reserved.
 * This file contains proprietary information of Salesforce.com Inc.
 * Copying, use, reverse engineering, modification or reproduction of
 * this file without prior written approval is prohibited.
 *
 */
;(function ($) {
	if(typeof($.placeholder) === "function"){ return; };
	
	function addGhostText($obj, ghostText) {
		var id = $obj.attr("id") + "_ghost-text";
		var $tag = $("#" + id);
		if ($tag.length == 0) {
			$tag = $("<div id=\"" + id + "\" class=\"ghost-text\"></div>").text(ghostText).click(function(){
				$obj.focus();
			});
			$obj.after($tag);
		}
		else {
			// In case the placeholder attribute changes.
			$tag.text(ghostText);
		}
		redraw($obj, $tag);
		return $tag;
	}
	
	function redraw($obj, $ghost) {
		if($obj.val() == "") {
			$ghost.show();
		} else {
			$ghost.hide();
		}
	}

	var origval = $.fn.val;
	$.fn.extend({
		val: function(){
			// Extend jQuery's val function to trigger the change event.
			var ret = origval.apply(this, arguments);
			var target = $(this);
			if (target.attr("placeholder") && arguments.length) {
				target.change();
			}
			return ret;
		},
		placeholder: function(){
			$(this).each(function(idx, obj){
				var $obj = $(obj);
				var _ghostText = $obj.attr("placeholder");
				var $tag = addGhostText($obj, _ghostText);
				var targetHeight = $obj.outerHeight(true);
				
				// IE 8 fix
				if(targetHeight < 22){ targetHeight = 22; }
				
				$tag.css("marginTop", "-" + targetHeight + "px");
				$obj.change(function(e) {
					redraw($obj, $tag);
				}).blur(function(e){
					$tag.removeClass("ghost-text-lighter").addClass("ghost-text");
					redraw($obj, $tag);
				}).focus(function(e){
					$tag.removeClass("ghost-text").addClass("ghost-text-lighter");
					redraw($obj, $tag);
				}).keydown(function(e){
					redraw($obj, $tag);
				}).keyup(function(){
					redraw($obj, $tag);
				});
			});
			return $(this);
		}
	});	
})(jQuery);