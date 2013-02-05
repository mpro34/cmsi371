(function () {
    var canvas = document.getElementById("26c").getContext("2d");
    canvas.fillStyle = "blue";
    //Create Hexagons with translation coordinates
    //First Row
    // JD: What??? What's a drawHexagon?  Where is that?
    //     Ohhhhhh, it's defined at the *bottom*.  But actually,
    //     it isn't---JavaScript semantics make all declarations
    //     active for the entire function.  So, better to declare
    //     your function at the top.  Plus, just use the var
    //     notation.  The function statement is syntactic sugar
    //     that does not actually match what JavaScript is doing.
    drawHexagon(0,0);
    drawHexagon(75,0);
    drawHexagon(150,0);
    //Second Row
    // JD: A true honeycomb actually has the hexagons interspersed
    //     such that there are no non-hexagonal spaces in between.
    //     Fortunately, because you separated out the hexagon
    //     drawing code, this is an easy adjustment to make.
    drawHexagon(0,50);
    drawHexagon(75,50);
    drawHexagon(150,50);
    //Third Row
    drawHexagon(0,100);
    drawHexagon(75,100);
    drawHexagon(150,100);

    // JD: Already mentioned is the need to put this at the top,
    //     as just one more var declaration.
    //
    //     Not yet mentioned is that the body of the function is
    //     totally misindented.
    function drawHexagon(x,y) {
        // JD: Alternatively, you can use translate here.
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