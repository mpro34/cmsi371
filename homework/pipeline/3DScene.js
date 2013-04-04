/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl, // The WebGL context.

        // This variable stores 3D model information.
        objectsToDraw,

        // The shader program to use.
        shaderProgram,

        // Utility variable indicating whether some fatal has occurred.
        abort = false,

        // Important state variables.
        currentRotation = 0.0,
        currentInterval,
        rotationMatrix,
        orthoMatrix,
        translationMatrix,
        scaleMatrix,
        vertexPosition,
        vertexColor,

        // An individual "draw object" function.
        drawObject,

        // The big "draw scene" function.
        drawScene,

        // Reusable loop variables.
        i,
        maxi,
        j,
        maxj,
        k,
        maxk,


    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.
    objectsToDraw = [

        {
            color: { r: 0.0, g: 1.0, b: 0.0 },
            vertices: Shapes.sphere(),
            mode: gl.TRIANGLE_STRIP, 
            subshapes: [
                {
                    color: { r: 0.0, g: 0.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    subshapes: [
                        {
                            color: { r: 1.0, g: 0.0, b: 0.0 },
                            vertices: Shapes.toRawLineArray(Shapes.hexahedron()),
                            mode: gl.LINES,
                            subshapes: []
                        }
                    ]
                }
            ]
        },

        {
            color: { r: 0.0, g: 0.0, b: 1.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
            mode: gl.TRIANGLES,
            subshapes: [
                {
                    color: { r: 1.0, g: 1.0, b: 0.0 },
                    vertices: [].concat(
                        [ 0.25, 0.5, 0.5 ],
                        [ -0.25, 0.0, 0.5 ],
                        [ 0.5, 0.0, 0.5 ]
                        
                    ),
                    mode: gl.TRIANGLES,
                    subshapes: []
                }
            ]
        } 
        
    ];

    // Pass the vertices to WebGL.
    for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {

        (checker = function (subs) {
            for (var num in subs) {
                if (num === "subshapes") {
                    for (j = 0; subLength = subs[num].length, j < subLength; j += 1) { 
                        subs[num][j].buffer = GLSLUtilities.initVertexBuffer(gl,
                            subs[num][j].vertices);
                     /*   if (!subs.colors) {
                        // If we have a single color, we expand that into an array
                        // of the same color over and over.
                            subs.colors = [];
                            for (j = 0, maxj = subs.vertices.length / 3; j < maxj; j += 1) {
                                subs.colors = subs.colors.concat(
                                    subs.color.r,
                                    subs.color.g,
                                    subs.color.b
                                );
                            }
                        }
                        subs.colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                            subs.colors);  */

                        checker(subs[num][j]);                           
                    } 
                    subs.buffer = GLSLUtilities.initVertexBuffer(gl,
                        subs.vertices);
                    if (!subs.colors) {
                    // If we have a single color, we expand that into an array
                    // of the same color over and over.
                        subs.colors = [];
                        for (j = 0, maxj = subs.vertices.length / 3; j < maxj; j += 1) {
                            subs.colors = subs.colors.concat(
                                subs.color.r,
                                subs.color.g,
                                subs.color.b
                            );
                        }
                    }
                    subs.colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                        subs.colors);
                }
            }
               
            }); checker(objectsToDraw[i]);
    }

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);
    rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    orthoMatrix = gl.getUniformLocation(shaderProgram, "orthoMatrix");  //New Transform
    translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");  //New Transform
    scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");  //New Transform

    /*
     * Displays an individual object.
     */
    drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);
    };

    /*
     * Displays the scene.
     */
    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up the rotation matrix.
        gl.uniformMatrix4fv(rotationMatrix, 
            gl.FALSE, new Float32Array(
                Matrix4x4.getRotationMatrix(currentRotation, 0, 1, 0).toWebGLArray()   
            )
        );

        // Display the objects.

        var subfound,
            subLength,
            i,
            j;

        //Recursively draw objects, check for subshapes, and respectively draw each subshape.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            (checkSub = function (subs) {
                for (var num in subs) {
                    if (num === "subshapes") {
                        for (j = 0; subLength = subs[num].length, j < subLength; j += 1) { 
                            drawObject(subs[num][j]);
                            checkSub(subs[num][j]);                           
                        }
                    }  drawObject(subs);
                }
            }); checkSub(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    //Set up ortho projection matrix (t, b, l, r, n, f)                                
    gl.uniformMatrix4fv(orthoMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.ortho(-10, 10, -10, 10, 5, 500).toWebGLArray()
        )
    );

    //Set up translation matrix (tx, ty, tz)
    gl.uniformMatrix4fv(translationMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.getTranslationMatrix(0.5, 0.5, 0).toWebGLArray()
        )
    );

    //Set up scale matrix (sx, sy, sz)
    gl.uniformMatrix4fv(scaleMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.getScaleMatrix(0.5, 0.5, 0).toWebGLArray()
        )
    );


    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        if (currentInterval) {
            clearInterval(currentInterval);
            currentInterval = null;
        } else {
            currentInterval = setInterval(function () {
                currentRotation += 1.0;
                drawScene();
                if (currentRotation >= 360.0) {
                    currentRotation -= 360.0;
                }
            }, 30);
        }
    });
//Add another feature here later
    $(canvas).click(function (e) {
        if (e.shiftKey) {
            //drawScene();
        }
    });

}(document.getElementById("space-scene")));
