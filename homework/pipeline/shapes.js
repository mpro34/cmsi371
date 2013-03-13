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
                [ 0, 2, 3, 1],   //Front Face
                [ 4, 5, 2, 3 ],  //Top Face
                [ 1, 3, 4, 6 ],  //Right Face
                [ 0, 2, 5, 7 ],  //Left Face
                [ 0, 1, 6, 7 ],  //Bottom Face
                [ 4, 6, 7, 5 ]   //Back Face
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
                [ 0, 1, 2 ],   
                [ 1, 3, 2 ],
                [ 0, 3, 2 ],
                [ 0, 1, 3 ]
            ]
        };
    },


    sphere: function () {
        var latitudeBands = 30;
        var longitudeBands = 30;
        var radius = 2;
 
        var vertexPositionBuffer;
        var vertexNormalBuffer;
        var vertexTextureCoordBuffer;
        var vertexIndexBuffer;
 
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
                var u = 1- (longNumber / longitudeBands);
                var v = latNumber / latitudeBands;
 
                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
                textureCoordData.push(u);
                textureCoordData.push(v);
                vertexPositionData.push(radius * x);
                vertexPositionData.push(radius * y);
                vertexPositionData.push(radius * z);
            }
        }

        var indexData = [];
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
                vertexPositionData, //0
                normalData,  //1
                textureCoordData, //2
                indexData,  //3
            ],

            indices: [
                [1]
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
