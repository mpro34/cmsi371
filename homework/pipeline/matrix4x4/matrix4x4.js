
var Matrix4x4 = (function () {
    // Define the constructor.
    var matrix4x4 = function () {
        this.elements = arguments.length ?
        [].slice.call(arguments) :
        [ 1, 0, 0, 0, 
          0, 1, 0, 0, 
          0, 0, 1, 0,
          0, 0, 0, 1 ];
    };

    // matrix4x4 multiplication that takes in one matrix4x4 object.
    matrix4x4.prototype.multiply = function (m2) {
        var result = new Matrix4x4(),
            i,
            j,
            k,
            total,
            h = 0,
            max = 16;

            for (k = 0; k < max; k += 4) {
                for (j = 0, m = 0; j < max; j += 4, h += 1, m += 1) {

                    for (i = 0, total = 0; i < 4; i += 1) {
                        // Calculate each of the 16 elements.
                        total += this.elements[k + i] * m2.elements[m + (i * 4)];
                    }
                    
                    result.elements[h] = total;
                }
            }

        return result;
    };

    //Creates a translated matrix4x4 array 
    matrix4x4.getTranslationMatrix = function (tx, ty, tz) {
        return new Matrix4x4(
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        );
    };

    //Creates a scaled matrix4x4 array 
    matrix4x4.getScaleMatrix = function (sx, sy, sz) {
        return new Matrix4x4(
            sx,  0,  0, 0,
             0, sy,  0, 0,
             0,  0, sz, 0,
             0,  0,  0, 1
        );
    };

    //Creates a rotated matrix4x4 array 
    matrix4x4.getRotationMatrix = function (angle, x, y, z) {
        // In production code, this function should be associated
        // with a matrix object with associated functions.
        var axisLength = Math.sqrt((x * x) + (y * y) + (z * z)),
            s = Math.sin(angle * Math.PI / 180.0),
            c = Math.cos(angle * Math.PI / 180.0),
            oneMinusC = 1.0 - c,

            // We can't calculate this until we have normalized
            // the axis vector of rotation.
            x2, // "2" for "squared."
            y2,
            z2,
            xy,
            yz,
            xz,
            xs,
            ys,
            zs;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // *Now* we can calculate the other terms.
        x2 = x * x;
        y2 = y * y;
        z2 = z * z;
        xy = x * y;
        yz = y * z;
        xz = x * z;
        xs = x * s;
        ys = y * s;
        zs = z * s;

        // GL expects its matrices in column major order.
        return new Matrix4x4(
            (x2 * oneMinusC) + c, (xy * oneMinusC) - zs, (xz * oneMinusC) + ys, 0.0,
            (xy * oneMinusC) + zs, (y2 * oneMinusC) + c, (yz * oneMinusC) - xs, 0.0,
            (xz * oneMinusC) - ys, (yz * oneMinusC) + xs, (z2 * oneMinusC) + c, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    };

    //Creates a columnized matrix4x4 array so that it can be used in WebGL.
    matrix4x4.prototype.toWebGLArray = function () {
        return [ this.elements[0], this.elements[4],  this.elements[8], this.elements[12], 
                 this.elements[1], this.elements[5],  this.elements[9], this.elements[13], 
                 this.elements[2], this.elements[6], this.elements[10], this.elements[14], 
                 this.elements[3], this.elements[7], this.elements[11], this.elements[15] 
               ]
    };

    //Returns the orthogonal projection of a 4x4 matrix
    matrix4x4.ortho = function (t, b, l, r, n, f) {
    //t, b, l, and r are the top, bottom, left, and right distances of the viewport, respectively.
    //f and n are the far and near clipping planes, respectively.
        return new Matrix4x4(
            2/(r-l),     0.0,      0.0, -(r+l)/(r-l),
                0.0, 2/(t-b),      0.0, -(t+b)/(t-b),
                0.0,     0.0, -2/(f-n), -(f+n)/(f-n),
                0.0,     0.0,      0.0,          1.0
        );
    };

    //Returns the frustum projection of a 4x4 matrix
    matrix4x4.frustum = function (t, b, l, r, n, f) {
    //t, b, l, and r are the top, bottom, left, and right distances of the viewport, respectively.
    //f and n are the far and near clipping planes, respectively.
        return new Matrix4x4(
            (2*n)/(r-l),         0.0,  (r+l)/(r-l),            0.0,
                    0.0, (2*n)/(t-b),  (t+b)/(t-b),            0.0,
                    0.0,         0.0, -(f+n)/(f-n), -(2*n*f)/(f-n),
                    0.0,         0.0,         -1.0,            0.0
        );
    };


/**,
    
        // A private method for checking dimensions,
        // throwing an exception when different.
        checkDimensions = function (v1, v2) {
            if (v1.dimensions() !== v2.dimensions()) {
                throw "Vectors have different dimensions";
            }
        };

    // Basic methods.
    vector.prototype.dimensions = function () {
        return this.elements.length;
    };

    vector.prototype.x = function () {
        return this.elements[0];
    };

    vector.prototype.y = function () {
        return this.elements[1];
    };

    vector.prototype.z = function () {
        return this.elements[2];
    };

    vector.prototype.w = function () {
        return this.elements[3];
    };

    // Addition and subtraction.
    vector.prototype.add = function (v) {
        var result = new Vector(),
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, v);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] + v.elements[i];
        }

        return result;
    };

    vector.prototype.subtract = function (v) {
        var result = new Vector(),
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, v);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] - v.elements[i];
        }

        return result;
    };

    // Scalar multiplication and division.
    vector.prototype.multiply = function (s) {
        var result = new Vector(),
            i,
            max;

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] * s;
        }

        return result;
    };

    vector.prototype.divide = function (s) {
        var result = new Vector(),
            i,
            max;

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result.elements[i] = this.elements[i] / s;
        }

        return result;
    };

    // Dot product.
    vector.prototype.dot = function (v) {
        var result = 0,
            i,
            max;

        // Dimensionality check.
        checkDimensions(this, v);

        for (i = 0, max = this.dimensions(); i < max; i += 1) {
            result += this.elements[i] * v.elements[i];
        }

        return result;
    };

    // Cross product.
    vector.prototype.cross = function (v) {
        // This method is for 3D vectors only.
        if (this.dimensions() !== 3 || v.dimensions() !== 3) {
            throw "Cross product is for 3D vectors only.";
        }

        // With 3D vectors, we can just return the result directly.
        return new Vector(
            (this.y() * v.z()) - (this.z() * v.y()),
            (this.z() * v.x()) - (this.x() * v.z()),
            (this.x() * v.y()) - (this.y() * v.x())
        );
    };

    // Magnitude and unit vector.
    vector.prototype.magnitude = function () {
        // Make use of the dot product.
        return Math.sqrt(this.dot(this));
    };

    vector.prototype.unit = function () {
        // At this point, we can leverage our more "primitive" methods.
        return this.divide(this.magnitude());
    };

    // Projection.
    vector.prototype.projection = function (v) {
        var unitv;

        // Dimensionality check.
        checkDimensions(this, v);

        // Plug and chug :)
        // The projection of u onto v is u dot the unit vector of v
        // times the unit vector of v.
        unitv = v.unit();
        return unitv.multiply(this.dot(unitv));
    };
*/
    return matrix4x4;
})();
