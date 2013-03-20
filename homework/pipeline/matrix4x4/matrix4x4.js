
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

   // Scalar multiplication and division.
    multiply = function (m1, m2) {
        var result = new Matrix4x4(),
            i,
            j,
            k,
            total,
            h = 0,
            max = 16;

            for (k = 0; k < max; k += 4) {
                for (j = 0,m = 0; j < max; j += 4,h += 1,m += 1) {

                    for (i = 0,total = 0; i < 4; i += 1) {                              //Calculate each of the 16 elements 
                        total += m1.elements[k+i] * m2.elements[m+i*4];                                         
                    }
                    
                    result.elements[h] = total;
                }
            }

        return result;
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
