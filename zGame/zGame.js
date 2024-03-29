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
        currentRotation = 45.0,
        currentInterval,
        assignVerts, // JD: Good that you cleaned this up, but...also clean up
                     //     the now-unused variable!
        passSubVerts,
        subArray = [],
        drawArray = [],
        normalArray = [],
        passTransforms,

        //Camera Variables
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

        //Zombie Variables
        zombieLocation = new Vector(0.0, 0.0, 5.0),  
        zombieX = 0.0,
        zombieZ = 0.0,

        //Transform Variables
        rotationMatrix,
        cameraMatrix,
        projectionMatrix,
        translationMatrix,
        scaleMatrix,

        //Vertex Variable
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

//Create the zombie...
    createZombie = function(zombieX, zombieZ) {
        var zombie = {
        //Zombie Body
            color: { r: 0.0, g: 0.5, b: 0.0 },
            specularColor: { r: 1.0, g: 0.0, b: 0.0 },
            shininess: 25,  
            vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
            normals: Shapes.toVertexNormalArray(Shapes.sphere()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: zombieX, y: 1.5, z: zombieZ },         
                scale: { x: 2.0, y: 2.0, z: 2.0 }
            },
            subshapes: [
            //Zombie Head
                // JD: So here, you did find *a* solution to being able to
                //     construct the zombie, but your code is not very
                //     reusable.  As mentioned previously, what is lacking
                //     is a full appreciation for the role that the *matrix*
                //     produced by these properties can play in getting
                //     "transform inheritance" to work.
                {
                    color: { r: 1.0, g: 0.0, b: 0.0 }, 
                    specularColor: { r: 1.0, g: 0.0, b: 0.0 },
                    shininess: 25,            
                    vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
                    normals: Shapes.toVertexNormalArray(Shapes.sphere()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX, y: 5.8, z: zombieZ+5.0 },        
                        scale: { x: 1.0, y: 1.0, z: 1.0 }
                    }
                },
            //Zombie Legs
                {
                    color: { r: 0.0, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX-0.5, y: 0.3, z: zombieZ },        
                        scale: { x: 2.0, y: 2.0, z: 2.0 }
                    } 
                },
                {
                    color: { r: 0.0, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX+0.5, y: 0.3, z: zombieZ },        
                        scale: { x: 2.0, y: 2.0, z: 2.0 }
                    } 
                },            
            //Zombie Arms
                {
                    color: { r: 0.1, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX-0.5, y: 6.0, z: zombieZ+13.0 },        
                        scale: { x: 5.0, y: 0.5, z: 0.5 }
                    } 
                },
                {
                    color: { r: 0.1, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX+0.5, y: 6.0, z: zombieZ+13.0 },        
                        scale: { x: 5.0, y: 0.5, z: 0.5 }
                    } 
                }
            ]    
        }
        return zombie;
    };

