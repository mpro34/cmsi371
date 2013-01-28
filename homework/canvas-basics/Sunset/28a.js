(function () {
    var canvas = document.getElementById("28a").getContext("2d");
    //dark blue sky
    canvas.fillStyle = "#33334C";
    canvas.fillRect(0,0,600,500);
  /*  canvas.fillStyle = "black";
    //Function that draws random buildings and windows
    for (var i=0; i<10; i++) {
        var x=Math.floor(Math.random()*500);
        var y=Math.floor(Math.random()*450); //Smallest building is 50 pixels
        var w=Math.floor(60+Math.random()*200);
        canvas.fillRect(x,y,w,600); //Want all buildings to reach the bottom
    }*/

  
}());