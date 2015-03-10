# SFzWidget
Widget to integrate into sites using servicefriendz

See below instructions for Widget
How to setup
Including files
<link rel="stylesheet" src="../css/widget.css">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> 
<script src="../js/iffWidget.js"></script>
Usage

 IVR and FB as parameters
Usage
Create <div id="iffWidget"></div>
Add the following javascript
$(document).ready(function () {
				
				$('.iw-navbar-toggler').on('click', function(event) {
					event.preventDefault();
					$(this).closest('.iw-navbar-minimal').toggleClass('open');
				});
				
				$('#iffWidget').iffWidget({
					required: ['Facebook', 'WhatsApp'],
items: {
'Facebook' : {
url: 'https://www.facebook.com/messages/whateverphones'
},
'WhatsApp' : {
url: 'http://whateverphones.sytes.net/iff/ivr/'
}
}
				});
			});
Example
Show all options
$('#iffWidget').iffWidget()

Show Facebook and WhatsApp only, with updated the URL for Facebook.
$('#iffWidget').iffWidget({ 
required: ['Facebook', 'WhatsApp'], 
items: {'Facebook' : {url: 'https://www.facebook.com/messages/whateverphones'}}

 }) 
Show SMS only
$('#iffWidget').iffWidget({ required: ['SMS'] })


2. Country based IM
Usage
getHostIp( callback )  By calling the getHostIp function and pass a callback function as a parameter, the callback function will accept an input parameter (IP).
Add the following javascript
$(document).ready(function () {
				
				getHostIp(function(ip) {
if (ip) {
$('#iffWidget').iffWidget({...});
} else {
$('#iffWidget').iffWidget({...});
} 
});		
});

Example
$('#iffWidget').iffWidget() -- Show all options
$('#iffWidget').iffWidget({ required: ['Facebook', 'WhatsApp'] }) -- Show Facebook and WhatsApp only.
$('#iffWidget').iffWidget({ required: ['SMS'] }) -- Show SMS only
