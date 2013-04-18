/*
 * A simple keyframe-tweening animation module for 2D
 * canvas elements.
 */
var KeyframeTweener = {
    // The module comes with a library of common easing functions.
    linear: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return distance * percentComplete + start;   //Start location plus percent complete of distance.
    },

    quadEaseIn: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return distance * percentComplete * percentComplete + start;
    },

    quadEaseOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / duration;
        return -distance * percentComplete * (percentComplete - 2) + start;
    },

    quadEaseInAndOut: function (currentTime, start, distance, duration) {
        var percentComplete = currentTime / (duration / 2);
        return (percentComplete < 1) ?
                (distance / 2) * percentComplete * percentComplete + start :
                (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
    },

    // JD: Out of your new easing functions, you only use throwOut.
    //     Something wrong with the other two?  O_o  (I know that they
    //     work OK---and in fact they have some nice movement to them;
    //     that's why I'm wondering why you didn't use these.)
    bounce: function(currentTime, start, distance, duration) {
        var percentComplete = (currentTime /= duration) * currentTime;
        var tc = percentComplete * currentTime;
        // JD: Whoa...the indentation here is a little...extreme.
        return start + distance *(
                                     -7.8 * tc * percentComplete + 27.095 * percentComplete * 
                                     percentComplete + -30.79 * tc + 11.495 * percentComplete + currentTime
                                 );
    },

    backandforth: function(currentTime, start, distance, duration) {
        var percentComplete = (currentTime /= duration) * currentTime;
        var tc = percentComplete * currentTime;
        return start + distance * (
                                      1.55 * tc * percentComplete + 17.745 * percentComplete * 
                                      percentComplete + -30.79 * tc + 11.495 * percentComplete + currentTime
                                  );
    },

    throwOut: function(t, start, distance, duration) {
        var percentComplete = (t /= duration) * t;
        var tc = percentComplete * t;
        return start + distance * (
                                      -1.6025 * tc * percentComplete + 8.7075 * percentComplete * percentComplete
                                      + -14.505 * tc + 8.5 * percentComplete + -0.1 * t
                                  );
    },
    
    // The big one: animation initialization.  The settings parameter
    // is expected to be a JavaScript object with the following
    // properties:
    //
    // - renderingContext: the 2D canvas rendering context to use
    // - width: the width of the canvas element
    // - height: the height of the canvas element
    // - sprites: the array of sprites to animate
    // - frameRate: number of frames per second (default 24)
    //
    // In turn, each sprite is a JavaScript object with the following
    // properties:
    //
    // - draw: the function that draws the sprite
    // - keyframes: the array of keyframes that the sprite should follow
    //
    // Finally, each keyframe is a JavaScript object with the following
    // properties.  Unlike the other objects, defaults are provided in
    // case a property is not present:
    //
    // - frame: the global animation frame number in which this keyframe
    //          it to appear
    // - ease: the easing function to use (default is KeyframeTweener.linear)
    // - tx, ty: the location of the sprite (default is 0, 0)
    // - sx, sy: the scale factor of the sprite (default is 1, 1)
    // - rotate: the rotation angle of the sprite (default is 0)
    //
    // Initialization primarily calls setInterval on a custom-built
    // frame-drawing (and updating) function.
    initialize: function (settings) {
        // We need to keep track of the current frame.
        var currentFrame = 0,
            // Avoid having to go through settings to get to the
            // rendering context and sprites.
            renderingContext = settings.renderingContext,
            width = settings.width,
            height = settings.height,
            sprites = settings.sprites;
			//background = settings.poke_background;

        setInterval(function () {
            // Some reusable loop variables.
            var i,
                j,
                maxI,
                maxJ,
                ease,
                startKeyframe,
                endKeyframe,
                txStart,        //position
                txDistance,
                tyStart,
                tyDistance,
                sxStart,        //scaling
                sxDistance,
                syStart,
                syDistance,
                rotateStart,
                rotateDistance,
                currentTweenFrame,
                duration;

             //Draw custom background.
		//	 background();
             // JD: Doh!!!  This totally breaks separation of concerns.  This should
             //     be defined *outside* KeyframeTweener then *passed in* as a parameter.
             //     Because now, your reusable library is NOT a reusable library anymore...
             //
             //     (not to mention that these definitions pollute the top level namespace
             //      because you already ended your var statement)
			



            // For every sprite, go to the current pair of keyframes.
            // Then, draw the sprite based on the current frame.
            for (i = 0, maxI = sprites.length; i < maxI; i += 1) {
                for (j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                    // We look for keyframe pairs such that the current
                    // frame is between their frame numbers.
                    if ((sprites[i].keyframes[j].frame <= currentFrame) &&
                            (currentFrame <= sprites[i].keyframes[j + 1].frame)) {
                        // Point to the start and end keyframes.
                        startKeyframe = sprites[i].keyframes[j];
                        endKeyframe = sprites[i].keyframes[j + 1];

                        // Save the rendering context state.
                        renderingContext.save();
                       
                        // Set up our start and distance values, using defaults
                        // if necessary.
                        ease = startKeyframe.ease || KeyframeTweener.linear;
                        txStart = startKeyframe.tx || 0;
                        txDistance = (endKeyframe.tx || 0) - txStart;
                        tyStart = startKeyframe.ty || 0;
                        tyDistance = (endKeyframe.ty || 0) - tyStart;
                        sxStart = startKeyframe.sx || 1;
                        sxDistance = (endKeyframe.sx || 1) - sxStart;
                        syStart = startKeyframe.sy || 1;
                        syDistance = (endKeyframe.sy || 1) - syStart;
                        rotateStart = (startKeyframe.rotate || 0) * Math.PI / 180;
                        rotateDistance = (endKeyframe.rotate || 0) * Math.PI / 180 - rotateStart;
                        currentTweenFrame = currentFrame - startKeyframe.frame;
                        duration = endKeyframe.frame - startKeyframe.frame + 1;

                        // Build our transform according to where we should be.
                        renderingContext.translate(
                            ease(currentTweenFrame, txStart, txDistance, duration),
                            ease(currentTweenFrame, tyStart, tyDistance, duration)
                        );
                        renderingContext.scale(
                            ease(currentTweenFrame, sxStart, sxDistance, duration),
                            ease(currentTweenFrame, syStart, syDistance, duration)
                        );
                        renderingContext.rotate(
                            ease(currentTweenFrame, rotateStart, rotateDistance, duration)
                        );
                        
                        // Draw the sprite.
                        // JD: Nope, this is not what was meant by internal animation.
                        //     Review the Pacman cut scene---they're not the same.  Doing
                        //     it this way, you may as well have each new frame be a different
                        //     sprite.  What was requested is a separate, independent animation
                        //     that is autonomous from the sprite's overall movement.
                        sprites[i].draw[j](renderingContext); //Each keyframe corresponds to the next image to draw

                        // Clean up.
                        renderingContext.restore();
                    }
                }
            }

            // Move to the next frame.
            currentFrame += 1;
        }, 1000 / (settings.frameRate || 24));
    }
};
