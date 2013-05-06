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
        sphereObject,

        // The shader program to use.
        shaderProgram,

        // Utility variable indicating whether some fatal has occurred.
        abort = false,

        // Important state variables.
        currentRotation = 0.0,
        currentInterval,
        assignVerts,
        // JD: Suggestion---start clustering these variables into related
        //     groups, e.g., camera, zombie, etc.  It will make your code
        //     more readable and possibly reveal values that you don't
        //     need, that are temporary, etc.
        cameraZ = 20.0, 
        cameraX = 0.0,
        camPosition = new Vector(cameraX, 3.0, cameraZ),
        cxPointer = 0.0,
        czPointer = 0.0, 
        camPointer = new Vector(cxPointer, 3.0, czPointer),
        alpha = 0.0,
        alphaRads = 0.0,
        viewRadius = 20.0,
        udEvent = false,
        lrEvent = false,
        zombieLocation = new Vector((Math.random()*60.0)-30, 0.0, (Math.random()*60.0)-30),  //Start zombie at a random location and slowly move towards user...
        // JD: ^^^^This line is tooooooo looooong...and to top it off you
        //     stuck a comment at the end instead of a line above or
        //     below it!
        zombieX = 0.0,
        zombieZ = 0.0,
        sphereOffset = 0.0,
        rotationMatrix,
        cameraMatrix,
        projectionMatrix,
        translationMatrix,
        scaleMatrix,
        vertexPosition,

        //Specular and Diffuse Light variables
        vertexDiffuseColor,
        vertexSpecularColor,
        shininess,
        normalVector,
        lightPosition,
        lightDiffuse,
        lightSpecular,

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
    // JD: Your subshapes code is not used by your scene!  Use it somewhere
    //     so that you know if it works...say, make the zombie a composite,
    //     or group your walls into different rooms.  Or anything else.
    objectsToDraw = [
    //Bottom U Structure (WALLS 1,2,3)
            {
                color: { r: 0.0, g: 0.0, b: 1.0 },
                //Lighting Variables
                specularColor: { r: 1.0, g: 1.0, b: 1.0 },
                shininess: 16, 
                
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                normals: Shapes.toVertexNormalArray(Shapes.hexahedron()),

                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 0.0, y: 0.0, z: 0.0 },        
                    scale: { x: 36.0, y: 15.0, z: 0.5 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            }/*,
            {
                color: { r: 0.0, g: 0.0, b: 1.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: -18.0, y: 0.0, z: -0.5 },        
                    scale: { x: 0.5, y: 15.0, z: 13.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 0.0, g: 0.0, b: 1.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 18.0, y: 0.0, z: -0.5 },         
                    scale: { x: 0.5, y: 15.0, z: 18.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },

            //Inner U Structure (WALLS 4,5,6)
            {
                color: { r: 1.0, g: 0.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: -0.5, y: 0.0, z: -1.0 },        
                    scale: { x: 0.5, y: 15.0, z: 10.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 1.0, g: 0.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 6.0, y: 0.0, z: -1.0 },         
                    scale: { x: 1.0, y: 15.0, z: 10.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 1.0, g: 0.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 0.23, y: 0.0, z: -20.0 },         
                    scale: { x: 12.0, y: 15.0, z: 0.5 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },

            //Top S Structure (WALLS 7,8,9,10)
            {
                color: { r: 0.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: -10.0, y: 0.0, z: -1.5 },       
                    scale: { x: 0.5, y: 15.0, z: 7.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 0.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 0.0, y: 0.0, z: -30.0 },        
                    scale: { x: 36.0, y: 15.0, z: 0.5 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 0.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: -1.0, y: 0.0, z: -11.0 },       
                    scale: { x: 7.0, y: 15.0, z: 1.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 0.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: -18.0, y: 0.0, z: -1.85 },         
                    scale: { x: 0.5, y: 15.0, z: 8.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },

            //Zombie
            {
                color: { r: 1.0, g: 0.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: zombieLocation.x(), y: 1.5, z: zombieLocation.z() },         
                    scale: { x: 2.0, y: 2.0, z: 2.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },

            //Outer Boundary Walls
            {
                color: { r: 1.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 0.0, y: 0.0, z: -180.0 },         
                    scale: { x: 220.0, y: 20.0, z: 0.5 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 1.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 110.0, y: 0.0, z: -0.25 },         
                    scale: { x: 0.5, y: 20.0, z: 360.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 1.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: -110.0, y: 0.0, z: -0.25 },         
                    scale: { x: 0.5, y: 20.0, z: 360.0 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            },
            {
                color: { r: 1.0, g: 1.0, b: 0.0 },
                vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                mode: gl.TRIANGLES,
                transforms: {
                    trans: { x: 0.0, y: 0.0, z: 180.0 },         
                    scale: { x: 220.0, y: 20.0, z: 0.5 },
                    rotate: { x: 1.0, y: 0.0, z: 0.0 }
                }
            }*/
    ];

    // Pass the vertices and colors to WebGL.
    // JD: Note, we prefer assignVerts = function () .....
    //     (you did declare the variable up top so no need to precede this
    //     with var)
    function assignVerts() {
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

                  //The same color algorithm for specular colors.
                    if (!composites.subshapes[j].specularColors) {
                        composites.subshapes[j].specularColors = [];
                        
                        for (k = 0, maxk = composites.subshapes[j].vertices.length / 3; k < maxk; k += 1) {
                                composites.subshapes[j].specularColors = composites.subshapes[j].specularColors.concat(
                                    composites.subshapes[j].specularColor.r,
                                    composites.subshapes[j].specularColor.g,
                                    composites.subshapes[j].specularColor.b
                                );
                        }
                    }
                    composites.subshapes[j].specularBuffer = GLSLUtilities.initVertexBuffer(gl,
                        composites.subshapes[j].specularColors);
                    //Check for more subshapes...
                    if (composites.subshapes[j]) {
                        passSubVerts(composites.subshapes[j]);
                    }
                }
            }
        } // JD: Semicolon!

        //Iterate through each object in the objectsToDraw array
        // JD: Note how a lot of this code looks very similar to the one in
        //     passSubVerts.  This is avoidable.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            passSubVerts(objectsToDraw[i]);   //Pass the vertices and colors of all the subshapes to webgl
            objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].vertices);
            // If we have a single color, we expand that into an array of the same color over and over.
            if (!objectsToDraw[i].colors) {
                objectsToDraw[i].colors = [];
                // JD: What's with the extra indent????
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
            //Same trick as above.
            if (!objectsToDraw[i].specularColors) {
                console.log(objectsToDraw[i].specularColors);
                objectsToDraw[i].specularColors = [];
                    for (j = 0, maxj = objectsToDraw[i].vertices.length / 3; j < maxj; j += 1) {
                        objectsToDraw[i].specularColors = objectsToDraw[i].specularColors.concat(
                            objectsToDraw[i].specularColor.r,
                            objectsToDraw[i].specularColor.g,
                            objectsToDraw[i].specularColor.b
                        );
                    }
            }
            objectsToDraw[i].specularBuffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].specularColors);
        }
    } assignVerts();
    

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
    vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix"); 
    translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
    scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");  
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");


    lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    shininess = gl.getUniformLocation(shaderProgram, "shininess");
    /*
     * Displays an individual object.
     */
    drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        // Set the shininess.
        gl.uniform1f(shininess, object.shininess);

        //Set up instance transforms.
        if (object.transforms.rotate) {
            gl.uniformMatrix4fv(translationMatrix,
                gl.FALSE, new Float32Array(
                    // JD: No need to indent all the way to the parenthesis---
                    //     one or two levels will be fine.
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

            //Default to identity matrix.
            gl.uniformMatrix4fv(translationMatrix,
                gl.FALSE, new Float32Array(
                    new Matrix4x4().toWebGLArray()
                )
            ),

            gl.uniformMatrix4fv(scaleMatrix,
                gl.FALSE, new Float32Array(
                    new Matrix4x4().toWebGLArray()
                )
            ),

            gl.uniformMatrix4fv(rotationMatrix,
                gl.FALSE, new Float32Array(
                    currentRotation, 0.0, 1.0, 0.0
                )
            );
        }

        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

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
/*
   Left and Right arrow keys rotate the camera, not physically move it.
*/
        gl.uniformMatrix4fv(cameraMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.lookAt(
                    camPosition,                //Location of camera
                    camPointer,                 //Where camera is pointed
                    new Vector(0.0, 1.0, 0.0)   //Tilt of camera
                ).toWebGLArray()
            )
        );

        //Set up frustum projection matrix (t, b, l, r, n, f)                                
        gl.uniformMatrix4fv(projectionMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.frustum(5, -5, -5, 5, 10, 1000).toWebGLArray()
            )
        );


        // Display the objects.
        // JD: The local functions are noted; but down here there is too
        //     much repetition again.
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

    // Set up our one light source and its colors.
    gl.uniform4fv(lightPosition, [500.0, 1000.0, 100.0, 1.0]);   //Position of light
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);    //Color of Light
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);   //Color of spot light

    // Draw the initial scene.
    drawScene();

    $("body").keydown(function(event) {
        // JD: If this is dead code, please delete it when ready.
/*        if ( (Math.floor(cameraX) > 43 || Math.floor(cameraX) < -43) || (Math.floor(cameraZ) > 79 || Math.floor(cameraZ) < -79) ) {
            drawScene();
            event.preventDefault();
        }*/

        // JD: Full equality === is preferred.
        if (event.keyCode == 38  || event.keyCode == 87) {  //Up key
            cameraX += ((camPointer.subtract(camPosition)).unit()).x();
            cxPointer += ((camPointer.subtract(camPosition)).unit()).x();
            cameraZ += ((camPointer.subtract(camPosition)).unit()).z();
            czPointer += ((camPointer.subtract(camPosition)).unit()).z();
            udEvent = true;


        } else if (event.keyCode == 40 || event.keyCode == 83) {  //Down key
            cameraX -= ((camPointer.subtract(camPosition)).unit()).x();
            cxPointer -= ((camPointer.subtract(camPosition)).unit()).x();
            cameraZ -= ((camPointer.subtract(camPosition)).unit()).z();
            czPointer -= ((camPointer.subtract(camPosition)).unit()).z();
            udEvent = true;

        } else if (event.keyCode == 37 || event.keyCode == 65) {  //Left key
            alpha -= 3.0;
            lrEvent = true;

        } else if (event.keyCode == 39 || event.keyCode == 68) {  //Right key
            alpha += 3.0;
            lrEvent = true;
        } 

        if (Math.abs( alpha ) >= 360.0) {
            alpha = 0.0;
        }

        // JD: udEvent and lrEvent are already boolean---no need to
        //     compare to true!
        if (udEvent == true) {
            udEvent = false;
            drawScene();
            event.preventDefault();
        }

        if (lrEvent == true) {
            lrEvent = false;
            alphaRads = alpha * Math.PI / 180.0; //Radians value of alpha
            cxPointer = cameraX + viewRadius * Math.sin( alphaRads ); 
            czPointer = cameraZ - viewRadius * Math.cos( alphaRads );
            drawScene();
            event.preventDefault();
        }
            
        //Reinitialize camera position vector and camera pointer vectors with new values...
        camPosition = new Vector(cameraX, 3.0, cameraZ);
        camPointer = new Vector(cxPointer, 3.0, czPointer);

        console.log("Camera XZ: "+Math.floor(cameraX), Math.floor(cameraZ));
        console.log("Pointer XZ: "+cxPointer, czPointer);

            
    });

