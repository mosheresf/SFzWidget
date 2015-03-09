# SFzWidget
Widget to integrate into sites using servicefriendz

See below instructions for Widget
How to setup
Including files
<link rel="stylesheet" src="../css/widget.css">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> 
<script src="../js/iffWidget.js"></script>
Usage
Create <div id="iffWidget"></div>
Add the following javascript
$(document).ready(function () {
				
				$('.iw-navbar-toggler').on('click', function(event) {
					event.preventDefault();
					$(this).closest('.iw-navbar-minimal').toggleClass('open');
				});
				
				$('#iffWidget').iffWidget({
					required: ['Facebook', 'WhatsApp']
				});
			});
Example
$('#iffWidget').iffWidget() -- Show all options
$('#iffWidget').iffWidget({ required: ['Facebook', 'WhatsApp'] }) -- Show Facebook and WhatsApp only.
$('#iffWidget').iffWidget({ required: ['SMS'] }) -- Show SMS only

Edit iffWidget.js to point to your 
facebook message page: https://www.facebook.com/messages/<companyPage>
SFZ system: http://<yourCompany>/servicefriendz.com/iff/ivr/
