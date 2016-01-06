'use strict';

var tabMarkup = '<ul class="tabs"><li class="tab active one">Components</li><li class="tab two">Pages</li><li class="tab three">Foos</li></ul><div class="panels"><div class="panel"><p>This is some content and stuff.  This is some content and stuff. This is some content and stuff. This is some content and stuff. This is some content and stuff. This is some content and stuff.</p><button type="button">Foo</button></div><div class="panel hide"><p>This is some other content and other stuff. This is some other content and other stuff. This is some other content and other stuff. This is some other content and other stuff. This is some other content and other stuff.</p><button type="button">Bar</button></div><div class="panel">asdf</div></div>';

describe('a11yTabs', function () {
	var $tabs;
	var jQuery = window.jQuery;
	beforeEach(function () {
		var $fixture = jQuery('#fixture');
		$fixture
			.empty()
			.append(jQuery(tabMarkup));

		$tabs = jQuery('.tabs > .tab');

	});

	after(function () {
		jQuery('#fixture').empty();
	});

	describe('arrow key navigation', function () {
		it('should move to the next tab when down is pressed', function () {
			standardCall();

			$tabs.first().focus();
			var e = createEvent('keydown', 40);
			$tabs.first().trigger(e);
			assert.equal(document.activeElement, $tabs[1]);
		});

		it('should move to the next tab when right is pressed', function () {
			standardCall();

			$tabs.first().focus();
			var e = createEvent('keydown', 39);
			$tabs.first().trigger(e);
			assert.equal(document.activeElement, $tabs[1]);
		});

		it('should move to the previous tab when up is pressed', function () {
			standardCall();

			$tabs.last().click().focus(); // activate the last tab
			var e = createEvent('keydown', 38);
			$tabs.last().trigger(e);
			assert.equal(document.activeElement, $tabs[1]);
		});

		it('should move to the previous tab when left is pressed', function () {
			standardCall();

			$tabs.last().click().focus(); // activate the last tab
			var e = createEvent('keydown', 37);
			$tabs.last().trigger(e);
			assert.equal(document.activeElement, $tabs[1]);
		});

		it('should focus the FIRST tab if right or down is pressed on the LAST tab', function () {
			standardCall();

			$tabs.last().click().focus();
			var e = createEvent('keydown', 40);
			$tabs.last().trigger(e);
			assert.equal(document.activeElement, $tabs[0]);
		});

		it('should focus the LAST tab if left or up is pressed on the FIRST tab', function () {
			standardCall();

			$tabs.first().focus();
			var e = createEvent('keydown', 37);
			$tabs.first().trigger(e);
			assert.equal(document.activeElement, $tabs.last()[0]);
		});
	});

	describe('roles/attrs', function () {
		describe('initial', function () {
			it('should properly set the initial attributes based on `activeClass`', function () {
				standardCall();
				var $panels = jQuery('#fixture .panel');

				assert.equal(jQuery('#fixture .tabs').attr('role'), 'tablist');

				$tabs.each(function (i, tab) {
					var $tab = jQuery(tab);
					if (i === 0) {
						assert.equal($tab.attr('aria-selected'), 'true');
						assert.equal($tab.attr('tabIndex'), '0');
					} else {
						assert.equal($tab.attr('aria-selected'), 'false');
						assert.equal($tab.attr('tabIndex'), '-1');
					}
					assert($tab.prop('id').length);
					assert.equal($tab.attr('role'), 'tab');
					assert.equal($tab.attr('aria-owns'), $panels.eq(i).prop('id'));
				});
			});
		});
		describe('updated', function () {
			it('should properly update the attributes of tabs and their panels', function () {
				standardCall();
				var $panels = jQuery('#fixture .panel');

				$tabs.eq(1).click(); // "select" the middle (of 3) tab
				$tabs.each(function (i, tab) {
					var $tab = jQuery(tab);
					if (i === 1) {
						assert.equal($tab.attr('aria-selected'), 'true');
						assert.equal($tab.attr('tabIndex'), '0');
					} else {
						assert.equal($tab.attr('aria-selected'), 'false');
						assert.equal($tab.attr('tabIndex'), '-1');
					}
				});

				assert(!$panels.first().is(':visible'));
				assert($panels.eq(1).is(':visible'));
				assert(!$panels.last().is(':visible'));
			});
		});
	});
	describe('mouse clicks on inactive tab', function () {
		it('should properly activate the clicked tab', function () {
			standardCall();
			var $panels = jQuery('#fixture .panel');
			var $panel = $panels.eq(1);
			var $secondTab = $tabs.eq(1);
			$secondTab.click(); // "select" the middle (of 3) tab

			assert.equal($secondTab.attr('aria-selected'), 'true');
			assert.equal($secondTab.attr('tabIndex'), '0');
			assert($panel.is(':visible'));
			assert.equal($tabs.first().attr('aria-selected'), 'false');
			assert.equal($tabs.last().attr('aria-selected'), 'false');
			assert(!$panels.first().is(':visible'));
			assert(!$panels.last().is(':visible'));
		});
	});

	describe('non-default options', function () {
		describe('panelShow', function () {
			it('should propery call panelShow when a new panel is shown', function (done) {
				jQuery('.tabs').a11yTabs({
					panelSelector: '.panels .panel',
					activeClass: 'active',
					inactiveClass: 'noop',
					panelShow: function () {
						done();
					}
				});
				$tabs.last().click();
			});
		});
		describe('panelHide', function () {
			it('should propery call panelShow when a new panel is shown', function (done) {
				jQuery('.tabs').a11yTabs({
					panelSelector: '.panels .panel',
					activeClass: 'active',
					inactiveClass: 'noop',
					panelHide: function () {
						done();
					}
				});
				$tabs.last().click();
			});
		});
	});

	function standardCall() {
		jQuery('.tabs').a11yTabs({
			panelSelector: '.panels .panel',
			activeClass: 'active',
			inactiveClass: 'noop',
			panelShow: function (panel) {
				$(panel).show();
			},
			panelHide: function (panel) {
				$(panel).hide();
			}
		});
	}

	function createEvent(type, which) {
		var e = jQuery.Event(type);
		if (which) {
			e.which = which;
		}

		return e;
	}
});