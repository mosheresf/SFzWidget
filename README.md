# SFzWidget
Widget to integrate into sites using servicefriendz

See below instructions for Widget
How to setup
Dependency:
jQuery
IntlTelInput
Getting Started:
Link the stylesheet
<link rel="stylesheet" href="path/to/intlTelInput.css">
<link rel="stylesheet" href="path/to/widget2.css">
Add the plugin script  and initialize it on your element
<div id="sfzWidget"></div>
<script src="path/to/jquery.min.js"></script>
<script src="path/to/intlTelInput.min.js"></script>
<script src="path/to/iffwidget2.js"></script>
<script>
  $("#sfzWidget").iffWidget();
</script>

Options:
custom, type object default: bottom is 0px, left is 0px
Example:
custom : {
bottom: '20px',
left: '30px'
}
required, type: array, default: ['ALL'], valid values: 'WhatsApp', 'LiveChat', 'SMS', 'Facebook', 'Mail' and custom value in the items object.
items, type object, default: basic setup for  'WhatsApp', 'LiveChat', 'SMS', 'Facebook', 'Mail'
Example:
items: {
'WhatsApp' : {
needInputForm: true,
url: 'http://whateverphones.sytes.net/iff/ivr/sfz/',
img: $('<img src="../images/w-whatsapp.png"></img>'),
description: 'WhatsApp'
},

'CustomItem' : {
url: 'https://www.something.com',
img: $('<img src="../images/something.png"></img>'),
description: 'Custom Item'
}
}

Country support:
Example: 
getHostIp(function(data) {
if (data.ip) {
$('#sfzWidget').iffWidget({
custom: {
bottom: '0px'
},
required: ['WhatsApp', 'LiveChat', 'SMS', 'Facebook']
});
} else {
$('#sfzWidget').iffWidget({
required: ['WhatsApp', 'SMS']
});
}
});
