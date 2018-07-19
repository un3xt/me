/*
 * Copyright (c) 2011 by Salesforce.com Inc.  All Rights Reserved.
 * This file contains proprietary information of Salesforce.com Inc.
 * Copying, use, reverse engineering, modification or reproduction of
 * this file without prior written approval is prohibited.
 *
 */
;(function ($) {
	// Document Ready
	$("input[type=text]:first").focus();
	
	$("#login_btn").on("click", function() {
		
		var login_form = $("#login_btn").closest("form");
		if (login_form.length > 0) {
			
			var login_form_email = login_form.find('input[type="email"]');
			if (login_form_email.length > 0) {
				
				login_form_email.each( function( ) {
					var login_form_email_curr = $(this);
					login_form_email_curr.val($.trim(login_form_email_curr.val()));	
				} );
			
			}
		}		
		
		
	});
	
})(jQuery);