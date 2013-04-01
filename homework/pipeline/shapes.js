/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {
    /*
     * Returns the vertices for a small icosahedron.
     */
    icosahedron: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606,
            Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ]
        };
    },

    icosahedron3: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.1,
            Z = 0.1;

            

        return {
            vertices: [
                [ -X, 0.0, Z ], //0
                [ X, 0.0, Z ],  //1   //XZ
                [ -X, 0.0, -Z ],//2 
                [ X, 0.0, -Z ], //3

                [ 0.0, Z, X ],  //4
                [ 0.0, Z, -X ], //5
                [ 0.0, -Z, X ], //6  //YZ
                [ 0.0, -Z, -X ],//7

                [ Z, X, 0.0 ],  //8
                [ -Z, X, 0.0 ], //9
                [ Z, -X, 0.0 ], //10  //XY
                [ -Z, -X, 0.0 ] //11
            ],

            indices: [
                [ 8, 9, 10 ],
                [ 10, 11, 9 ],
                [ 7, 10, 8 ]
            ]
        };
    },
    //Cube shape with 8 vertices, 12 edges, and 6 faces
    hexahedron: function () {
        var X = 0.5,
            Z = 0.25;

        return {
            vertices: [
                [ -Z, 0.0, 0.0 ], //0
                [ Z, 0.0, 0.0 ],  //1
                [ -Z, X, 0.0 ], //2
                [ Z, X, 0.0 ],  //3
                [ Z, X, X ],      //4
                [ -Z, X, X ],      //5
                [ Z, 0.0, X ],   //6
                [ -Z, 0.0, X ]     //7

            ],

            indices: [
                [ 0, 1, 3 ],   //Front Face
                [ 3, 2, 0 ],  
                [ 1, 3, 4 ],  //Right Face
                [ 4, 6, 1 ],  
                [ 0, 2, 7 ],  //Left Face
                [ 5, 2, 7 ],
                [ 4, 6, 7 ],  //Back Face
                [ 7, 5, 4 ],
                [ 2, 5, 4 ],  //Top Face
                [ 2, 3, 4 ],   
                [ 0, 1, 6 ],  //Bottom Face
                [ 0, 7, 6 ]  
            ]
        };
    },

    //Pyramid shape with 4 vertices, 6 edges, and 4 faces
    tetrahedron: function () {
        var X = 0.5,
            Z = 0.25;

        return {
            vertices: [
                [ -Z, 0.0, Z ], //0
                [ Z, 0.0, Z ],  //1
                [ 0.0, X, 0.0 ], //2
                [ 0.0, 0.0, -Z ],  //3
            ],

            indices: [
                [ 0, 1, 2 ],   //front
                [ 1, 3, 2 ],   //right
                [ 0, 3, 2 ],   //left
                [ 0, 1, 3 ]    //bot
            ]
        };
    },


    sphere: function () {
        var latitudeBands = 30,
            longitudeBands = 30,
            radius = 2
            var vertexPositionData = [];
            var normalData = [];
            var textureCoordData = [];

        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
 
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
 
                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
            }
        }


        return {
            vertices: [
                normalData  //1
            ],

            // JD: OK, so this part needs work.
            indices: [
                [0]
            ]
        };
    },
        icosahedron2: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var latitudeBands = 30,
            longitudeBands = 30,
            radius = 1,
            vertexPositionData = [],
            normalData = [],
          //  textureCoordData = [],
            indexData = [];
            //Set up vertices
            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                    var phi = longNumber * 2 * Math.PI / longitudeBands;
                    var sinPhi = Math.sin(phi);
                    var cosPhi = Math.cos(phi);

                    var x = radius * cosPhi * sinTheta;
                    var y = radius * cosTheta;
                    var z = radius * sinPhi * sinTheta;
                 //   var u = 1 - (longNumber / longitudeBands);
                //    var v = 1 - (latNumber / latitudeBands);

                    normalData.push(x);
                    normalData.push(y);
                    normalData.push(z);
                  //  textureCoordData.push(u);
                 //   textureCoordData.push(v);
                    vertexPositionData.push(radius * x);
                    vertexPositionData.push(radius * y);
                    vertexPositionData.push(radius * z);
                }
            }
            //Set up indices
            for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
                for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber;
                    var second = first + longitudeBands + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);

                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }

        return {
            vertices: [
                normalData, vertexPositionData   //1
            ],

            // JD: OK, so this part needs work.
            indices: [
                indexData, indexData
            ]
        };
        
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    toRawTriangleArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    toRawLineArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    }

};
