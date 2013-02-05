(function () {
    var canvas = document.getElementById("28e").getContext("2d");

    // JD: You have a bunch of unnecessary hardcodes here.  These impact
    //     this program in particular because they are all over the place.
    //     If your canvas is resized in HTML, that will trigger a cascade
    //     of changes here.

    //dark blue sky
    canvas.fillStyle = "#000047";
    canvas.fillRect(0,0,600,500);
    //Function that draws random buildings and windows
    for (var i=0; i<600; i+=100) {
        canvas.fillStyle = "black";
        var x=i; //Generate a random sized building every 100 pixels
        var y=Math.floor(Math.random()*450); //Smallest building is 50 pixels
        var w=Math.floor(80+Math.random()*150);
        canvas.fillRect(x,y,w,600); //Want all buildings to reach the bottom
        canvas.fillStyle = "yellow";
        var windowCount = Math.floor(Math.random()*(Math.floor(w/35)));
        var size = 5; //Variable that continues the random window pattern down a building.
        while (size <= 600) {
            for (var j=0; j<=windowCount; j++) {
                canvas.fillRect(x+5+(30*j),y+size,25,25);
            }
            size+=40;
        }
    }
}());