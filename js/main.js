jQuery(function($) {

	// initializes section tabs and binds tab events for a certain form
	var initSectionTabs = function(form_id) {
		// get form ID
		var $form = $('#gform_' + form_id);

		// make sure that form is there, section tabs are enabled and are not yet initialized
		if ($form.length && $form.hasClass('gravity_forms_section_tabs_enabled') && !$form.hasClass('gravity_forms_section_tabs_initialized')) {

			// if there are no sections, bail
			var tabs = $form.find('.gsection');
			if (!tabs.length) {
				return true;
			}

			// insert tabs head wrapper
			var tabsHead = $('<li class="gravity-forms-section-tabs-head"></li>');
			tabsHead.insertBefore(tabs.eq(0));

			// here we'll save the first tab with errors
			var firstTabWithErrors = -1;

			// build tabs
			$num = 0;
			tabs.each(function(tabIndex) {
				$num++;
				var $this = $(this);

				// add a tab head link for each tab
				tabsHead.append('<a href="#" class="section-'+ $num +'">' + $this.find('.gsection_title').html() + '</a>');

				// move the corresponding fields to their tab body
				var gformFields = $('<ul class="gform_fields">');
				$this.append(gformFields);
				$this.nextUntil('.gsection', '.gfield').appendTo(gformFields);

				// if this tab is the first with errors, save it
				if ($this.find('.gfield_error').length && firstTabWithErrors === -1) {
					firstTabWithErrors = tabIndex;
				}
			});

			// falling back to first tab if no tab with errors
			if (firstTabWithErrors < 0) {
				firstTabWithErrors = 0;
			}

			// handle tab head clicks
			tabsHead.find('a').on('click', function(event) {
				var $this = $(this);

				// Remove button if last tab
				if (($this.is(':last-of-type'))) {
					if ($('.button-next').length !== 0) {
						$('.button-next').remove();
					}
				}

				// Add button if tab was removed and not on last tab
				if ($('.gravity-forms-section-tabs-head a:last-child').hasClass('current')) {
					if ($('.button-next').length === 0) {
						$('.gform_footer').append('<a class="button-next button" href="#">Next</a>');
					}
				}

				if ($this.hasClass('current')) {
					return false;
				}

				var idx = tabsHead.find('a').index($this);
				$form.find('.gsection:eq(' + idx + ')').show().siblings('.gsection').hide();
				tabsHead.find('a.current').removeClass('current');
				$this.addClass('current');

				event.preventDefault();
			}).filter(':eq(' + firstTabWithErrors + ')').trigger('click');

			// Add Next Button
			$('.gform_footer').append('<a class="button-next button" href="#">Next</a>');

			// Next button functionality
			$('.gform_footer').on('click', '.button-next', function(e) {
				e.preventDefault();
				console.log('test');
				
				let current = $('.gravity-forms-section-tabs-head a.current');
				$(current).next().trigger('click');

				if ($('.gravity-forms-section-tabs-head a:last-child').hasClass('current')) {
					$('.button-next').remove();
				}
			});

			// Disable Submit Button Until Last Tab
			$('.gform_footer input[type="submit"]').prop("disabled", true);
			tabsHead.find('a').on('click', function(event) {
				var $this = $(this);

				if (($this.is(':last-of-type'))) {
					$('.gform_footer input[type="submit"]').prop("disabled", false);
				}

			});


			// mark the section tabs of this form as initialized
			$form.addClass('gravity_forms_section_tabs_initialized');

			// trigger a custom "section tabs initialization completed" event for that form
			$(document).trigger('gravity_forms_section_tabs_initialized', form_id);

		}
	}

	// initialize section tabs after form rendering
	$(document).on('gform_post_render', function(event, form_id, current_page) {
		initSectionTabs(form_id);
	});

	// in case gform_post_render is not called, initialize the section tabs
	$('form.gravity_forms_section_tabs_enabled').each(function() {
		initSectionTabs($(this).attr('id').replace('gform_', ''));
	});

});