(function () {
    var canvas = document.getElementById("26d").getContext("2d");
    canvas.fillStyle = "blue";
    drawDots(100,100);

    function drawDots(x,y) {
    canvas.beginPath();
    canvas.arc(x, y, 30, 0, Math.PI * 2, true);
    canvas.fill();
    }
}());