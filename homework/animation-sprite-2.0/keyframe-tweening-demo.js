/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used. 
**NOTES**
 ** Place all VARS at the beginning.
 Nanoshop.html demo when pokeball is chosen, darken everything but pokeball
 and pokemon.
 */
(function () {
    var canvas = document.getElementById("canvas"),
 
        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        squirtle = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,100,100);
            };
            img.src = "../animation-sprite-2.0/squirtle.png";
        },
        table = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,100,100);
            };
            img.src = "../animation-sprite-2.0/poke_table.png";
        },
        venisaur = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,0,0);
            };
            img.src = "../animation-sprite-2.0/venisaur.png";
        },
        pikachu = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,500,150);
            };
            img.src = "../animation-sprite-2.0/pikachu.png";
        },
        charmander = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,0,0);
            };
            img.src = "../animation-sprite-2.0/charmander.png";
        },

        ash_standard = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,500,150);
            };
            img.src = "../animation-sprite-2.0/ash_standard.png";
        },

        ash_right = function (renderingContext) {
            var img = new Image();
                var xValue = sprites[0].keyframes[1].tx;
                var yValue = sprites[0].keyframes[1].ty;
                img.onload = function() {
                    renderingContext.drawImage(img,xValue,yValue);
                };
            img.src = "../animation-sprite-2.0/ash_right.png";
        },
        ash_left = function (renderingContext) {
            var img = new Image();
          //  console.log(sprites[0].keyframes.length);
                var xValue = sprites[0].keyframes[0].tx;
                var yValue = sprites[0].keyframes[0].ty;
                img.onload = function() {
                    renderingContext.drawImage(img,xValue,yValue);
                };
            
            img.src = "../animation-sprite-2.0/ash_left.png";
        },

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: [ash_left,ash_right,ash_left],
                keyframes: [
                    {//ash_left
                        frame: 0,
                        tx: 500,
                        ty: 250,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {//ash_right
                        frame: 20,
                        tx: 500,
                        ty: 245,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {//ash_left
                        frame: 40,
                        tx: 500,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseOut
                    }
                ]
            }
            /**{
                draw: ash_standard,  //Change** this function to an array of objects
                keyframes: [ 
                    {
                        frame: 0,   //Speed of movement from frame to frame
                        tx: 20,     //Position at the particular frame
                        ty: 20,     //sx and sy scale the object
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 50,
                        tx: 100,
                        ty: 50,
                        ease: KeyframeTweener.quadEaseInOut
                    },

                    // The last keyframe does not need an easing function.
                    {
                        frame: 100,
                        tx: 80,
                        ty: 500,
                        rotate: 60 // Keyframe.rotate uses degrees.
                    }
                ]
            },
            {
                draw: ash_right,
                keyframes: [
                    {
                        frame: 20,   //Speed of movement from frame to frame
                        tx: 20,     //Position at the particular frame
                        ty: 20,     //sx and sy scale the object
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: 30,
                        tx: 100,
                        ty: 50,
                        ease: KeyframeTweener.quadEaseInOut
                    },

                    // The last keyframe does not need an easing function.
                    {
                        frame: 40,
                        tx: 80,
                        ty: 500,
                        rotate: 60 // Keyframe.rotate uses degrees.
                    }
                ]
            }*/
        ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());
