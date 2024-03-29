(function () {
    var canvas = document.getElementById("28a").getContext("2d");
    //gray-blue sky and green horizon gradient
    var grad = canvas.createLinearGradient(300,0,300,500);
    grad.addColorStop(0,"#33334C");
    grad.addColorStop(0.8,"#002900");
    // JD: ^^^^^It looks like you interpreted "horizon" differently.
    //     The intent was that you have distinct, green ground.
    //     Still, that is a question of interpretation so we can
    //     leave it.
    canvas.fillStyle = grad;
    canvas.fillRect(0,0,600,500);
    // JD: More avoidable hardcodes here.

    //Reddish sun
    canvas.fillStyle = "#FF3300";
    canvas.arc(300,500,200,0,Math.PI,true);
    canvas.fill(); 
}());