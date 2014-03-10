function getWar() {
    atacante = $( ".batallon_att .troops" ).html();
    defensor = $( ".batallon_def .troops" ).html();
    if (defensor > 1 && atacante > 3) {
        while (atacante > 3 && defensor > 1) {
            att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
            defensa = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
            faceWar(att, defensa);
            $( ".draggable" ).filter("#"+id).animate({
        }
    }
    if (defensor > 0 && atacante > 3) {
        while (atacante > 3 && defensor > 1) {
            att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
            defensa = [Math.floor(Math.random()*6+1)];
            faceWar(att, defensa);
            console.log("Atacante: " + att);
            console.log("Defensor: " + defensa);
        }
    }
    if (defensor > 0 && atacante > 2) {
        while (atacante > 2 &&  defensor > 0) {
            att = [Math.floor(Math.random()*6+1), Math.floor(Math.random()*6+1)];
            defensa = [Math.floor(Math.random()*6+1)];
            faceSingleWar(att, defensa);
            console.log("Atacante: " + att);
            console.log("Defensor: " + defensa);
        }
    }
    if (defensor > 0 && atacante == 2) {
        while (atacante > 1 &&  defensor > 0) {
            att = [Math.floor(Math.random()*6+1)];
            defensa = [Math.floor(Math.random()*6+1)];
            faceSingleWar(att, defensa);
            console.log("Atacante: " + att);
            console.log("Defensor: " + defensa);
        }
    }
    finishWar(atacante, defensor);
}
function faceWar(ataque, defensa) {
    max_att = Math.max.apply( Math, ataque );
    min_att = Math.min.apply( Math, ataque );
    max_def = Math.max.apply( Math, defensa );
    min_def = Math.min.apply( Math, defensa );
    if (max_att > max_def || min_att > min_def) {
        defensor -= 1;
    }
    else if (max_att < max_def || min_att < min_def) {
        atacante -= 1;
    }
    else if (max_att == max_def || min_att == min_def) {
        atacante -= 1;
        defensor -= 1;
    }
}
function faceSingleWar(ataque, defensa) {
    if (ataque > defensa) {
        defensor -= 1;
    }
    else if (ataque < defensa) {
        atacante -= 1;
    }
    else if (ataque == defensa) {
        atacante -= 1;
        defensor -= 1;
    }
    else {
        console.log("error");
    }
}

function finishWar(atacante, defensor) {
    $( ".batallon_att .troops" ).html(atacante);
    $( ".batallon_def .troops" ).html(defensor);
}