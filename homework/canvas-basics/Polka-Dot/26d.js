(function () {
    var canvas = document.getElementById("26d").getContext("2d");
    canvas.fillStyle = "#330000";
    canvas.fillRect(0,0,600,600);
    canvas.fillStyle = "pink";
    for (var j=0; j<=10; j++) {
        for (var i=0; i<=10;i++) {
            drawDots(30+(60*i),30+(60*j));
        }
    }
    //Function that draws a pink dot
    function drawDots(x,y) {
    canvas.beginPath();
    canvas.arc(x, y, 30, 0, Math.PI * 2, true);
    canvas.fill();
    }
}());