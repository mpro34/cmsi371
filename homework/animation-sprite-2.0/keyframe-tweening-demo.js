/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used. 
**NOTES**
 ** Place all VARS at the beginning.
 Nanoshop.html demo when pokeball is chosen, darken everything but pokeball
 and pokemon.git 
 */
 var img = new Image();
(function () {
    var canvas = document.getElementById("canvas"),

    ash_walk = function() {
        var temp = [];
        for (var i=0; i<10; i++) {
            var obj = {
                frame: (i*10),
                tx: 300,
                ty: (300-(10*i)),  
                ease: KeyframeTweener.quadEaseIn
            };
            temp[i]=obj;
        };
        //alert(temp);
        return temp;


    }

        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        squirtle = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/squirtle.png";
        },
        venisaur = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/venisaur.png";
        },
        pikachu = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/pikachu.png";
        },
        charmander = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/charmander.png";
        },

        ash_standard = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/ash_standard.png";
        },

        ash_right = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/ash_right.png";
        },

        ash_left = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/ash_left.png";
        },

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: [ash_right,ash_left,ash_right,ash_left,ash_right,ash_left,ash_right,ash_left,ash_right,ash_left],

                keyframes: [

                   {//ash_right
                        frame: 10,
                        tx: 300,        //coordinates for image at 50 frames
                        ty: 290,
                        ease: KeyframeTweener.quadEaseIn
                    },

                   {//ash_left
                        frame: 20,
                        tx: 300,
                        ty: 280,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 30,
                        tx: 300,
                        ty: 270,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 40,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 50,
                        tx: 300,
                        ty: 250,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 60,
                        tx: 300,
                        ty: 240,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 70,
                        tx: 300,
                        ty: 230,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 80,
                        tx: 300,
                        ty: 220,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 90,
                        tx: 300,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 100,
                        tx: 300,
                        ty: 200,
                        ease: KeyframeTweener.quadEaseIn
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
