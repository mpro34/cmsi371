(function () {
    var canvas = document.getElementById("25e").getContext("2d");
    canvas.fillStyle = "brown";
    canvas.beginPath();
    //top half
    canvas.moveTo(150,100);
    canvas.lineTo(200,50);
    canvas.lineTo(300,50);
    canvas.lineTo(350,100);
    //bottom half
    canvas.lineTo(200,50);
    canvas.lineTo(300,50);
    canvas.lineTo(350,100);
    canvas.closePath();
    //Draw outlined shape
    canvas.fill();
}());