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
					url: 'http://whateverphones.sytes.net/iff/sms/sfz/',
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
		
		function validateInput() {
			var phoneNumber = iwFormHolder.find('#phoneNumber');
			if (phoneNumber.val().length === 0) {
				return false;
			}
			return true;
		}
		
		function hideInputForm(component) {
			var iwFormHolder = component.find('.iw-form-holder');
			iwFormHolder.removeClass('iw-opened-nav');
			iwFormHolder.css({
				'bottom': '0',
				'left': '0'
			});
			iwFormHolder.attr({
				'data-index': '-1'
			});
		}
		
		function showInputForm(component, url, index, size) {
			var dialCode = '';
			if (countryCode.intlTelInput('getSelectedCountryData').dialCode !== undefined) {
				dialCode = '+' + countryCode.intlTelInput('getSelectedCountryData').dialCode;
			} else {
				dialCode = '+1';
				countryCode.intlTelInput('setNumber', '+1');
			}
			
			var iwFormHolder = component.find('.iw-form-holder');
			iwFormHolder.addClass('iw-opened-nav');
			iwFormHolder.find('#countryCode').val(dialCode);
			iwFormHolder.find('#phoneNumber').val('');
			iwFormHolder.find('#phoneNumber').focus();
			iwFormHolder.find('.iw-form').off('submit');

			iwFormHolder.find('.iw-form').submit(function(evt) {
				if (!validateInput()) {
					if (mobileCheck() === true) {
						component.css({'display': 'none'});
					}
					window.setTimeout(function () {
						if (mobileCheck() === true) {
							component.css({'display': 'block'});
						}
						iwFormHolder.find('#phoneNumber').focus();
					}, 50);
					return false;
				}
				
				var dialCode = countryCode.intlTelInput("getSelectedCountryData").dialCode
				var phoneNumber = iwFormHolder.find('#phoneNumber');				
				var input = dialCode.replace('+', '') + phoneNumber.val();
				
				console.log(url + input);
				$.ajax({
					  url: url + input,
				}).fail(function(jqXHR, textStatus) {
				    alert( "Request failed: " + jqXHR.statusText );
				})

				if (mobileCheck() === true) {
					component.find('.iw-cn-wrapper').removeClass('iw-opened-nav');	
				}
				iwFormHolder.find('.iw-form-greeting').css({'display': 'block'});
				iwFormHolder.find('.iw-form-details').css({'display': 'none'});
				
				window.setTimeout(function () {
					iwFormHolder.find('.iw-form-greeting').css({'display': 'none'});
					iwFormHolder.find('.iw-form-details').css({'display': 'block'});
					component.find('.iw-cn-button').trigger('click');
					
				}, 3000);
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
				left = (innerWidth / 2) - 62 + 'px';					
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
		
		function adjustComponentHeight(component, isIncrease) {
			var bottom = component.css('bottom');
			var innerHeight = window.innerHeight;
			var increaseTo = 170;
			if (innerHeight < 260) {
				increaseTo = 60;
			}
			if (!isIncrease) {
				increaseTo = increaseTo * -1;
			}
		
			component.css({
				bottom: parseFloat(bottom.replace('px', '')) + increaseTo + 'px' 
			});
		}
		
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
				
				var iwFormHolder = iwComponent.find('.iw-form-holder');
				var formDataIdx = iwFormHolder.attr('data-index');
				var dataIdx = $(this).attr('data-index');
				if (dataIdx === formDataIdx) {
					hideInputForm(iwComponent);
				} else {
					var dataLink = $(this).attr('data-link');

					if (dataLink) {
						showInputForm(iwComponent, dataLink, dataIdx, itemSize);
					} else {
						hideInputForm(iwComponent);
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

		var iwComponent = this.$element;
		iwComponent.addClass('iw-component');
		
		if (this.options.custom) {
			iwComponent.css(this.options.custom);
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
				'name': 'countryCode',
				'tabindex' : '1'
			}).keypress(function(evt) {
				isMatchPattern(evt, /[\+0-9]/);
			}).focus(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, false);
				}
			}).blur(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, true);
				}
			});
		var phoneNumber = $(document.createElement('input')).addClass('iw-form-control')
			.prop('required',true).attr({
				'type': 'tel',
				'id': 'phoneNumber',
				'name': 'phoneNumber',
				'tabindex' : '2',
				'autocomplete': 'off'
			}).keypress(function(evt) {
				isMatchPattern(evt, /[0-9\r\t]/);				
			}).keydown(function(evt) {
				if (evt.which === 9) {
					iwComponent.find('.iw-form').submit();
				}
			}).focus(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, false);
				}
			}).blur(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, true);
				}
			});
		var submitBtn = $(document.createElement('button')).addClass('iw-btn')
			.attr({
				'id': 'submitButton',
				'type': 'submit',
				'tabindex' : '3'
			})
			.append($('<img src="../images/Aicon-send.png"></img>'));
		var iwFormInline = $(document.createElement('div')).addClass('iw-form-inline')
			.append(countryCode).append(phoneNumber).append(submitBtn);
		var iwFormGreeting = $(document.createElement('div')).addClass('iw-form-greeting')
			.text('Thank you. you will receive a message in a sec :)');
		var iwFormDetails = $(document.createElement('div')).addClass('iw-form-details')
			.append($('<label>', {text: 'phone number:', 'for' : 'phoneNumber'}))
			.append(iwFormInline)
			.append($('<a>', {
				text: 'www.servicefriendz.com', 
				'class': 'iw-form-link', 
				'href': 'http://www.servicefriendz.com'
			}));
		var iwFormGroup = $(document.createElement('div')).addClass('iw-form-group')
			.append($('<div>', {html: '\&times;', 'class': 'iw-form-close'})
					.click(function(evt) {
						hideInputForm(iwComponent);
					}))
			.append(iwFormGreeting).append(iwFormDetails);
		var iwForm = $(document.createElement('form')).addClass('iw-form')
			.attr({
				'action': 'javascript:void(0);'
			})
			.append(iwFormGroup);
		var iwFormHolder = $(document.createElement('div')).addClass('iw-form-holder')
			.append(iwForm);

		this.$body.append(iwCnOverlay);
		iwComponent.append(iwCnButton).append(iwCnWrapper).append(iwFormHolder);
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