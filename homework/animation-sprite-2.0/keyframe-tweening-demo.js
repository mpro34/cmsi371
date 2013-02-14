/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used. 
 */
 var img = new Image();
(function () {
    var canvas = document.getElementById("canvas"),
        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        squirtle = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/squirtle.png";
            renderingContext.drawImage(img,0,0);
        },
        squirt_move = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/squirt_move.png";
            renderingContext.drawImage(img,0,0);
        },
        venisaur = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/venisaur.png";
            renderingContext.drawImage(img,0,0);
        },
        veni_move = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/veni_move.png";
            renderingContext.drawImage(img,0,0);
        },
        pikachu = function (renderingContext) {         
            img.src = "../animation-sprite-2.0/images/pikachu.png";
            renderingContext.drawImage(img,0,0);
        },
        pika_move = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/pika_move.png";
            renderingContext.drawImage(img,0,0);
        },
        charmander = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/charmander.png";
            renderingContext.drawImage(img,0,0);
        },
        char_move = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/char_move.png";
            renderingContext.drawImage(img,0,0);
        },

        ash_standard = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_standard.png";
            renderingContext.drawImage(img,0,0);
        },

        ash_right = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_right.png";
            renderingContext.drawImage(img,0,0);
        },

        ash_left = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_left.png";
            renderingContext.drawImage(img,0,0);
        },
        red_poke = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/red_ball.png";
            renderingContext.drawImage(img,0,0);
        },
        blue_poke = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/blue_ball.png";
            renderingContext.drawImage(img,0,0);
        },
        green_poke = function (renderingContext) {            
            img.src = "../animation-sprite-2.0/images/green_ball.png";
            renderingContext.drawImage(img,0,0);
        },
        yellow_poke = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/yellow_ball.png";
            renderingContext.drawImage(img,0,0);
        },


        rand_ball = function () {
            var r = [red_poke, red_poke, red_poke,
                     char_move, charmander, char_move, charmander, char_move
                    ];

            var b = [blue_poke, blue_poke, blue_poke,
                     squirt_move, squirtle, squirt_move, squirtle, squirt_move
                    ];

            var g = [green_poke, green_poke, green_poke,
                     veni_move, venisaur, veni_move, venisaur, veni_move
                    ];

            var y = [yellow_poke, yellow_poke, yellow_poke,
                     pika_move, pikachu, pika_move, pikachu, pika_move
                    ];

            var red = (Math.random() * 20) + 1;
            var green = (Math.random() * 20) + 1;
            var blue = (Math.random() * 20) + 1;
            var yellow = (Math.random() * 17) + 1;  //least chance to get yellow ball
    
            var result = Math.max(red, green, blue, yellow);
            if (result == red) { temp = r; }
            if (result == green) { temp = g; }
            if (result == blue) { temp = b; }
            if (result == yellow) { temp = y; }
            return temp;
        }; 


        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has an array of drawing functions and an array of keyframes.
        sprites = [
            {
                draw: [ ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_standard, 
                        ash_standard 
                      ], 
                     

                keyframes: [ 
                //Ash Walking Animation
                    {//ash_right
                        frame: 0,
                        tx: 300,        
                        ty: 290,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 10,
                        tx: 300,       
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
                        frame: 430,
                        tx: 300,
                        ty: 205,
                        ease: KeyframeTweener.quadEaseIn
                    }
                ]
            },

            {
                draw: [],

                keyframes: [ 
                //**Pokeball Animation**
                    {
                        frame: 150,
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

                //**Pokemon Animation**
                    {
                        frame: 300,
                        tx: 500,
                        ty: 300,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 350,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 370,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 390,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 410,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 430,
                        tx: 450,
                        ty: 250,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut
                    }      

                ]   
            }  

        ];

        //Assign a random array of draw functions so that each page reload summons a random pokemon.
        sprites[1].draw = rand_ball();

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
