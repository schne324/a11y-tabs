
/*global jQuery*/
;(function($){
  'use strict';

  var defaults = {
    tabSelector: 'li', // qualified within `this`
    panelSelector: '.panels li', // qualified within document
    activeClass: 'active', // also used for finding the initially active panel
    inactiveClass: null,
    panelShow: function (panel) {
      panel.style.display = 'block';
    },
    panelHide: function (panel) {
      panel.style.display = 'none';
    }
  };

  /**
   * Fixes tabs
   * @param  {Object} userOpts the user's options
   * @return {jQuery} this     (allow it to be chainable)
   */
  $.fn.a11yTabs = function (userOpts) {
    var options = $.extend(options, defaults, userOpts);
    return this.each(function (_, container) {
      a11yTabs($(container), options);
    });
  };
})(jQuery);

function a11yTabs($container, options) {
  if (!options.tabSelector || !options.panelSelector) {
    throw new Error('Missing required options!');
  }

  var $tabs = $container.find(options.tabSelector);
  var $panels = $(options.panelSelector);

  /**
   * Attributes
   */

  $container.attr('role', 'tablist');

  // ensure each panel and each tab has a unique id
  $tabs.add($panels).each(setId);

  $tabs.each(function (i, tab) {
    var isSelected = false;
    var $tab = $(tab);
    var $thisPanel = $panels.eq(i);

    // determine the initially active tab (based on activeClass)
    if (options.activeClass && $tab.hasClass(options.activeClass)) {
      isSelected = true;
    }

    $tab.attr({
      'tabIndex': (isSelected) ? 0 : -1, // leveraging jQuery's propFix
      'role': 'tab',
      'aria-selected': isSelected,
      'aria-owns': $thisPanel.prop('id')
    });
  });


  $panels.each(function (i, panel) {
    var $panel = $(panel);
    var $tab = $tabs.eq(i);
    // associate `panel` with it's tab
    noClobber(panel, $tab, 'aria-labelledby');
    $panel.attr({
      'tabIndex': -1,
      'role': 'tabpanel',
      'aria-hidden': $tab.attr('aria-selected') !== 'true'
    });
  });


  /**
   * Events
   */

  $panels.on('keydown', function (e) {
    var $panel = $(this);
    if (e.which === 33) { // PAGE UP
      e.preventDefault();
      // focus the associated tab
      $('[aria-owns="' + $panel.prop('id') + '"]').focus();
    }
  });

  $tabs.off('keydown.a11yTabs');
  $tabs.on('keydown.a11yTabs', function (e) {
    var $tab = $(this);
    var which = e.which;

    switch (which) {
      case 37:
      case 38:
        e.preventDefault();
        switchTab('prev', this, $tabs, $panels, options);
        break;
      case 39:
      case 40:
        e.preventDefault();
        switchTab('next', this, $tabs, $panels, options);
        break;
      case 34: // page down
        e.preventDefault();
        // focus the panel
        $('#' + $tab.attr('aria-owns')).focus();
    }
  });

  $tabs.off('click.a11yTabs');
  $tabs.on('click.a11yTabs', function () {
    var $tab = $(this);
    activateTab($tab, $tabs, $panels, options);
  });
}

function switchTab(dir, tab, $tabs, $panels, options) {
  var index = $.inArray(tab, $tabs);

  if (index === -1) { return; }

  var newIndex = (dir === 'prev') ? index - 1 : index + 1;

  // circularity
  if (newIndex === -1) {
    newIndex = $tabs.length - 1; // the last tab
  } else if (newIndex === $tabs.length) {
    newIndex = 0;
  }

  activateTab($tabs.eq(newIndex), $tabs, $panels, options);
}

function activateTab($newTab, $tabs, $panels, opts) {
  var tabIdx = $.inArray($newTab[0], $tabs);
  var $newPanel = $panels.eq(tabIdx);

  // clean up:
  $panels.attr('aria-hidden', true);

  $tabs.attr({
    'aria-selected': false,
    'tabIndex': -1
  });

  if (opts.panelHide) {
    $panels.each(function () {
      opts.panelHide(this);
    });
  }

  if (opts.inactiveClass) {
    $tabs.addClass(opts.inactiveClass);
    $newTab.removeClass(opts.inactiveClass);
  }


  // activate new one
  $newTab.attr('aria-selected', true);
  $newPanel.attr('aria-hidden', false);

  if (opts.panelShow) {
    opts.panelShow($newPanel[0]);
  }

  if (opts.activeClass) {
    $tabs.removeClass(opts.activeClass);
    $newTab.addClass(opts.activeClass);
  }

  $newTab.prop('tabIndex', 0).focus();
}

function setId(_, element) {
  if (element.id) { return; } // if it already has an id
  element.id = rndid();
}


function noClobber(target, $describer, attr) {
  var value = target.getAttribute(attr);
  value = (value && value.length) ?
    value + ' ' + $describer.prop('id') :
    $describer.prop('id');

  target.setAttribute(attr, value);
}


/**
 * https://github.com/stephenmathieson/rndid
 */
function rndid(length) {
  length = length || 7;
  var id = str(length);
  if (document.getElementById(id)){
    return rndid(length);
  }
  return id;
}

/**
 * Generate a random alpha-char.
 *
 * @api private
 * @return {String}
 */

function character() {
  return String.fromCharCode(Math.floor(Math.random() * 25) + 97);
}

/**
 * Generate a random alpha-string of `len` characters.
 *
 * @api private
 * @param {Number} len
 * @return {String}
 */

function str(len) {
  for (var i = 0, s = ''; i < len; i++) s += character();
  return s;
}