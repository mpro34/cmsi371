/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used. 
**NOTES**
 ** Place all VARS at the beginning.
 Nanoshop.html demo when pokeball is chosen, darken everything but pokeball
 and pokemon.git 

 -2/6/2013
 1) Ash throws a random colored ball, which moves to the middle of the carpet.
 2) A random pokemon is spawned from the ball.
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
            temp.push(obj);
        };
        return temp;
    };

    rand_ball = function() {
        var temp = [];
        for (var i=0; i<10; i++) {
            var obj = {
                frame: (i*10),
                tx: 300,
                ty: (300-(10*i)),  
                ease: KeyframeTweener.quadEaseIn
            };
            temp.push(obj);
        };
        return temp;
    };

        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        squirtle = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/squirtle.png";
        },
        squirt_move = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/squirt_move.png";
        },
        venisaur = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/venisaur.png";
        },
        veni_move = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/veni_move.png";
        },
        pikachu = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/pikachu.png";
        },
        pika_move = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/pika_move.png";
        },
        charmander = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/charmander.png";
        },
        char_move = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/char_move.png";
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
        red_poke = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/red_ball.png";
        },
        blue_poke = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/blue_ball.png";
        },
        green_poke = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/green_ball.png";
        },
        yellow_poke = function (renderingContext) {
            renderingContext.drawImage(img,0,0);
            img.src = "../animation-sprite-2.0/yellow_ball.png";
        },


        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: [

                       ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, 
                       ash_standard, 
                       red_poke, red_poke, red_poke,
                       pika_move, pikachu, pika_move, pikachu, pika_move
                       ], 
                     //  pikachu, pikachu, pikachu ],

                keyframes: [
                //Ash Walking Animation
                   {//ash_right
                        frame: 0,
                        tx: 300,        //coordinates for image at 50 frames
                        ty: 300,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 10,
                        tx: 300,        //coordinates for image at 50 frames
                        ty: 300,
                        ease: KeyframeTweener.quadEaseIn
                    },

                   {//ash_left
                        frame: 20,
                        tx: 300,
                        ty: 290,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 30,
                        tx: 300,
                        ty: 280,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 40,
                        tx: 300,
                        ty: 270,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 50,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 60,
                        tx: 300,
                        ty: 250,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 70,
                        tx: 300,
                        ty: 240,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 80,
                        tx: 300,
                        ty: 230,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 90,
                        tx: 300,
                        ty: 220,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_left
                        frame: 100,
                        tx: 300,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseIn
                    },

                
                    {//ash_standard
                        frame: 150,
                        tx: 300,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseIn
                    },

                //**Pokeball Animation**
                    {
                        frame: 250,
                        tx: 500,
                        ty: 300,
                        sx: 0.75,
                        sy: 0.75,
                        rotate: 360,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 250,
                        tx: 500,
                        ty: 300,
                        sx: 0.75,
                        sy: 0.75,
                        
                    },

                //**Charmander tail wag Animation**
                    {//pikachu
                        frame: 300,
                        tx: 500,
                        ty: 300,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {//pikachu
                        frame: 350,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {//pikachu
                        frame: 370,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {//pikachu
                        frame: 390,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {//pikachu
                        frame: 410,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {//pikachu
                        frame: 430,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    }       

                ]
            },

  /**          {
               draw: [pikachu,pikachu,pikachu],

               keyframes: [
                
                   {//pikachu
                        frame: 220,
                        tx: 400,
                        ty: 200,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//pikachu
                        frame: 240,
                        tx: 400,
                        ty: 300,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//pikachu
                        frame: 260,
                        tx: 400,
                        ty: 400,
                        ease: KeyframeTweener.quadEaseIn
                    }


               ] 
            }    */
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
