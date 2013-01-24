(function () {
    var canvas = document.getElementById("26c").getContext("2d");
    canvas.fillStyle = "blue";
    //Create Hexagons with translation coordinates
    drawHexagon(0,0);
    drawHexagon(75,0);

    function drawHexagon(x,y) {
    canvas.beginPath();
    //top half
    canvas.moveTo(x+55,y+50);
    canvas.lineTo(x+75,y+25);
    canvas.lineTo(x+110,y+25);
    canvas.lineTo(x+130,y+50);
    //bottom half
    canvas.lineTo(x+110,y+75);
    canvas.lineTo(x+75,y+75);
    canvas.closePath();
    //Draw outlined shape
    canvas.fill();
    }
}());