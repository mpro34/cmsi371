/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
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
        square = function (renderingContext) {
            renderingContext.fillStyle = "blue";
            renderingContext.fillRect(-20, -20, 40, 40);
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
                renderingContext.drawImage(img,0,0);
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
                renderingContext.drawImage(img,0,0);
            };
            img.src = "../animation-sprite-2.0/ash_standard.png";
        },

        ash_right = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,0,0);
            };
            img.src = "../animation-sprite-2.0/ash_right.png";
        },

        ash_left = function (renderingContext) {
            var img = new Image();
            img.onload = function() {
                renderingContext.drawImage(img,0,0);
            };
            img.src = "../animation-sprite-2.0/ash_left.png";
        },

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: square,  //Change** this function to an array of objects
                keyframes: [ 
                    {
                        frame: 0,   //Speed of movement from frame to frame
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
                        frame: 80,
                        tx: 80,
                        ty: 500,
                        rotate: 60 // Keyframe.rotate uses degrees.
                    }
                ]
            },
            {
                draw: pikachu,
                keyframes: [
                    {
                        frame: 0,   //Speed of movement from frame to frame
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
                        frame: 80,
                        tx: 80,
                        ty: 500,
                        rotate: 60 // Keyframe.rotate uses degrees.
                    }
                ]
            },
            {
                draw: ash_left,
                keyframes: [
                    {
                        frame: 50,
                        tx: 300,
                        ty: 600,
                        sx: 0.5,
                        sy: 0.5,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 100,
                        tx: 300,
                        ty: 0,
                        sx: 3,
                        sy: 0.25,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 150,
                        tx: 300,
                        ty: 600,
                        sx: 0.5,
                        sy: 0.5
                    }
                ]
            }
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