/* Pass the current translation transform values from parent to child.
 * No need to pass scale or rotate, because that would screw up the original 
 * look of the objects.
 */
    // JD: ^^^Maybe no need for your particular scene, but it *is* possible
    //     to also pass on scale and rotate transformations.  At least this
    //     shows you understand the concept; what's missing is sufficient
    //     *implementation* understanding to see the mechanism that will
    //     allow you to pass *all* of the transforms from parent to child.
    //
    //     Unfortunately, you don't *use* this function, probably because
    //     you hit the limitation posed by trying to pass transforms by
    //     modifying the child's transforms.  If you realized that you can
    //     pass the *matrices* for these transforms, things would have
    //     worked out better.
    passTransforms = function (parent, child) {
        if (parent.transforms.trans) {
            child.transforms.trans.x += parent.transforms.trans.x;
            child.transforms.trans.y += parent.transforms.trans.y;
            child.transforms.trans.z += parent.transforms.trans.z;
        }
        return child;
    };

    // Build the objects to display.
    objectsToDraw = [
    //Spawn the dead
        createZombie(zombieLocation.x(), zombieLocation.z()),
    //Bottom U Structure (WALLS 1,2,3)        
        {
            color: { r: 0.0, g: 0.0, b: 1.0 },           
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 0.0, y: 0.0, z: 0.0 },        
                scale: { x: 36.0, y: 15.0, z: 0.5 }
            },

            subshapes: [
                {
                    color: { r: 0.0, g: 0.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: 18.0, y: 0.0, z: -0.5 },         
                        scale: { x: 0.5, y: 15.0, z: 18.0 }
                    }
                },
                {
                    color: { r: 0.0, g: 0.0, b: 1.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: -18.0, y: 0.0, z: -0.5 },        
                        scale: { x: 0.5, y: 15.0, z: 13.0 }
                    }
                },                
                {
                    color: { r: 1.0, g: 0.0, b: 0.0 },
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: -0.5, y: 0.0, z: -1.0 },        
                        scale: { x: 0.5, y: 15.0, z: 10.0 }
                    }
                }
            ]
        },
    //Inner U Structure (WALLS 4,5,6)
        {
            color: { r: 1.0, g: 0.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: -0.5, y: 0.0, z: -1.0 },        
                scale: { x: 0.5, y: 15.0, z: 10.0 }
            }
        },
        {
            color: { r: 1.0, g: 0.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 6.0, y: 0.0, z: -1.0 },         
                scale: { x: 1.0, y: 15.0, z: 10.0 }
            }
        },
        {
            color: { r: 1.0, g: 0.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 0.23, y: 0.0, z: -20.0 },         
                scale: { x: 12.0, y: 15.0, z: 0.5 }
            }
        },

        //Top S Structure (WALLS 7,8,9,10)
        {
            color: { r: 0.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: -10.0, y: 0.0, z: -1.5 },       
                scale: { x: 0.5, y: 15.0, z: 7.0 }
            }
        },
        {
            color: { r: 0.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 0.0, y: 0.0, z: -30.0 },        
                scale: { x: 36.0, y: 15.0, z: 0.5 }
            }
        },
        {
            color: { r: 0.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: -1.0, y: 0.0, z: -11.0 },       
                scale: { x: 7.0, y: 15.0, z: 1.0 }
            }
        },
        {
            color: { r: 0.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: -18.0, y: 0.0, z: -1.85 },         
                scale: { x: 0.5, y: 15.0, z: 8.0 }
            }
        },
    //Outer Boundary Walls
        {
            color: { r: 1.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 0.0, y: 0.0, z: -180.0 },         
                scale: { x: 220.0, y: 20.0, z: 0.5 }
            }
        },
        {
            color: { r: 1.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 110.0, y: 0.0, z: -0.25 },         
                scale: { x: 0.5, y: 20.0, z: 360.0 }
            }
        },
        {
            color: { r: 1.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: -110.0, y: 0.0, z: -0.25 },         
                scale: { x: 0.5, y: 20.0, z: 360.0 }
            }
        },
        {
            color: { r: 1.0, g: 1.0, b: 0.0 },
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
            transforms: {
                trans: { x: 0.0, y: 0.0, z: 180.0 },         
                scale: { x: 220.0, y: 20.0, z: 0.5 }
            }
        }
    ];

    // Pass the vertices and colors to WebGL.
        passSubVerts = function (composites) {
            for (i = 0, maxi = composites.length; i < maxi; i += 1) {
                composites[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                    composites[i].vertices);
            //Create the default normal array in case of no lighting variables for current object.
                // JD: Nice catch for avoiding normal vector errors, but at a cost---
                //     most of your scene is not lit at all!  And to think that the
                //     fix for this would be a single additional line per object.
                //     (or less if you wrote a function like createWallSegment)
                for (k = 0; maxk = composites[i].vertices.length, k < maxk; k += 1) {
                    normalArray.push(0.5);
                }
            //If we have a single color, we expand that into an array of the same color over and over.
                if (!composites[i].colors) {
                    composites[i].colors = [];
                    for (j = 0, maxj = composites[i].vertices.length / 3; j < maxj; j += 1) {
                        composites[i].colors = composites[i].colors.concat(
                            composites[i].color.r,
                            composites[i].color.g,
                            composites[i].color.b
                        );
                    }
                }  
                composites[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    composites[i].colors);
                
            //Same trick as above.
                if (!composites[i].specularColors) {
                    composites[i].specularColors = [];      
                    for (j = 0, maxj = composites[i].vertices.length / 3; j < maxj; j += 1) {
                        composites[i].specularColors = composites[i].specularColors.concat(
                            (composites[i].specularColor ? composites[i].specularColor.r : 1.0),
                            (composites[i].specularColor ? composites[i].specularColor.g : 1.0),
                            (composites[i].specularColor ? composites[i].specularColor.b : 1.0)
                        );
                    }
                    composites[i].specularBuffer = GLSLUtilities.initVertexBuffer(gl,
                        composites[i].specularColors);
                    composites[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                        (composites[i].normals ? composites[i].normals : normalArray)); 
                }

            //Save subshapes to be processed after all of the standard objects.
                if (composites[i].subshapes) {
                    subArray = subArray.concat(composites[i].subshapes);
                }
            }           
        }; 
        passSubVerts(objectsToDraw);
        passSubVerts(subArray);

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
        gl.uniformMatrix4fv(translationMatrix,
            gl.FALSE, new Float32Array(object.transforms.trans ?
                Matrix4x4.getTranslationMatrix( 
                    object.transforms.trans.x, 
                    object.transforms.trans.y, 
                    object.transforms.trans.z ).toWebGLArray() : 
                new Matrix4x4().toWebGLArray()
            )
        ),

        gl.uniformMatrix4fv(scaleMatrix,
            gl.FALSE, new Float32Array(object.transforms.scale ?
                Matrix4x4.getScaleMatrix(
                    object.transforms.scale.x, 
                    object.transforms.scale.y, 
                    object.transforms.scale.z ).toWebGLArray() : 
                new Matrix4x4().toWebGLArray()
            )
        ),

        gl.uniformMatrix4fv(rotationMatrix,
            gl.FALSE, new Float32Array(object.transforms.rotate ?
                Matrix4x4.getRotationMatrix(
                    object.transforms.rotate.angle, 
                    object.transforms.rotate.x, 
                    object.transforms.rotate.y,
                    object.transforms.rotate.z ).toWebGLArray() :
                new Matrix4x4().toWebGLArray()
            )
        );

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
        drawSubshapes = function (composites) {          
            for (i = 0, maxi = composites.length; i < maxi; i += 1) {
                drawObject(composites[i]) // JD: Missing semicolon.
                // JD: You still miss out on arbitrarily deep trees of subshapes
                //     with this implementation.  What you need is recursion.
                if (composites[i].subshapes) {
                    drawArray = drawArray.concat(composites[i].subshapes);
                }
            } 
        }; 
        drawSubshapes(objectsToDraw);
        drawSubshapes(drawArray);
     
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
        if (event.keyCode === 38  || event.keyCode === 87) {  //Up key
            cameraX += ((camPointer.subtract(camPosition)).unit()).x();
            cxPointer += ((camPointer.subtract(camPosition)).unit()).x();
            cameraZ += ((camPointer.subtract(camPosition)).unit()).z();
            czPointer += ((camPointer.subtract(camPosition)).unit()).z();
            udEvent = true;

        } else if (event.keyCode === 40 || event.keyCode === 83) {  //Down key
            cameraX -= ((camPointer.subtract(camPosition)).unit()).x();
            cxPointer -= ((camPointer.subtract(camPosition)).unit()).x();
            cameraZ -= ((camPointer.subtract(camPosition)).unit()).z();
            czPointer -= ((camPointer.subtract(camPosition)).unit()).z();
            udEvent = true;

        } else if (event.keyCode === 37 || event.keyCode === 65) {  //Left key
            alpha -= 3.0;
            lrEvent = true;

        } else if (event.keyCode === 39 || event.keyCode === 68) {  //Right key
            alpha += 3.0;
            lrEvent = true;
        } 

        if (Math.abs( alpha ) >= 360.0) {
            alpha = 0.0;
        }

        if (udEvent) {
            udEvent = false;
            drawScene();
            event.preventDefault();
        }

        if (lrEvent) {
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
    });

