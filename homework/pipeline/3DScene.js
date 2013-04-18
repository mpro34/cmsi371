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
        cameraZ = 1.0,
        cameraX = 0.0,
        cxPointer = 0.0,
        czPointer = -1.0,
        alpha = 0.0,
        alphaRads = 0.0,
        viewRadius = Math.abs(cameraZ),
        rotationMatrix,
        cameraMatrix,
        projectionMatrix,
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
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES, 
            transforms: {
                trans: { x: -3.0, y: 0.0, z: 1.0 },         //put instance transforms into three separate arrays
                scale: { x: 1.0, y: 1.0, z: 1.0 },
                rotate: { x: 0.0, y: 0.0, z: 0.5 }
            },
            subshapes: [
                {
                    color: { r: 0.0, g: 0.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: 0.0, y: 0.0, z: -2.0 },         //put instance transforms into three separate arrays
                        scale: { x: 2.5, y: 4.0, z: 0.5 },
                        rotate: { x: 0.0, y: 0.5, z: 0.0 }
                    }
                },
                {
                    color: { r: 0.0, g: 1.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: 0.5, y: 0.0, z: -2.0 },         //put instance transforms into three separate arrays
                        scale: { x: 2.0, y: 4.0, z: 0.5 },
                        rotate: { x: 0.0, y: 0.5, z: 0.0 }
                    }
                },
                {
                    color: { r: 0.0, g: 1.0, b: 0.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: -1.0, y: 0.0, z: -1.0 },         //put instance transforms into three separate arrays
                        scale: { x: 1.0, y: 1.0, z: 1.0 },
                        rotate: { x: 0.0, y: 0.0, z: 0.5 }
                    }
                }
            ]
        }/*,
    
        {
            color: { r: 1.0, g: 0.0, b: 0.5 },
            vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
            mode: gl.TRIANGLES, 
            transforms: {
                trans: { x: 2.5, y: 0.0, z: -3.0 },         //put instance transforms into three separate arrays
                scale: { x: 1.0, y: 1.0, z: 1.0 },
                rotate: { x: 0.0, y: 0.0, z: 0.0 }
            },
            subshapes: [
                {
                    color: { r: 0.0, g: 0.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: 3.0, y: 0.5, z: 0.0 },         //put instance transforms into three separate arrays
                        scale: { x: 0.5, y: 0.5, z: 0.5 },
                        rotate: { x: 0.0, y: 0.0, z: 0.0 }
                    }
                },
                {
                    color: { r: 0.0, g: 1.0, b: 0.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: 2.0, y: 0.5, z: 0.0 },         //put instance transforms into three separate arrays
                        scale: { x: 0.5, y: 0.5, z: 0.5 },
                        rotate: { x: 0.0, y: 0.0, z: 0.0 }
                    }
                }
            ]
        }*/
        
    ];

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
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix"); 
    translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
    scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");  
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    /*
     * Displays an individual object.
     */
    drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        //Set up instance transforms.
        if (object.transforms) {
            gl.uniformMatrix4fv(translationMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getTranslationMatrix( object.transforms.trans.x, 
                                                    object.transforms.trans.y, 
                                                    object.transforms.trans.z
                                                  ).toWebGLArray()
                )
            ),

            gl.uniformMatrix4fv(scaleMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getScaleMatrix( object.transforms.scale.x, 
                                              object.transforms.scale.y, 
                                              object.transforms.scale.z
                                            ).toWebGLArray()
                )
            ),

            gl.uniformMatrix4fv(rotationMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getRotationMatrix( currentRotation, 
                                                 object.transforms.rotate.x, 
                                                 object.transforms.rotate.y,
                                                 object.transforms.rotate.z
                                               ).toWebGLArray()
                )
            );

        } else {

            //Default instance transform with original position, scale, and no rotation
            gl.uniformMatrix4fv(translationMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getTranslationMatrix(0.0, 0.0, 0.0).toWebGLArray()
                )
            ),

            gl.uniformMatrix4fv(scaleMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getScaleMatrix(1.0, 1.0, 1.0).toWebGLArray()
                )
            ),

            gl.uniformMatrix4fv(rotationMatrix,
                gl.FALSE, new Float32Array(
                    Matrix4x4.getRotationMatrix(currentRotation, 0.0, 0.0, 0.0).toWebGLArray()
                )
            );
        }

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
        // JD: The way you have it, rotation and scale are global;
        //     only translation is done per object.  That is not a
        //     complete instance transformation.  You should be able
        //     to apply all three transforms on each individual object.

  /*      gl.uniformMatrix4fv(rotationMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.getRotationMatrix(currentRotation, 0.0, 1.0, 0.0).toWebGLArray()
            )
        );*/

//Left and Right arrow keys rotate the camera, not physically move it.
        gl.uniformMatrix4fv(cameraMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.lookAt(
                    new Vector(cameraX, 0.0, cameraZ),             //Location of camera
                    new Vector(cxPointer, 0.0, czPointer),         //Where camera is pointed
                    new Vector(0.0, 1.0, 0.0)                      //Tilt of camera
                ).toWebGLArray()
            )
        );

        //Set up frustum projection matrix (t, b, l, r, n, f)                                
        gl.uniformMatrix4fv(projectionMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.frustum(5, -5, -5, 5, 1, 70).toWebGLArray()
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


    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
/*    $(canvas).click(function () {
        console.log("here")
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
    });*/

        $("body").keydown(function(event) {
            event.preventDefault();
            if (event.keyCode == 38) {  //Up key
                cameraZ -= 0.1;
                drawScene();

            } else if (event.keyCode == 40) {  //Down key
                cameraZ += 0.1;
                drawScene();

            } else if (event.keyCode == 39) {  //Right key
                alpha -= 3.0;
                drawScene();

            } else if (event.keyCode == 37) {  //Left key
                alpha += 3.0;
                drawScene();
            }

            if (Math.abs( alpha ) >= 360.0) {
                alpha = 0.0;
            }

            alphaRads = alpha * Math.PI / 180.0; //Radians value of alpha
            cxPointer = viewRadius * Math.sin( alphaRads );
            czPointer = viewRadius * Math.cos( alphaRads );    

            
            //console.log("alpha"+alpha,"viewRadius"+viewRadius,"cxPointer"+cxPointer, "czPointer"+czPointer);
        });


}(document.getElementById("space-scene")));
/*Changed:
    Changed WASD to arrow keys for easier user readability
*/
