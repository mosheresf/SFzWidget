;(function($, window, document, undefined) {
	
	function Iff(element, options) {
		
		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend({}, Iff.Defaults, options);
		
		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);
			
		this.initialize();
	}
	
	Iff.Defaults = {
			required: ['ALL'],
			fontColor: '#fff',
			circle: false,
			position: 'custom',
			custom: {
				bottom: '40px',
				left: '20px'
			},
			backgroundColor: 'transparent',
			img: $('<img src="../images/all.png"></img>'),
			items: [{
				name: 'Facebook',
				backgroundColor: 'transparent',
				url: 'https://www.facebook.com/messages/whateverphones',
				img: $('<img src="../images/facebook.png"></img>'),
				description: 'Facebook',
			}, {
				name: 'WhatsApp',
				backgroundColor: 'transparent',
				img: $('<img src="../images/whatsapp.png"></img>'),
				description: '<form id="whatsappForm" class="iw-form" role="form" action="javascript: sendToWhatsApp();">' +
							  '	<h3>Immediate service via whatsapp<h3>' +
							  '	<input type="text" class="iw-form-control" id="phoneNumber" placeholder="Your number" required autofocus>' +
							  '	<h3>Country - area code - phone number</h3>' +
							  ' <div class="pull-right"><button class="iw-btn" type="submit">Send</button></div>' +
							  '</form>'	
			}, {
				name: 'SMS',
				backgroundColor: 'transparent',
				img: $('<img src="../images/SMS.png"></img>'),
				description: 'SMS'
			}]
		};
		
	
	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Iff.prototype.initialize = function() {
		
		this.$element.addClass('iw-navbar-fixed iw-navbar-minimal animate')
			.css('color', this.options.fontColor);
		
		if (this.options.position.indexOf('custom') > -1) {
			if (this.options.custom.top) {
				this.$element.css('top', this.options.custom.top);
				this.$element.addClass('iw-navbar-top');
			}
			
			if (this.options.custom.bottom) {
				this.$element.css('bottom', this.options.custom.bottom);
				this.$element.addClass('iw-navbar-bottom');
			}
			
			if (this.options.custom.left) {
				this.$element.css('left', this.options.custom.left);
				this.$element.addClass('iw-navbar-left');
			}
			
			if (this.options.custom.right) {
				this.$element.css('right', this.options.custom.right);
				this.$element.addClass('iw-navbar-right');
			}
		}
		else {
			if (this.options.position.indexOf('top') > -1) {
				this.$element.addClass('iw-navbar-top');
			}
			
			if (this.options.position.indexOf('bottom') > -1) {
				this.$element.addClass('iw-navbar-bottom');
			}
			
			if (this.options.position.indexOf('left') > -1) {
				this.$element.addClass('iw-navbar-left');
			}
			
			if (this.options.position.indexOf('right') > -1) {
				this.$element.addClass('iw-navbar-right');
			}
		}
		
		var navToggler = $(document.createElement('div')).addClass("iw-navbar-toggler animate")
				.css('color', this.options.fontColor)
				.css('background-color', this.options.backgroundColor);

		
		if (this.options.img) {
			navToggler.append(this.options.img);
		} else {
			navToggler.append($(document.createElement('span')));
		}
		
		if (this.options.circle) {
			navToggler.addClass('iw-navbar-circle');
		} else {
			navToggler.addClass('iw-navbar-square');
		}
		
		var navContent = $(document.createElement('ul')).addClass('iw-navbar-menu animate');
		
		var descCount = 0;
		var descriptions = [];
		for (var i = 0; i < this.options.items.length; i ++) {
			if (this.options.required.indexOf('ALL') === -1 
					&& this.options.required.indexOf(this.options.items[i].name) === -1) {
				continue;
			}
			
			var item = $(document.createElement('li'));
			var link = $(document.createElement('a')).addClass('animate')
				.css('color', this.options.fontColor);

			if (this.options.items[i].backgroundColor) {
				link.css('background-color', this.options.items[i].backgroundColor);
			} else {
				link.css('background-color', this.options.backgroundColor);
			}
			
			if (this.options.circle) {
				link.addClass('iw-navbar-circle');
			} else {
				link.addClass('iw-navbar-square');
			}
			
			link.attr({
				href: this.options.items[i].url ? this.options.items[i].url : '#'
			});
			
			if (this.options.items[i].description) {
				descriptions[descCount] = $(document.createElement('span')).addClass('desc animate').append(this.options.items[i].description);
				link.append(descriptions[descCount]);
				descCount ++;
			}
			
			if (this.options.items[i].icon) {
				var icon = $(document.createElement('span')).addClass(this.options.items[i].icon);
				link.append(icon);
			}
			
			if (this.options.items[i].img) {
				var img = $(this.options.items[i].img).addClass('iw-navbar-img-responsive');
				link.append(img);
			}
			
			if (this.options.items[i].html) {
				var html = $(this.options.items[i].html);
				link.append(html);
			}
			
			item.append(link);
			navContent.append(item);
		}
		
		this.$element.append(navToggler).append(navContent);
		
		for (var i = 0; i < descCount; i ++) {
			descriptions[i].css('margin-top', (-((descriptions[i].height()/2)+10) +'px'));
		}
	}
	
	
	/**
	 * The jQuery Plugin for the IFF Widget
	 * @public
	 */
	$.fn.iffWidget = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			var $this = $(this),
				data = $this.data('iff.widget');

			if (!data) {
				data = new Iff(this, typeof options == 'object' && options);
				$this.data('iff.widget', data);

				data.$element.find('.iw-navbar-toggler').on('click', function(event) {
					event.preventDefault();
					$(this).closest('.iw-navbar-minimal').toggleClass('open');
				});
			}
		});
	};
	
	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.iffWidget.Constructor = Iff;

})(window.jQuery, window, document);

function sendToWhatsApp() {
	var input = $('#whatsappForm').find('input#phoneNumber');
	var phone = input.val();
	var url = 'http://whateverphones.sytes.net/iff/ivr/';
	
	input.val('');
	
	$.ajax({
		  url: url + phone,
	})
};

function getHostIp(callback) {
	var url = "http://api.hostip.info/get_html.php";
	
	$.ajax({
		url: url,
	}).done(function(data) {
		if (callback) {
			callback(data);
		}
	});
};