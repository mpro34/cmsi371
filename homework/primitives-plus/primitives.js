/*
 * A module demonstrating assorted algorithms for selected 2D graphics
 * operations.
 */
var Primitives = {
    /*
     * This is the cornerstone: we promise not to use any other graphics
     * operation but this one.
     */
    setPixel: function (context, x, y, r, g, b) {
        context.save();
        context.fillStyle = "rgb(" + parseInt(r, 10) + "," +
                parseInt(g, 10) + "," + parseInt(b, 10) + ")";
        context.fillRect(x, y, 1, 1);
        context.restore();
    },

    /*
     * The easy fill case: rectangles.  We take advantage of JavaScript's
     * "optional" parameter mechanism to keep things at a single method.
     */
    fillRect: function (context, x, y, w, h, c1, c2, c3, c4) {
        var module = this,
            i,
            j,
            bottom = y + h,
            right = x + w,
            leftColor = c1 ? [c1[0], c1[1], c1[2]] : c1,
            rightColor = c2 ? [c2[0], c2[1], c2[2]] : c2,
            leftVDelta,
            rightVDelta,
            hDelta,
            currentColor,

            // We have four subcases: zero, one, two, or four colors
            // supplied.  The three-color case will be treated as if
            // the third and fourth colors are the same.  Instead of
            // embedding different logic into a single loop, we just
            // break them up.  This allows each case to be "optimal"
            // and simplifies reading the code.  There *is* some
            // duplicate code, but in this case the benefits outweigh
            // the cost.
            fillRectNoColor = function () {
                // The rendering context will just ignore the
                // undefined colors in this case.
                for (i = y; i < bottom; i += 1) {
                    for (j = x; j < right; j += 1) {
                        module.setPixel(context, j, i);
                    }
                }
            },

            fillRectOneColor = function () {
                // Single color all the way through.
                for (i = y; i < bottom; i += 1) {
                    for (j = x; j < right; j += 1) {
                        module.setPixel(context, j, i, c1[0], c1[1], c1[2]);
                    }
                }
            },

            fillRectTwoColors = function () {
                // This modifies the color vertically only.
                for (i = y; i < bottom; i += 1) {
                    for (j = x; j < right; j += 1) {
                        module.setPixel(context, j, i,
                                leftColor[0],
                                leftColor[1],
                                leftColor[2]);
                    }

                    // Move to the next level of the gradient.
                    leftColor[0] += leftVDelta[0];
                    leftColor[1] += leftVDelta[1];
                    leftColor[2] += leftVDelta[2];
                }
            },

            fillRectFourColors = function () {
                for (i = y; i < bottom; i += 1) {
                    // Move to the next "vertical" color level.
                    currentColor = [leftColor[0], leftColor[1], leftColor[2]];
                    hDelta = [(rightColor[0] - leftColor[0]) / w,
                              (rightColor[1] - leftColor[1]) / w,
                              (rightColor[2] - leftColor[2]) / w];

                    for (j = x; j < right; j += 1) {
                        module.setPixel(context, j, i,
                                currentColor[0],
                                currentColor[1],
                                currentColor[2]);

                        // Move to the next color horizontally.
                        currentColor[0] += hDelta[0];
                        currentColor[1] += hDelta[1];
                        currentColor[2] += hDelta[2];
                    }

                    // The color on each side "grades" at different rates.
                    leftColor[0] += leftVDelta[0];
                    leftColor[1] += leftVDelta[1];
                    leftColor[2] += leftVDelta[2];
                    rightColor[0] += rightVDelta[0];
                    rightColor[1] += rightVDelta[1];
                    rightColor[2] += rightVDelta[2];
                }
            };

        // Depending on which colors are supplied, we call a different
        // version of the fill code.
        if (!c1) {
            fillRectNoColor();
        } else if (!c2) {
            fillRectOneColor();
        } else if (!c3) {
            // For this case, we set up the left vertical deltas.
            leftVDelta = [(c2[0] - c1[0]) / h,
                      (c2[1] - c1[1]) / h,
                      (c2[2] - c1[2]) / h];
            fillRectTwoColors();
        } else {
            // The four-color case, with a quick assignment in case
            // there are only three colors.
            c4 = c4 || c3;

            // In primitives, one tends to see repeated code more
            // often than function calls, because this is the rare
            // situation where function call overhead costs more
            // than repeated code.
            leftVDelta = [(c3[0] - c1[0]) / h,
                      (c3[1] - c1[1]) / h,
                      (c3[2] - c1[2]) / h];
            rightVDelta = [(c4[0] - c2[0]) / h,
                      (c4[1] - c2[1]) / h,
                      (c4[2] - c2[2]) / h];
            fillRectFourColors();
        }
    },

    /*
     * Here come our line-drawing primitives.  Note, for simplicity, that
     * we code for a specific case of a diagonal line going up.  Other cases
     * either switch directions or have specific optimizations (e.g., strictly
     * horizontal and vertical lines).
     */

    // Our digital-differential analyzer (DDA) version.
    lineDDA: function (context, x1, y1, x2, y2, color) {
        var steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)),
            dx = (x2 - x1) / steps,
            dy = (y2 - y1) / steps,
            x = x1,
            y = y1,
            i;

        color = color || [0, 0, 0];
        for (i = 0; i <= steps; i += 1) {
            this.setPixel(context, x, y, color[0], color[1], color[2]);
            x += dx;
            y += dy;
        }
    },

    // Bresenham algorithm version 1.
    lineBres1: function (context, x1, y1, x2, y2, color) {
        var x = x1,
            y = y1,
            dx = x2 - x1,
            dy = y1 - y2,
            err = 0;

        color = color || [0, 0, 0];
        while (true) {
            this.setPixel(context, x, y, color[0], color[1], color[2]);
            if (x === x2) {
                return;
            }

            x += 1;
            err += dy / dx;
            if (err >= 0.5) {
                y -= 1;
                err -= 1;
            }
        }
    },

    // Bresenham algorithm version 2.
    lineBres2: function (context, x1, y1, x2, y2, color) {
        var x = x1,
            y = y1,
            dx = x2 - x1,
            dy = y1 - y2,
            err = 0;

        color = color || [0, 0, 0];
        while (true) {
            this.setPixel(context, x, y, color[0], color[1], color[2]);
            if (x === x2) {
                return;
            }

            x += 1;
            // Note how this is "multiplying 2 * dx to both sides" when
            // compared to Bresenham 1.
            err += (2 * dy);
            if (err >= dx) {
                y -= 1;
                err -= (2 * dx);
            }
        }
    },

    // Bresenham algorithm version 3.
    lineBres3: function (context, x1, y1, x2, y2, color) {
        var x = x1,
            y = y1,
            dx = x2 - x1,
            dy = y1 - y2,
            err = 0;

        color = color || [0, 0, 0];
        while (true) {
            this.setPixel(context, x, y, color[0], color[1], color[2]);
            if (x === x2) {
                return;
            }

            x += 1;
            // This one does the comparison first, then adjusts err
            // based on that comparison.
            if (err >= dx - 2 * dy) {
                y -= 1;
                err += (2 * dy - 2 * dx);
            } else {
                err += (2 * dy);
            }
        }
    },

    // The final, optimized Bresenham algorithm: here, we presave
    // most values, and adjust them to compare only to zero.
    lineBresenham: function (context, x1, y1, x2, y2, dash, color) {
        var count = 0,
            x = x1,
            y = y1,
            dx = x2 - x1,
            dy = y1 - y2,
            k1 = dy << 1, // dy divided by 2.
            err = k1 - dx,
            k2 = (dy - dx) << 1; // dy - dx divided by 2.

        color = color || [0, 0, 0];
        while (true) {
            //Draws a pixel until the value of count is greater than dash.
            //Dash is then reset after 1 pixel is skipped.
            if (count <= dash) { 
                this.setPixel(context, x, y, color[0], color[1], color[2]);  
                count++;
            } else if (count > dash) {
                count = 0;
            }
			
            if (x === x2) {
                return;
            }

            x += 1;
            if (err < 0) {
                err += k1;
            } else {
                y -= 1;    //Decrement y value by dash instead of 1.
                err += k2;
            }
        }
    },

    /*
     * Time for the circles. So we define a helper
     * function that all of the circle implementations will use...
     * New inputs include radius r, and two colors for the linear 
     * gradient c1 and c2.
     */
    // JD: Note that the instructions for the gradient were that it go
    //     *all the way across* the circle, either left to right or top
    //     to bottom.  You have the basics of gradient calculations, but
    //     not adhering to this detail detracts from demonstrating that
    //     you are fully in control of what the algorithm is doing.
    //     (see below)
    plotCirclePoints: function (context, xc, yc, x, y, r, c1, c2) {
    
        var xi = 0,
            yi = 0,
            module = this,
			i,
			j,
            cDelta;
       //     ydist = Math.floor(2*Math.sqrt(Math.pow(r,2) - Math.pow(y,2))),
       //     xdist = Math.floor(2*Math.sqrt(Math.pow(r,2) - Math.pow(x,2)))
        //xc, yc are the distances to the center of the circle
		//x, y are the radii
        //Top to Bottom pieces  
        fillCircle = function(c1) {
            for  (i = 0; i < 5; i += 1) {
                    module.setPixel(context, xc + x - i, yc + y - i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc + x - i, yc - y + i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc + y - i, yc + x - i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc + y - i, yc - x + i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc - x + i, yc + y - i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc - x + i, yc - y + i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc - y + i, yc + x - i, c1[0], c1[1], c1[2]);
                    module.setPixel(context, xc - y + i, yc - x + i, c1[0], c1[1], c1[2]);
            }
        }

        cDelta = [
            (c2[0] - c1[0]) / r,
            (c2[1] - c1[1]) / r,
            (c2[2] - c1[2]) / r 
        ];
        for (j = 0; j < 10; j += 1) {
            fillCircle(c1); 
            c1[0] += cDelta[0];
            c1[1] += cDelta[1];
            c1[2] += cDelta[2];
        }



     /*   //Draw one horizontal line (middle halves)    
        while (yi < ydist) {
            this.setPixel(context, xc + x - yi, yc - y, c1[0], c1[1], c1[2]);
            this.setPixel(context, xc + x - yi, yc + y, c1[0], c1[1], c1[2]);
            yi++;
        } */

        // JD: Glitch #2---You are changing the gradient colors *in place*.
        //     This means that future calls to plotCirclePoints will send
        //     in the *modified* color from previous calls.  This carries
        //     with it some unsafe assumptions, such as the order in which
        //     plotCirclePoints will be called, or what the caller does
        //     with the color values themselves.
        //
        //     And finally, it messes up your gradient---the colors change
        //     at a different rate because you are calculating a new delta
        //     *based on a color that was already changed by a previous
        //     delta*.  The rate of change is different from a straight-up
        //     linear gradient (and explains why you have that red-to-green-
        //     to-red effect.  If you had done this right, even with the
        //     calculation based on the radius, you should still have seen
        //     a single red-to-green (or vice versa) change, one for each
        //     half of the circle.

    },

    // First, the most naive possible implementation: circle by trigonometry.
    circleTrig: function (context, xc, yc, r, c1, c2) {
        var theta = 1 / r,
      
            // At the very least, we compute our sine and cosine just once.
            s = Math.sin(theta),
            c = Math.cos(theta),

            // We compute the first octant, from zero to pi/4.
            x = r,
            y = 0.0;

        while (x >= y) {
            this.plotCirclePoints(context, xc, yc, x, y, r, c1, c2);
            x = x * c - y * s;
            y = x * s + y * c;
        }
    },

    // Now DDA.
    circleDDA: function (context, xc, yc, r, c1, c2) {
        var epsilon = 1 / r,
            x = r,
            y = 0.0;

        while (x >= y) {
            this.plotCirclePoints(context, xc, yc, x, y, r, c1, c2);
            x = x - (epsilon * y);
            y = y + (epsilon * x);
        }
    },

    // One of three Bresenham-like approaches.
    circleBres1: function (context, xc, yc, r, c1, c2) {
        var p = 3 - 2 * r,
            x = 0,
            y = r;

        while (x < y) {
            this.plotCirclePoints(context, xc, yc, x, y, r, c1, c2);
            if (p < 0) {
                p = p + 4 * x + 6;
            } else {
                p = p + 4 * (x - y) + 10;
                y -= 1;
            }
            x += 1;
        }
        if (x === y) {
            this.plotCirclePoints(context, xc, yc, x, y, r, c1, c2);
        }
    },

    // And another...
    circleBres2: function (context, xc, yc, r, c1, c2) {
        var x = 0,
            y = r,
            e = 1 - r,
            u = 1,
            v = e - r;

        while (x <= y) {
            this.plotCirclePoints(context, xc, yc, x, y, r, c1, c2);
            if (e < 0) {
                x += 1;
                u += 2;
                v += 2;
                e += u;
            } else {
                x += 1;
                y -= 1;
                u += 2;
                v += 4;
                e += v;
            }
        }
    },

    // Last but not least...
    circleBres3: function (context, xc, yc, r, c1, c2) {
        var x = r,
            y = 0,
            e = 0;

        while (y <= x) {
            this.plotCirclePoints(context, xc, yc, x, y, r, c1, c2);
            y += 1;
            e += (2 * y - 1);
            if (e > x) {
                x -= 1;
                e -= (2 * x + 1);
            }
        }
    },

    /*
     * Now, the big one: a general polygon-filling algorithm.
     * We expect the polygon to be an array of objects with x
     * and y properties.
     */

    // For starters, we need an Edge helper object.
    Edge: function (p1, p2) {
        this.maxY = Math.max(p1.y, p2.y);
        this.minY = Math.min(p1.y, p2.y);
        this.horizontal = (p1.y === p2.y);
        if (!this.horizontal) {
            this.inverseSlope = (p2.x - p1.x) / (p2.y - p1.y);
        }

        // The initial x coordinate is the x coordinate of the
        // point with the lower y value.
        this.currentX = (p1.y === this.minY) ? p1.x : p2.x;
    },

    // Now to the function itself.
    fillPolygon: function (context, polygon, color) {
        var Edge = this.Edge, // An alias for convenience.

            /*
             * A useful helper function: this "snaps" a given y coordinate
             * to its nearest scan line.
             */
            toScanLine = function (y) {
                return Math.ceil(y);
            },

            /*
             * We will need to sort edges by x coordinate.
             */
            xComparator = function (edge1, edge2) {
                return (edge1.currentX - edge2.currentX);
            },

            /*
             * We will need to do "array difference:" return an array whose
             * elements are in the first array but not in the second.
             */
            arrayDifference = function (array1, array2) {
                return array1.filter(function (element) {
                    return array2.indexOf(element) < 0;
                });
            },

            /*
             * An important helper function: this moves the edges whose
             * minimum y match the given scan line from the source
             * list to the destination. We assume that the source list
             * is sorted by minimum y.
             */
            moveMatchingMinYs = function (src, dest, targetY) {
                var i;
                for (i = 0; i < src.length; i += 1) {
                    if (toScanLine(src[i].minY) === targetY) {
                        dest.push(src[i]);
                    } else if (toScanLine(src[i].minY) > targetY) {
                        // We can bail immediately because the global edge list is sorted.
                        break;
                    }
                }

                // Eliminate the moved edges from the source array; this is
                // the function's result.
                return arrayDifference(src, dest);
            },

            globalEdgeList = [], // List of all edges.
            activeEdgeList = [], // List of all edges currently being scanned.
            i,                   // Reusable index variable.
            anEdge,              // Temporary edge holder.
            currentScanLine,     // The scan line that is being drawn.
            drawPixel,           // Whether we are supposed to plot something.
            fromX,               // The starting x coordinate of the current scan line.
            toX,                 // The ending x coordinate of the current scan line.
            x,                   // Another reusable index variable, for drawing.
            edgesToRemove;       // For use when, well, removing edges from a list.

        // The usual color guard.
        color = color || [0, 0, 0];

        // Create the global edge list.
        for (i = 0; i < polygon.length; i += 1) {
            // If we are at the last vertex, we go back to the first one.
            anEdge = new Edge(polygon[i], polygon[(i + 1) % polygon.length]);

            // We skip horizontal edges; they get drawn "automatically."
            if (!anEdge.horizontal) {
                globalEdgeList.push(anEdge);
            }
        }

        // Sort the list from top to bottom.
        globalEdgeList.sort(function (edge1, edge2) {
            if (edge1.minY !== edge2.minY) {
                return (edge1.minY - edge2.minY);
            } else {
                // If the minimum y's are the same, then the edge with the
                // smaller x value goes first.
                return (edge1.currentX - edge2.currentX);
            }
        });

        // We start at the lowest y coordinate.
        currentScanLine = toScanLine(globalEdgeList[0].minY);

        // Initialize the active edge list.
        globalEdgeList = moveMatchingMinYs(globalEdgeList, activeEdgeList, currentScanLine);

        // Start scanning!
        drawPixel = false;
        while (activeEdgeList.length) {
            fromX = Number.MAX_VALUE;
            for (i = 0; i < activeEdgeList.length; i += 1) {
                // If we're drawing pixels, we draw until we reach the x
                // coordinate of this edge. Otherwise, we just remember where we
                // are then move on.
                if (drawPixel) {
                    toX = toScanLine(activeEdgeList[i].currentX);

                    // No cheating here --- draw each pixel, one by one.
                    for (x = fromX; x <= toX; x += 1) {
                        this.setPixel(context, x, currentScanLine,
                                color[0], color[1], color[2]);
                    }
                } else {
                    fromX = toScanLine(activeEdgeList[i].currentX);
                }
                drawPixel = !drawPixel;
            }

            // If we get out of this loop and drawPixel is true, then we
            // encountered an odd number of edges, and need to draw a single
            // pixel.
            if (drawPixel) {
                this.setPixel(context, fromX, currentScanLine, color);
                drawPixel = !drawPixel;
            }

            // Go to the next scan line.
            currentScanLine += 1;

            // Remove edges for which we have reached the maximum y.
            edgesToRemove = [];
            for (i = 0; i < activeEdgeList.length; i += 1) {
                if (toScanLine(activeEdgeList[i].maxY) === currentScanLine) {
                    edgesToRemove.push(activeEdgeList[i]);
                }
            }
            activeEdgeList = arrayDifference(activeEdgeList, edgesToRemove);

            // Add edges for which we have reached the minimum y.
            globalEdgeList = moveMatchingMinYs(globalEdgeList, activeEdgeList, currentScanLine);

            // Update the x coordinates of the active edges.
            for (i = 0; i < activeEdgeList.length; i += 1) {
                activeEdgeList[i].currentX += activeEdgeList[i].inverseSlope;
            }

            // Re-sort the edge list.
            activeEdgeList.sort(xComparator);
        }
    }

};
