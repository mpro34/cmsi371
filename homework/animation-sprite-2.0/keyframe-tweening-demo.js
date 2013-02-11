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

        explosion = function (renderingContext) {
            var ctx = document.getElementById('canvas').getContext('2d');
            ctx.strokeStyle = "#fc0";
            ctx.lineWidth = 1.5; 
            ctx.translate(10,10);
            drawSpirograph(ctx,22,6,5);
        }

        function drawSpirograph(ctx,R,r,O){
            var x1 = R-O;
            var y1 = 0;
            var i  = 1;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            do {
                if (i>20000) break;
                var x2 = (R+r)*Math.cos(i*Math.PI/72) - (r+O)*Math.cos(((R+r)/r)*(i*Math.PI/72))
                var y2 = (R+r)*Math.sin(i*Math.PI/72) - (r+O)*Math.sin(((R+r)/r)*(i*Math.PI/72))
                ctx.lineTo(x2,y2);
                x1 = x2;
                y1 = y2;
                i++;
            } while (x2 != R-O && y2 != 0 );
                  ctx.stroke();
        }


        rand_ball = function () {
            var r = [ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, 
                     ash_standard, red_poke, red_poke, red_poke, explosion, explosion,
                     char_move, charmander, char_move, charmander, char_move
                    ];

            var b = [ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, 
                     ash_standard, blue_poke, blue_poke, blue_poke, explosion, explosion,
                     squirt_move, squirtle, squirt_move, squirtle, squirt_move
                    ];

            var g = [ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, 
                     ash_standard, green_poke, green_poke, green_poke, explosion, explosion,
                     veni_move, venisaur, veni_move, venisaur, veni_move
                    ];

            var y = [ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, ash_right, ash_left, 
                     ash_standard, yellow_poke, yellow_poke, yellow_poke, explosion, explosion,
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
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: [], 
                     

                keyframes: [ 
                //Ash Walking Animation
                    {//ash_right
                        frame: 0,
                        tx: 300,        
                        ty: 300,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {//ash_right
                        frame: 10,
                        tx: 300,       
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

                    {
                        frame: 290,
                        tx: 500,
                        ty: 300,
                        sx: 0.75,
                        sy: 0.75,                                   
                    },

                    {
                        frame: 290,
                        tx: 500,
                        ty: 300,
                        sx: 0.75,
                        sy: 0.75, 
                        rotate: 360,                                         
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

                ],   
            }
        ];

        //Assign a random array of draw functions so that each page reload summons a random pokemon.
        sprites[0].draw = rand_ball();
            
     //   console.log("success: "+ sprites[0].draw);

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
