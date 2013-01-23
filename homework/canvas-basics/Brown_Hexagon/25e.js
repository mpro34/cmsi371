(function () {
    var canvas = document.getElementById("25e").getContext("2d");
    canvas.fillStyle = "#663300";
    canvas.beginPath();
    //top half
    canvas.moveTo(100,150);
    canvas.lineTo(150,50);
    canvas.lineTo(300,50);
    canvas.lineTo(350,150);
    //bottom half
    canvas.lineTo(300,250);
    canvas.lineTo(150,250);
    canvas.closePath();
    //Draw outlined shape
    canvas.fill();
}());