//Runs as soon as the page is loaded...
    $(canvas).click(function () {
        main = setInterval(function () {
            if ((Math.floor(objectsToDraw[10].transforms.trans.x)) != Math.floor(cameraX)) {
                // JD: Instead of hardcoding indexes, actually declare important
                //     objects as a variable (e.g., "zombie") then use that
                //     variable in the objects to draw array:
                //
                // var zombie = { ..... },
                //     ...,
                //     objectsToDraw = [
                //         ....,
                //         zombie,
                //         ...,
                //     ] .....
                //
                //     This will do wonders for readability!
                objectsToDraw[10].transforms.trans.x += ((camPosition.subtract(zombieLocation)).unit()).x();

            } else if ((Math.floor(objectsToDraw[10].transforms.trans.z)) != Math.floor(cameraZ-5)) {
                objectsToDraw[10].transforms.trans.z += ((camPosition.subtract(zombieLocation)).unit()).z();

            } else {
                clearInterval(main);        //If zombie arrives at the location of the camera, he/she gets eaten.
                var r = confirm("You are Dead...Try Again?");
                if (r) {
                    location.reload();
                } else {
                    return;
                }
            }
            console.log("Zombie XZ: "+Math.floor(objectsToDraw[10].transforms.trans.x),Math.floor(objectsToDraw[10].transforms.trans.z));

            // JD: Is this reprocessing necessary?
            assignVerts();
            drawScene();
        }, 100);
    });


}(document.getElementById("space-scene")));