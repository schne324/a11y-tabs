# A11y Tabs
Creating fully accessible tabs

## Installation
`bower install a11y-tabs`

## Options
- `tabSelector` _({String} [required])_: The selector for the tab elements.  This selector will be qualified within `this` (the tab container) (Defaults to `'li'`)
- `panelSelector` _({String} [required])_: The selector for the panel elements.  This selector will be qualified within `document.body`. (Defaults to `'.panels li'`)
- `activeClass` _({String} [optional])_:  The class which determines the initally active tab / the class to be added to a newly activated tab. (Defaults to `'active'`)
- `inactiveClass` _({String} [optional])_: The class to be added to a newly inactive tab. (Defaults to `null`)
- `panelShow` _({Function} [optional])_: The function that is called when a given panel's tab is activated.  The element ref to the given panel is passed in as the only parameter. (Defaults to `function (panel) { panel.style.display = 'block'; }`)
- `panelHide` _({Function} [optional])_: The function that is called when a given panel's tab is made inactive. The element ref to the given panel is passed in as the only parameter. (Defaults to `function (panel) { panel.style.display = 'none'; }`)

## Usage
```js
// call a11yTabs on the tab container
$('.tabs').a11yTabs({
	tabSelector: 'li.tab',
	panelSelector: '.panel',
	activeClass: 'tab-active',
	inactiveClass: 'tab-inactive',
	panelShow: function (panel) {
		$(panel).show().data('showing', true);
	},
	panelHide: function (panel) {
		$(panel).hide().data('showing', false);
	}
});
```

## Tests
run tests with the command `gulp test`

## Building custom examples
Out of the box, you can find an example (`build/example.html`) which contains a simple call to `a11yTabs`.  If you'd like to play around with the options you can edit `templates/example.jade` as well as `styles/example.styl` and run `gulp` which will build the template and stylus file into the build directory.

- Protip: When editing examples, it may be useful to run `gulp watch` so you don't have to manually execute `gulp` every time you make a jade or stylus change.