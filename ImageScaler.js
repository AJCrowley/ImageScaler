/*
	Scale the background of an element to always fill the screen
	regardless of aspect ratio

	Usage:
	var imageScaler = new ImageScaler($("selector"));

	Kris McCann, 2013
*/
var ImageScaler = function(element, $)
{
	// allow for passed in jQuery object, default to jQuery if not passed
	$ = $ || jQuery;
	// store reference to self
	var self = this;
	// orientation defaults to blank until we work out where we are
	this.orientation = "";
	// did we get an element to watch?
	if(element === undefined)
	{
		// nope, nothing to do, error out
		throw("FATAL: Expected input element");
	}
	$.when(ImageInfo($(element).css("background-image").replace(/\"|\'|\)|\(|url/g, ""))).then
	(
		function(e)
		{
			// calculate image aspect
			self.aspect = e.width / e.height;
			// store reference to element
			self.element = element;
			// init object
			self.init();
		},
		function(err)
		{
			throw("FATAL: Could not load background image");
		}
	);
};

ImageScaler.prototype =
{
	orientations:
	{
		PORTRAIT: "portrait",
		LANDSCAPE: "landscape"
	},

	init: function()
	{
		// store ref to this
		var self = this;
		// set up listener for resize or orientation change
		$(window).bind
		(
			"resize orientationchange",
			function(e)
			{
				// pass on rather than direct chain so we don't lose context
				self.size(e);
			}
		);
		// and call once for initial size
		this.size();
	},

	size: function(e)
	{
		// store current window aspect
		var currentAspect = $(this.element).width() / $(this.element).height();
		// did we run out of vertical space?
		if(currentAspect < this.aspect)
		{
			// are we already in portrait?
			if(this.orientation !== this.orientations.PORTRAIT)
			{
				// no, set to scale vertically to 100%
				$(this.element).css("background-size", "auto 100%");
				// and now note that we're in portrait
				this.orientation = this.orientations.PORTRAIT;
			}
		}
		// or horizontal space?
		else if(currentAspect > this.aspect)
		{
			// are we already in landscape?
			if(this.orientation !== this.orientations.LANDSCAPE)
			{
				// no, set to scale horizontally to 100%
				$(this.element).css("background-size", "100% auto");
				// and now note that we're in landscape
				this.orientation = this.orientations.LANDSCAPE;
			}
		}
	}
};