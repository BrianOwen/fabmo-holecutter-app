$( document ).ready(function() {
	$('.advanced').hide();
	fabmoDashboard.getConfig(function(err, data) {
      if(err) {
        console.log(err);
      } else {
		  var xMax = data.machine.envelope.xmax.toString();
		  $('#diameter').attr('data-parsley-max', xMax);
	  }
	});  
});

$('#diameter').on('keyup', function(){
	if ($('#diameter').val().length > 0) {
		$('.diameter-id').text($('#diameter').val()+'"')
	} else {
		$('.diameter-id').text('')
	}
});

$('#depth').on('keyup', function(){
	if ($('#depth').val().length > 0) {
		$('.depth-id').text($('#depth').val()+'"')
	} else {
		$('.depth-id').text('')
	}
});

$('.center-bit').on('click', function (){
	fabmoDashboard.getConfig(function(err, data) {
      if(err) {
        console.log(err);
      } else {
		  var xMax = data.machine.envelope.xmax;
		  var yMax = data.machine.envelope.ymax;
		  var xCenter = xMax/2;
		  var yCenter = yMax/2;
		  var gcode = "G0 X" + xCenter + " Y" + yCenter + " Z" + 1;
		  fabmoDashboard.runGCode(gcode);
	  }
	});
	$('.modal-content p').text('This will be the center of your hole. Make sure it is aligned properly!');
	$('.modal, .modal-container').fadeIn();
});

$('.exit-modal').on('click', function (){
	$('.modal, .modal-container').fadeOut('fast');
});

$('.basic-link').on('click', function (){
	$('.basic').show();
	$('.advanced').hide();
	$('.lock').hide();
	$('.unlock').hide();
	$('.advanced').attr("disabled", "true");
	$('.advanced + ul').hide();
	$('.basic + ul').show();
});
$('.advanced-link').on('click', function (){
	$('.basic').hide();
	$('.advanced').show();
	$('.lock').show();
	$('.unlock').hide();
	$('.advanced').attr("disabled", "true");
	$('.parsley-required').hide();
	$('.advanced + ul').show();
	$('.basic + ul').hide();
});

$('.lock').on('click', function (){
	$('.lock').hide();
	$('.unlock').show();
	$('.advanced').removeAttr('disabled');
});

$('.unlock').on('click', function (){
	$('.lock').show();
	$('.unlock').hide();
	$('.advanced').attr("disabled", "true");
});

$('#submit').on('click', function (){
	$('.basic-setting').parsley().on('form:submit', function() {
	fabmoDashboard.getConfig(function(err, data) {
      if(err) {
      } else {
		  var xMax = data.machine.envelope.xmax;
		  var yMax = data.machine.envelope.ymax;
		  var xCenter = xMax/2;
		  var yCenter = yMax/2;
		  var diameter = parseFloat($('#diameter').val());
		  var speed = parseFloat($('#feed-rate').val());
		  var cutThrough = parseFloat($('#cut-through').val());
		  var depth = parseFloat($('#depth').val());
		  var bitDiameter = parseFloat($('#bit-diameter').val());
		  console.log(depth);
		  var depthTotal = depth + cutThrough;
		  console.log(depthTotal);
		  var maxPlunge = bitDiameter * .75;
		  var passes = Math.ceil(depthTotal/maxPlunge);
		  console.log(passes);
		  var plunge = 0-(depthTotal/passes);
		  var shopbotCode = ["'Simple Circle'", 
		  "'Center: " + xCenter + "," + yCenter + " Diameter: " + diameter + "'",
		  "'Spindle On'",
		  "SO, 1,1",
		  "MS,"+speed,
		  "pause 3",
		  "CP,"+diameter+","+xCenter+","+yCenter+",T,,,,"+plunge+","+passes+",,,,,,",
		  "SO, 1,0",
		  "'Safe Z'",
		  "MZ, 1",
		  "'Jog Home'",
		  "M2, 0"
		  ];
		 var code = shopbotCode.join('\n');
		  fabmoDashboard.submitJob(code, {filename : 'example-circle.sbp',
                                	name : diameter + '" Diameter Circle',
                                    description : diameter + '" diameter circle centered at ' + xCenter + ',' + yCenter + ' at a depth of ' + depth + '"' 
    	});
		
	  }
});
});
});