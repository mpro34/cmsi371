(function () {
    var canvas = document.getElementById("27b").getContext("2d");

    // JD: There is a small bit of missed opportunity here to separate
    //     your "cube"'s data from the drawing code, as can be seen
    //     from the shared or derived coordinates used.

    //front face
    canvas.fillStyle = "#A9A9A3";
    canvas.fillRect(100,100,100,100);
    //right face
    canvas.fillStyle = "#65655B";
    canvas.beginPath();
    canvas.moveTo(200,100);
    canvas.lineTo(250,50);
    canvas.lineTo(250,150);
    canvas.lineTo(200,200);
    canvas.fill();
    //left face
    canvas.fillStyle = "#84847C";
    canvas.beginPath();
    canvas.moveTo(100,100);
    canvas.lineTo(150,50);
    canvas.lineTo(250,50);
    canvas.lineTo(200,100);
    canvas.fill();   
}());