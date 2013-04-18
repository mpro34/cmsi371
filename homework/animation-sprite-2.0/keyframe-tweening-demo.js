/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used. 
 */
 // JD: Why is this outside the anonymous function???
 var img = new Image();
(function () {
    var canvas = document.getElementById("canvas"),
        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.

        // JD: Fortunately, you most likely avoid multiple downloads thanks
        //     to the web browser's cache.  Still, better not to risk that
        //     and restructure your code so that all of these images are
        //     loaded once only for sure.

	    /*poke_background = function() {
            table = function () {
                var img = new Image();                           
                img.src = "../animation-sprite-2.0/images/poke_table.png";
                renderingContext.drawImage(img,275,170);
            };

            drawText = function () {
                renderingContext.fillStyle = "Black";
                renderingContext.font = "22pt Helvetica";
                renderingContext.textAlign = "center";
                renderingContext.textBaseline = "middle";
                renderingContext.fillText("I Choose You! Random Pokemon Spawns...", canvas.width / 2 , canvas.height / 2);
            };

            //Wooden Floor    
            renderingContext.fillStyle = "black";
            renderingContext.fillRect(0, 0, 900, 600);
            for (var i=0; i<55; i+=2) {
                renderingContext.fillStyle = "#C2A385";
                renderingContext.fillRect(100, 10*i, 800, 10);
                renderingContext.fillStyle = "#746250";
                renderingContext.fillRect(100, 10*i, 800, 4);
                renderingContext.fillStyle = "#8A5C2E";
                renderingContext.fillRect(100, 10*(i+1), 800, 10);
                renderingContext.fillStyle = "#C4AE96";
                renderingContext.fillRect(100, 10*(i+1), 800, 4);
            }
                
            //Carpet
            renderingContext.fillStyle = "#5D4E40";        //dark brown
            renderingContext.fillRect(187, 137, 626, 323);
            renderingContext.fillStyle = "#E6E600";        //light yellow
            renderingContext.fillRect(190, 140, 620, 320);
            renderingContext.fillStyle = "#CCCC00";        //dark yellow
            renderingContext.fillRect(195, 145, 610, 310);
            renderingContext.fillStyle = "#007ACC";        //blue
            renderingContext.fillRect(200, 150, 600, 300);

            table();
            drawText();
        },*/
        squirtle = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/squirtle.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        squirt_move = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/squirt_move.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        venisaur = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/venisaur.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        veni_move = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/veni_move.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        pikachu = function (renderingContext) {         
            img.src = "../animation-sprite-2.0/images/pikachu.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        pika_move = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/pika_move.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        charmander = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/charmander.png";
            renderingContext.drawImage(img,0,0,50,50);
        };
        char_move = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/char_move.png";
            renderingContext.drawImage(img,0,0,50,50);
        };

        ash_standard = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_standard.png";
            renderingContext.drawImage(img,0,0);
        };

        ash_throw = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_throw.png";
            renderingContext.drawImage(img,0,0);
        };

        ash_right = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_right.png";
            renderingContext.drawImage(img,0,0);
        };

        ash_left = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/ash_left.png";
            renderingContext.drawImage(img,0,0);
        };
        red_poke = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/red_ball.png";
            renderingContext.drawImage(img,0,0);
        };
        blue_poke = function (renderingContext) {
            img.src = "../animation-sprite-2.0/images/blue_ball.png";
            renderingContext.drawImage(img,0,0);
        };
        green_poke = function (renderingContext) {            
            img.src = "../animation-sprite-2.0/images/green_ball.png";
            renderingContext.drawImage(img,0,0);
        };
        yellow_poke = function (renderingContext) {           
            img.src = "../animation-sprite-2.0/images/yellow_ball.png";
            renderingContext.drawImage(img,0,0);
        };


        rand_ball = function () {
            var r = [red_poke, red_poke, red_poke, red_poke, red_poke, charmander,
                     char_move, charmander, char_move, charmander, char_move
                    ];

            var b = [blue_poke, blue_poke, blue_poke, blue_poke, blue_poke, squirtle,
                     squirt_move, squirtle, squirt_move, squirtle, squirt_move
                    ];

            var g = [green_poke, green_poke, green_poke, green_poke, green_poke, venisaur,
                     veni_move, venisaur, veni_move, venisaur, veni_move
                    ];

            var y = [yellow_poke, yellow_poke, yellow_poke, yellow_poke, yellow_poke, pikachu,
                     pika_move, pikachu, pika_move, pikachu, pika_move
                    ];

            // JD: Hmmmm...not the way I would have coded this but I guess
            //     it does the job---but probably not exactly the way you
            //     think.  You do realize that, this way, red is the most
            //     likely?  Followed by green then blue?  Agreed that yellow
            //     is the least likely---and not just because it has a smaller
            //     random number range!
            var red = (Math.random() * 20) + 1;
            var green = (Math.random() * 20) + 1;
            var blue = (Math.random() * 20) + 1;
            var yellow = (Math.random() * 17) + 1;  //least chance to get yellow ball
    
            var result = Math.max(red, green, blue, yellow);
            // JD: Why even have a temp variable?  Why not just return the
            //     result once you've made the decision?
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
                        ash_standard, ash_left, ash_right, ash_left, ash_right, ash_left, ash_standard, ash_throw, ash_standard, ash_standard 
                      ], 
                     

                keyframes: [ 
                //Ash Walking Animation
                    {
                        frame: 0,
                        tx: 300,        
                        ty: 290,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 10,
                        tx: 300,       
                        ty: 290,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 20,
                        tx: 300,
                        ty: 280,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 30,
                        tx: 300,
                        ty: 270,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 40,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 50,
                        tx: 300,
                        ty: 250,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 60,
                        tx: 300,
                        ty: 240,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 70,
                        tx: 300,
                        ty: 230,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 80,
                        tx: 300,
                        ty: 220,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 90,
                        tx: 300,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 100,
                        tx: 300,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseIn
                    },

                //Pokeball Chosen!
                    {
                        frame: 130,
                        tx: 300,
                        ty: 210,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 140,
                        tx: 300,
                        ty: 220,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 150,
                        tx: 300,
                        ty: 230,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 160,
                        tx: 300,
                        ty: 240,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 170,
                        tx: 300,
                        ty: 250,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 180,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 200,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 215,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 700,
                        tx: 300,
                        ty: 260,
                        ease: KeyframeTweener.quadEaseIn
                    }

                ]
            },

            {
                draw: [], // JD: Why not just call rand_ball right here?
                          //     This avoids throwing off a first-time reader
                          //     who might say...WTF?  An empty draw array?

                keyframes: [
                //**Pokeball Animation**
                    {
                        frame: 200,
                        tx: 320,
                        ty: 260,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.quadEaseIn
                    },

                    {
                        frame: 250,
                        tx: 400,
                        ty: 270,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut                       
                    },
                    {
                        frame: 260,
                        tx: 420,
                        ty: 280,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut                       
                    },
                    {
                        frame: 270,
                        tx: 430,
                        ty: 270,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut                       
                    },
                    {
                        frame: 280,
                        tx: 440,
                        ty: 280,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut                       
                    },

                    {
                        frame: 320,
                        tx: 450,
                        ty: 270,
                        sx: 0.75,
                        sy: 0.75,
                        ease: KeyframeTweener.throwOut                       
                    },

                //**Pokemon Animation**
                    {
                        frame: 350,
                        tx: 450,
                        ty: 250,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 365,
                        tx: 450,
                        ty: 250,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 385,
                        tx: 450,
                        ty: 250,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 405,
                        tx: 450,
                        ty: 250,
                        ease: KeyframeTweener.throwOut
                    },

                    {
                        frame: 700,
                        tx: 450,
                        ty: 250,
                        ease: KeyframeTweener.throwOut
                    }     

                ]   
            }  

        ];

        //Assign a random array of draw functions so that each page reload summons a random pokemon.
        // JD: See note above.
        sprites[1].draw = rand_ball();

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
		//background: poke_background
        // JD: Custom background should be a setting here.
    });
}());
