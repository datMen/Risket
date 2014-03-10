var dado = Math.floor(Math.random()*6+1);
var atacante = 0;
var defensor = 0;
function getWar() {
    console.log("Introduce el numero de atacantes: ");
    atacante = readline();
    console.log("Introduce el numero de defensores: ");
    defensor = readline();
    if (defensor > 1 && atacante > 3) {
        while (atacante > 3 && defensor > 1) {
            att = [dado, dado, dado];
            defensa = [dado, dado];
            faceWar(att, defensa);
            console.log("Atacante: " + atacante);
            console.log("Defensor: " + defensor);
        }
    }
    if (defensor > 0 && atacante > 3) {
        while (atacante > 3 && defensor > 1) {
            att = [dado, dado, dado];
            defensa = [dado];
            faceWar(att, defensa);
            console.log("Atacante: " + atacante);
            console.log("Defensor: " + defensor);
        }
    }
    if (defensor > 0 && atacante > 2) {
        while (atacante > 2 &&  defensor > 0) {
            att = [dado, dado];
            defensa = [dado];
            faceSingleWar(att, defensa);
            console.log("Atacante: " + atacante);
            console.log("Defensor: " + defensor);
        }
    }
    if (defensor > 0 && atacante == 2) {
        while (atacante > 1 &&  defensor > 0) {
            att = [dado];
            defensa = [dado];
            faceSingleWar(att, defensa);
            console.log("Atacante: " + atacante);
            console.log("Defensor: " + defensor);
        }
    }
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