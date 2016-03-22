$(document).ready( function(){
    //Get the canvas &
    var c = $('#webgl');
    var ct = c.get(0).getContext('3d');
    var container = $(c).parent();
	
    //Run function when browser resizes
    $(window).resize( respondCanvas );

    function respondCanvas(){ 
        c.attr('width', $(container).width() ); //max width
		console.log('width');
		console.log(c.attr('width', $(container).width() ));
        c.attr('height', $(container).height() ); //max height 

        //Call a function to redraw other content (texts, images etc)
    }

    //Initial call 
    respondCanvas();

}); 