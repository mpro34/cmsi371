(function () {
    var canvas = document.getElementById("27d").getContext("2d");

    // JD: Watch out---radialGradient is a global variable!
    //     Plus, "radialGradient" isn't quite the best name for it.
    radialGradient = canvas.createRadialGradient(160, 160, 1, 180, 180, 320);
    radialGradient.addColorStop(0, "white");
    radialGradient.addColorStop(1, "yellow");
    //Smiley Outline
    canvas.fillStyle = radialGradient;
    canvas.beginPath();
    canvas.arc(256, 256, 200, 0, Math.PI * 2, true);
    canvas.fill();
    //Smiley Mouth
    canvas.fillStyle = "Black";
    canvas.beginPath();
    canvas.arc(256, 300, 75, Math.PI, 0, true);
    canvas.fill();
    //Smiley Eyes
    canvas.beginPath();
    canvas.arc(190, 185, 30, 0, Math.PI * 2, true);
    canvas.arc(320, 185, 30, 0, Math.PI * 2, true);
    canvas.fill();
}());