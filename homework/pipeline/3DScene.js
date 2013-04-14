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
        currentSCALER = 0.5,
        currentZoom = 0.1,
        currentSide = 0.0,
        rotationMatrix,
        cameraMatrix,
        orthoMatrix,
        frustumMatrix,
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
            color: { r: 1.0, g: 0.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
            mode: gl.LINES, 
            transforms: {
                trans: [0.0, 0.0, 0.0],         //put instance transforms into three separate arrays
                scale: [0.2, 0.2, 0.2],
                rotate: [0.0, 0.0, 0.0, 0.0]
            },
            subshapes: [
                {
                    color: { r: 0.0, g: 0.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: [-0.5, 0.0, 0.0],         //put instance transforms into three separate arrays
                        scale: [1.0, 1.0, 1.0],
                        rotate: [0.0, 0.0, 0.0, 0.0]
                    }
                }
            ]
        }
    ];
        /*},

        {
            color: { r: 1.0, g: 1.0, b: 0.0 },
            vertices: [].concat(
                [ 0.25, 0.5, 0.5 ],
                [ -0.25, 0.0, 0.5 ],
                [ 0.5, 0.0, 0.5 ]              
            ),
            mode: gl.TRIANGLES,
            transforms: {
                trans: [0.0, 0.0, 0.0],         //put instance transforms into three separate arrays
                scale: [1.5, 1.5, 1.5],
                rotate: [0.0, 0.0, 0.0, 0.0]
            }
        }
        
    ];*/

    // Pass the vertices and colors to WebGL.
    var passSubVerts = function (composites) {
        if (composites.subshapes) {
            for (j = 0, subLength = composites.subshapes.length; j < subLength; j += 1) {
                composites.subshapes[j].buffer = GLSLUtilities.initVertexBuffer(gl,
                    composites.subshapes[j].vertices);
                    
                    // If we have a single color, we expand that into an array of the same color over and over.
                    if (!composites.subshapes[j].colors) {
                        composites.subshapes[j].colors = [];
                        
                        for (k = 0, maxk = composites.subshapes[j].vertices.length / 3; k < maxk; k += 1) {
                                composites.subshapes[j].colors = composites.subshapes[j].colors.concat(
                                    composites.subshapes[j].color.r,
                                    composites.subshapes[j].color.g,
                                    composites.subshapes[j].color.b
                                );
                        }
                    }
                    composites.subshapes[j].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                        composites.subshapes[j].colors);
                    //Check for more subshapes...
                    if (composites.subshapes[j]) {
                        passSubVerts(composites.subshapes[j]);
                    }
            }
        }
    }

    //Iterate through each object in the objectsToDraw array
    for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
        passSubVerts(objectsToDraw[i]);   //Pass the vertices and colors of all the subshapes to webgl
        objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
            objectsToDraw[i].vertices);
        // If we have a single color, we expand that into an array of the same color over and over.
        if (!objectsToDraw[i].colors) {
            objectsToDraw[i].colors = [];
                for (j = 0, maxj = objectsToDraw[i].vertices.length / 3; j < maxj; j += 1) {
                    objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                        objectsToDraw[i].color.r,
                        objectsToDraw[i].color.g,
                        objectsToDraw[i].color.b
                    );
                }
        }
        objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
            objectsToDraw[i].colors);
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
    frustumMatrix = gl.getUniformLocation(shaderProgram, "frustumMatrix");  //New Transform
    translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");  //New Transform
    scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");  //New Transform
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

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

        //Set up instance transforms: translation, scale, rotate
        if (object.transforms) {
            console.log("here");
            gl.uniformMatrix4fv(translationMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getTranslationMatrix( object.transforms.trans[0], 
                                                    object.transforms.trans[1], 
                                                    object.transforms.trans[2]
                                                  ).toWebGLArray()
                )
            );

            gl.uniformMatrix4fv(scaleMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getScaleMatrix( object.transforms.scale[0], 
                                              object.transforms.scale[1], 
                                              object.transforms.scale[2]
                                            ).toWebGLArray()
                )
            );

        } else {
            //Default instance transform with original position, scale, and no rotation
            gl.uniformMatrix4fv(translationMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getTranslationMatrix(0.0, 0.0, 0.0).toWebGLArray()
                )
            );

            gl.uniformMatrix4fv(scaleMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getScaleMatrix(1.0, 1.0, 1.0).toWebGLArray()
                )
            );
        }
    };

    /*
     * Displays the scene.
     */
    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up the rotation matrix.
        // JD: The way you have it, rotation and scale are global;
        //     only translation is done per object.  That is not a
        //     complete instance transformation.  You should be able
        //     to apply all three transforms on each individual object.

            gl.uniformMatrix4fv(rotationMatrix, 
                gl.FALSE, new Float32Array(
                    Matrix4x4.getRotationMatrix(currentRotation, 0.0, 0.0, 0.0).toWebGLArray()   
                )
            );


        gl.uniformMatrix4fv(cameraMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.lookAt(
                // JD: Good stab at integrating the camera, but
                //     currentSide and currentZoom are not good
                //     name for the camera's x-coordinate and z-
                //     coordinate, respectively.
                new Vector(currentSide, 0, currentZoom),   //Location of camera
                new Vector(0, 0, 0),                       //Where camera is pointed
                new Vector(0, 0.5, 0)                      //Tilt of camera
            ).toWebGLArray()
        )
    );

        // Display the objects.

        var subfound,
            subLength,
            i,
            j;

        var drawSubshapes = function (composites) {
            if (composites.subshapes) {
                for (j = 0, subLength = composites.subshapes.length; j < subLength; j += 1) { 
                    drawObject(composites.subshapes[j]);    //Draw each subshape
                    if (composites.subshapes[j].subshapes) {
                        drawSubshapes(composites.subshapes[j]);     
                    }
                }
            }  
        };

        //Recursively draw objects, check for subshapes, and respectively draw each subshape.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawSubshapes(objectsToDraw[i]);     //Pass object to drawsubshapes function to draw each subshape
            drawObject(objectsToDraw[i]);         //Draw parent object
        }


        // All done.
        gl.flush();
    };

    // JD: I can see how you might have been experimenting with a good
    //     projection matrix here.  But in the end, you'll really only
    //     be using one (typically) and so you should make sure to clean
    //     this up later.

    //Set up ortho projection matrix (t, b, l, r, n, f)
    gl.uniformMatrix4fv(orthoMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.ortho(-2, 2, -2, 2, 0, 20).toWebGLArray()
        )
    );

    //Set up frustum projection matrix (t, b, l, r, n, f)                                
    gl.uniformMatrix4fv(frustumMatrix,
        gl.FALSE, new Float32Array(
            Matrix4x4.frustum(-2, 2, -2, 2, 0.1, 50).toWebGLArray()
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

    // JD: This is a good start, but needs refinement in order
    //     to feel more intuitive.  i.e.:
    //
    //     - You're only moving the camera location, but it forever
    //       is looking at the origin.  I don't think you want or
    //       intend this.
    //
    //     - Already mentioned the bad names, but they are worth
    //       mentioning again!
    //
    //     - jQuery is visible to this code (see click above);
    //       for consistency, use jQuery for the binding here also.

        $("body").keypress(function(event) {
            if (event.keyCode == 119) {  //W key

                currentZoom += 0.1;
                drawScene();

            } else if (event.keyCode == 115) {  //S key

                currentZoom -= 0.1;
                drawScene();

            } else if (event.keyCode == 100) {  //D key

                currentSide += 0.01;
                drawScene();

            } else if (event.keyCode == 97) {  //A key

                currentSide -= 0.01;
                drawScene();

            }
        });


}(document.getElementById("space-scene")));
