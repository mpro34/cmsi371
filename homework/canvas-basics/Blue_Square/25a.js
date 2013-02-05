(function () {
    // JD: Strictly speaking, you are holding onto the canvas's
    //     *rendering context*, not the canvas itself.
    var canvas = document.getElementById("25a").getContext("2d");
    canvas.fillStyle = "blue";
    canvas.fillRect(256,256,200,200);
}());