//Runs when the user clicks the screen...
    $(canvas).click(function () {
        //Updates the x and z translation values of each object and subshape. Does the job, but I know the same 
        //function can be executed a lot smoother and cleaner...     
        main = setInterval(function () {
            if ((Math.floor(zombieLocation.x())) != Math.floor(cameraX)) {
                objectsToDraw[0].transforms.trans.x += 
                ((camPosition.subtract(zombieLocation)).unit()).x() / objectsToDraw[0].transforms.scale.x;
                for (i = 0; i < objectsToDraw[0].subshapes.length; i += 1) {
                    objectsToDraw[0].subshapes[i].transforms.trans.x += 
                        ((camPosition.subtract( zombieLocation )).unit()).x() / 
                            objectsToDraw[0].subshapes[i].transforms.scale.x;
                }

            } else if ((Math.floor(zombieLocation.z())) != Math.floor(cameraZ-5)) {
                objectsToDraw[0].transforms.trans.z += 
                ((camPosition.subtract(zombieLocation)).unit()).z() / objectsToDraw[0].transforms.scale.z;
                for (i = 0; i < objectsToDraw[0].subshapes.length; i += 1) {
                    objectsToDraw[0].subshapes[i].transforms.trans.z +=
                        ((camPosition.subtract( zombieLocation )).unit()).z() /
                            objectsToDraw[0].subshapes[i].transforms.scale.z;
                }

            } else {
                clearInterval(main);        //If zombie arrives at the location of the camera, he/she gets eaten.
                var r = confirm("You are Dead...Try Again?");
                if (r) {
                    location.reload();
                } else {
                    return;
                }
            }
            zombieLocation = new Vector (zombieX, 0.0, zombieZ);
            drawScene();
        }, 100);
    });
}(document.getElementById("space-scene")));