;(function($, window, document, undefined) {
	
	function Iff(element, options) {
		
		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend(true, {}, Iff.Defaults, options);
				
		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);
		
		this.$body = $('body');
		
		this.$intlTelInput = null;
			
		this.initialize();
	}
	
	Iff.Defaults = {
			required: ['ALL'],
			custom: {
				bottom: '0',
				left: '0'
			},
			items: { 
				'Facebook' : {
					url: 'https://www.facebook.com/messages/whateverphones',
					img: $('<img src="../images/w-facebook.png"></img>'),
					description: 'facebook'
				}, 
				'WhatsApp' : {
					needInputForm: true,
					url: 'http://whateverphones.sytes.net/iff/ivr/sfz/',
					img: $('<img src="../images/w-whatsapp.png"></img>'),
					description: 'WhatsApp'
				}, 
				'SMS' : {
					needInputForm: true,
					img: $('<img src="../images/w-sms.png"></img>'),
					description: 'SMS'
				},
				'LiveChat' : {
					img: $('<img src="../images/w-LC.png"></img>'),
					description: 'Live Chat'
				},
				'Mail' : {
					img: $('<img src="../images/w-Email.png"></img>'),
					description: 'Mail'
				}
			}
		};
		
	
	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Iff.prototype.initialize = function() {
		
		function mobileCheck() {
			return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		}
		
		function hideInputForm(el) {
			var iwFormHolder = $(el).parent().parent().parent().parent().find('.iw-form-holder');
			iwFormHolder.removeClass('iw-opened-nav');
			iwFormHolder.css({
				'bottom': '0',
				'left': '0'
			});
			iwFormHolder.attr({
				'data-index': '-1'
			});
		}
		
		function showInputForm(el, url, index, size) {
			var iwFormHolder = $(el).parent().parent().parent().parent().find('.iw-form-holder');
			iwFormHolder.addClass('iw-opened-nav');
			iwFormHolder.find('#countryCode').val('');
			iwFormHolder.find('#phoneNumber').val('');
			iwFormHolder.find('.iw-form').off('submit');

			iwFormHolder.find('.iw-form').submit(function() {
				var input = countryCode.intlTelInput("getSelectedCountryData").dialCode + iwFormHolder.find('#phoneNumber').val();
				input = input.replace('+', '');
				
				console.log(url + input);
				$.ajax({
					  url: url + input,
				}).fail(function(jqXHR, textStatus) {
				    alert( "Request failed: " + jqXHR.statusText );
				})
				
				hideInputForm(el);
				return true;
			});
			
			var bottom, left;
			if (mobileCheck() === true) {
				var innerHeight = window.innerHeight;
				var innerWidth = window.innerWidth;
				if (innerHeight < 260) {
					bottom = innerHeight / 2 + 'px';					
				} else {
					bottom = innerHeight / 1.75 + 'px';
				}
				left = '40%';					
			} else {
				if (typeof index === 'string') {
					index = parseInt(index);
				}
				
				if (typeof size === 'string') {
					size = parseInt(size);
				}
				
				var baseDegrees = (0.65 * Math.PI / size) * index;				
				bottom = Math.cos(baseDegrees)*225.0778+ 56+'px';
				left = Math.sin(baseDegrees)*225.0778 + 56+'px';
			}
			
			console.log("***** " + bottom + " " + left);
			
			iwFormHolder.css({
					'bottom': bottom,
					'left': left
				});
			iwFormHolder.attr({
				'data-index': index
			});
		};
		
		function isMatchPattern(evt, regex) {
			var theEvent = evt || window.event;
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode(key);
			if (!regex.test(key)) {
				theEvent.returnValue = false;
				if (theEvent.preventDefault) {
					theEvent.preventDefault();
				}
			}
		};
		
		function createItem(skew, aAngle, options, key, itemSize, index) {
			var iAngle = (index === 0) ? skew - 22.5 : (index+1) * skew + (67.5 - skew);
			var calcSkew = (index === 0 || index === (itemSize - 1)) ? 90 : skew;
			var calcAAngle = (index === 0) ? aAngle + (90 - skew): aAngle;
			
			var item = $(document.createElement('li'));
			item.css({'transform': 'rotate(' + iAngle + 'deg) skew(' + (90 - calcSkew) + 'deg)'});
			
			var link = null;
			if (options.items[key].needInputForm === true) {
				link = $(document.createElement('div'));
				link.attr({
					'data-link': options.items[key].url ? options.items[key].url : '#',					 
					'data-index': index
				});
			} else {
				link = $(document.createElement('a'));
				link.attr({
					href: options.items[key].url && options.items[key].needInputForm !== true ? options.items[key].url : '#',
					'data-index': index
				});

			}
				
			link.css({'transform': 'skew(' + (90 - calcSkew) * -1 + 'deg) rotate(' + calcAAngle + 'deg) scale(1)'});
			link.on('click', function() {
				$(this).blur();
				
				var iwFormHolder = $(this).parent().parent().parent().parent().find('.iw-form-holder');
				var formDataIdx = iwFormHolder.attr('data-index');
				var dataIdx = $(this).attr('data-index');
				if (dataIdx === formDataIdx) {
					hideInputForm(this);
				} else {
					var dataLink = $(this).attr('data-link');

					if (dataLink) {
						showInputForm(this, dataLink, dataIdx, itemSize);
					} else {
						hideInputForm(this);
					}				
				}
			});
			
			if (options.items[key].description) {
				var span = $('<span>' + options.items[key].description + '</span>');
				link.append(span);
			}
			
			if (options.items[key].img) {
				var img = $(options.items[key].img);
				link.append(img);
			}
			
			return item.append(link);
		}		

		this.$element.addClass('iw-component');
		
		if (this.options.custom) {
			this.$element.css(this.options.custom);
		}
		
		var iwCnOverlay = $(document.createElement('div')).addClass('iw-cn-overlay');
		
		var iwCnButton = $(document.createElement('button')).addClass('iw-cn-button')
							.append($('<img src="../images/HelpOnGo-button.png"></img>'));
		
		var iwCnWrapper = $(document.createElement('div')).addClass('iw-cn-wrapper');
		iwCnWrapper.append($(document.createElement('div')).addClass('iw-cn-sm-cover'));
		iwCnWrapper.append($(document.createElement('div')).addClass('iw-cn-bg-cover'));

		var itemSize = this.options.required.indexOf('ALL') !== -1 ? Object.keys(this.options.items).length : this.options.required.length;

		var skew = 135 / itemSize;
		var aAngle = 135/(2 * itemSize) - 90;
		var iwCnUl = $(document.createElement('ul'));

		for (var j = 0; j < this.options.required.length; j ++) {
			if (this.options.required[j] === 'ALL') {
				var i = 0;
				for (var key in this.options.items) {
					iwCnUl.append(createItem(skew, aAngle, options, key, itemSize, i));
					i ++;
				}
				break;

			} else {
				iwCnUl.append(createItem(skew, aAngle, this.options, this.options.required[j], itemSize, j));
				
			}
		}
		iwCnWrapper.append(iwCnUl);	
		
		var countryCode = $(document.createElement('input')).addClass('iw-form-control')
			.attr({
				'type': 'tel',
				'id': 'countryCode',
				'name': 'countryCode'
			}).keypress(function(evt) {
				isMatchPattern(evt, /[\+0-9]/);
			});
		var phoneNumber = $(document.createElement('input')).addClass('iw-form-control')
			.prop('required',true).attr({
				'type': 'tel',
				'id': 'phoneNumber',
				'name': 'phoneNumber'
			}).keypress(function(evt) {
				isMatchPattern(evt, /[0-9\r]/);
			});
		var submitBtn = $(document.createElement('button')).addClass('iw-btn')
			.attr({'type': 'submit'})
			.append($('<img src="../images/Aicon-send.png"></img>'));
		var iwFormInline = $(document.createElement('div')).addClass('iw-form-inline')
			.append(countryCode).append(phoneNumber).append(submitBtn);
		var iwFormGroup = $(document.createElement('div')).addClass('iw-form-group')
			.append($(document.createElement('label')).text('phone number:').attr({
				'for' : 'phoneNumber'
			}))
			.append(iwFormInline)
			.append($(document.createElement('a')).text('www.servicefriendz.com').addClass('iw-form-link')
					.attr({
						'href': 'http://www.servicefriendz.com'
					}));
		var iwForm = $(document.createElement('form')).addClass('iw-form')
			.attr({
				'action': 'javascript:void(0);',
			})
			.append(iwFormGroup);
		var iwFormHolder = $(document.createElement('div')).addClass('iw-form-holder')
			.append(iwForm);

		this.$body.append(iwCnOverlay);
		this.$element.append(iwCnButton).append(iwCnWrapper).append(iwFormHolder);
		this.$intlTelInput = countryCode.intlTelInput({
			autoHideDialCode: false,
			nationalMode: false,
			defaultCountry: 'auto'
		});
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

				var open = false;
				
				var overlay = data.$body.find('.iw-cn-overlay');
				var wrapper = data.$element.find('.iw-cn-wrapper');
				var iwFormHolder = data.$element.find('.iw-form-holder');
				data.$element.find('.iw-cn-button').on('click', function(event) {
					event.preventDefault();
					if (!open) {
						overlay.addClass('iw-opened-nav');
						wrapper.addClass('iw-opened-nav');
					}
					else {
						wrapper.removeClass('iw-opened-nav');
						iwFormHolder.removeClass('iw-opened-nav');
						iwFormHolder.css({
							'bottom': '0',
							'left': '0'
						});
						iwFormHolder.attr({
							'data-index': '-1'
						});
						overlay.removeClass('iw-opened-nav');
					}
					open = !open;
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

function getHostIp(callback) {
	var url = "http://ipinfo.io/json";
	
	$.ajax({
		url: url,
	}).done(function(data) {
		if (callback) {
		    callback(data);
		}
	}).fail(function(jqXHR, textStatus) {
		if (callback) {
			callback();
		}
	});
};