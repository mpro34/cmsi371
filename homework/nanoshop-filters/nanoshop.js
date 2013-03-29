/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing.
 */
var Nanoshop = {
    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function (r, g, b, a) that returns another
     * pixel as a 4-element array representing an RGBA value.
     */

	// This is a basic "darkener."
    darkener: function (r, g, b, a) {
        return [r / 2, g / 2, b / 2, a];
    },
	
	// This is a basic "lightener."
    lightener: function (r, g, b, a) {
        return [r * 2, g * 2, b * 2, a];
    },
	
	// This is a grayscaler.
	grayscale: function (r, g, b, a) {
        var average = 0;
        average = (r + g + b) / 3;
            return [average, average, average, a];
    },

    applyFilter: function (imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var i,
            j,
            max,
            pixel,
            pixelArray = imageData.data;

        for (i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            pixel = filter(pixelArray[i], pixelArray[i + 1], pixelArray[i + 2], pixelArray[i + 3]);
            for (j = 0; j < 4; j += 1) {
                pixelArray[i + j] = pixel[j];
            }
        }

        return imageData;
    }
};
