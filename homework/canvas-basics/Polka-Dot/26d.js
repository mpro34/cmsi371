(function () {
    var canvas = document.getElementById("26d").getContext("2d");
    canvas.fillStyle = "#330000";
    canvas.fillRect(0,0,600,600);
    // JD: Unnecessary ^^^^^^^^^ hardcode here.
    canvas.fillStyle = "pink";

    // JD: Even index variables go up top, and += 1 is preferred over ++
    //     (this is a JavaScript-specific preference).
    for (var j=0; j<=10; j++) {
        for (var i=0; i<=10;i++) {
            drawDots(30+(60*i),30+(60*j));
        }
    }
    //Function that draws a pink dot
    // JD: Same notes here as in 26c.js (var, indentation, translate).
    function drawDots(x,y) {
    canvas.beginPath();
    canvas.arc(x, y, 30, 0, Math.PI * 2, true);
    canvas.fill();
    }
}());